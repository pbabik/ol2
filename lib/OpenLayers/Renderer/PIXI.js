/* Copyright (c) 2006-2015 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Renderer.js
 */

/**
 * Class: OpenLayers.Renderer.PIXI
 * A renderer based on the PIXI external rendering engine.
 *
 * Inherits:
 *  - <OpenLayers.Renderer>
 */
OpenLayers.Renderer.PIXI = OpenLayers.Class(OpenLayers.Renderer, {

    /**
     * Property: canvas
     * {Canvas} The canvas context object.
     */
    canvas: null,

    /**
     * Property: features
     * {Object} Internal object of feature/style pairs for use in redrawing the layer.
     */
    features: {},


    /**
     * Property: cachedSymbolBounds
     * {Object} Internal cache of calculated symbol extents.
     */
    cachedSymbolBounds: {},

    /**
     * Constructor: OpenLayers.Renderer.Canvas
     *
     * Parameters:
     * containerID - {<String>}
     * options - {Object} Optional properties to be set on the renderer.
     */
    initialize: function(containerID, options) {
        OpenLayers.Renderer.prototype.initialize.apply(this, arguments);
        this.canvas = new PIXI.Container();
        this.engine = new PIXI.autoDetectRenderer(512,256,{antialias: true, transparent: true});
        this.root = this.engine.view;
        this.container.appendChild(this.root);
        this.features = {};
    },

    /**
     * Method: setExtent
     * Set the visible part of the layer.
     *
     * Parameters:
     * extent - {<OpenLayers.Bounds>}
     * resolutionChanged - {Boolean}
     *
     * Returns:
     * {Boolean} true to notify the layer that the new extent does not exceed
     *     the coordinate range, and the features will not need to be redrawn.
     *     False otherwise.
     */
    setExtent: function() {
        OpenLayers.Renderer.prototype.setExtent.apply(this, arguments);
        this.clearCanvas();
    },

    /**
     * Method: eraseGeometry
     * Erase a geometry from the renderer. Because the Canvas renderer has
     *     'memory' of the features that it has drawn, we have to remove the
     *     feature so it doesn't redraw.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     * featureId - {String}
     */
    eraseGeometry: function(geometry, featureId) {
        this.eraseFeatures(this.features[featureId][0]);
    },

    /**
     * APIMethod: supported
     *
     * Returns:
     * {Boolean} Whether or not the browser supports the renderer class
     */
    supported: function() {
        return OpenLayers.CANVAS_SUPPORTED && typeof window.PIXI == 'object';
    },

    /**
     * Method: setSize
     * Sets the size of the drawing surface.
     *
     * Once the size is updated, redraw the canvas.
     *
     * Parameters:
     * size - {<OpenLayers.Size>}
     */
    setSize: function(size) {
        this.size = size.clone();
        this.engine.resize(size.w,size.h);
        this.resolution = null;
    },

    /**
     * Method: drawFeature
     * Draw the feature. Stores the feature in the features list,
     * then redraws the layer.
     *
     * Parameters:
     * feature - {<OpenLayers.Feature.Vector>}
     * style - {<Object>}
     *
     * Returns:
     * {Boolean} The feature has been drawn completely.  If the feature has no
     *     geometry, undefined will be returned.  If the feature is not rendered
     *     for other reasons, false will be returned.
     */
    drawFeature: function(feature, style) {
        if(this.features[feature.id]) {
            this.canvas.removeChild(this.features[feature.id][0]);
            delete this.features[feature.id];
        }
        var rendered;
        if (feature.geometry) {
            style = this.applyDefaultSymbolizer(style || feature.style);
            // don't render if display none or feature outside extent
            var bounds = feature.geometry.getBounds();

            var worldBounds;
            if (this.map.baseLayer && this.map.baseLayer.wrapDateLine) {
                worldBounds = this.map.getMaxExtent();
            }

            var intersects = bounds && bounds.intersectsBounds(this.extent, {worldBounds: worldBounds});

            rendered = (style.display !== "none") && !!bounds && intersects;
            if(rendered) {
                this.drawGeometry(feature.geometry,style,feature.id);
                if(style.label) {
                    this.drawText(feature.geometry.getCentroid(),style,feature.id)
                }
            }
        }
        return rendered;
    },

    /**
     * Method: drawGeometry
     * Used when looping (in redraw) over the features; draws
     * the canvas.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     * style - {Object}
     */
    drawGeometry: function(geometry, style, featureId) {
        var className = geometry.CLASS_NAME;
        if ((className == "OpenLayers.Geometry.Collection") ||
            (className == "OpenLayers.Geometry.MultiPoint") ||
            (className == "OpenLayers.Geometry.MultiLineString") ||
            (className == "OpenLayers.Geometry.MultiPolygon")) {
            var worldBounds = (this.map.baseLayer && this.map.baseLayer.wrapDateLine) && this.map.getMaxExtent();
            for (var i = 0; i < geometry.components.length; i++) {
                this.calculateFeatureDx(geometry.components[i].getBounds(), worldBounds);
                this.drawGeometry(geometry.components[i], style, featureId);
            }
            return;
        }
        switch (geometry.CLASS_NAME) {
            case "OpenLayers.Geometry.Point":
                this.drawPoint(geometry, style, featureId);
                break;
            case "OpenLayers.Geometry.LineString":
                this.drawLineString(geometry, style, featureId);
                break;
            case "OpenLayers.Geometry.LinearRing":
                this.drawLinearRing(geometry, style, featureId);
                break;
            case "OpenLayers.Geometry.Polygon":
                this.drawPolygon(geometry, style, featureId);
                break;
            default:
                break;
        }
    },

    /**
     * Method: drawExternalGraphic
     * Called to draw External graphics.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     * style    - {Object}
     * featureId - {String}
     */
    drawExternalGraphic: function(geometry, style, featureId) {
        //@TODO
        throw new Error('NotImplementedError');
    },

    /**
     * Method: drawNamedSymbol
     * Called to draw Well Known Graphic Symbol Name.
     * This method is only called by the renderer itself.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     * style    - {Object}
     * featureId - {String}
     */
    drawNamedSymbol: function(geometry, style, featureId) {
      //@TODO
      throw new Error('NotImplementedError');
    },

    stringToHex: function(str) {
       return Number(str.replace('#','0x'));
    },

    /**
     * Method: drawPoint
     * This method is only called by the renderer itself.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     * style    - {Object}
     * featureId - {String}
     */
    drawPoint: function(geometry, style, featureId) {
        if(style.graphic !== false) {
            if(style.externalGraphic) {
                this.drawExternalGraphic(geometry, style, featureId);
            } else if (style.graphicName && (style.graphicName != "circle")) {
                this.drawNamedSymbol(geometry, style, featureId);
            } else {
                var pt = this.getLocalXY(geometry);
                var p0 = pt[0];
                var p1 = pt[1];
                var sw = style.strokeWidth || 1;
                var fc = this.stringToHex(style.fillColor) || 0xFEFEFE;
                var sc = this.stringToHex(style.strokeColor) || 0xABECDE;
                if(!isNaN(p0) && !isNaN(p1)) {
                    var twoPi = Math.PI*2;
                    var radius = style.pointRadius;
                    var graphic = new PIXI.Graphics();
                    graphic.beginFill(fc);
                    graphic.lineStyle(sw,fc,sc);
                    graphic.drawCircle(p0,p1,radius);
                    this.canvas.addChild(graphic);
                    this.features[featureId] = [graphic,style,geometry];
                    if(!this.locked) {
                        this.engine.render(this.canvas);
                    }
            }
        }
    }
    },

    /**
     * Method: drawLineString
     * This method is only called by the renderer itself.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     * style    - {Object}
     * featureId - {String}
     */
    drawLineString: function(geometry, style, featureId) {
        style = OpenLayers.Util.applyDefaults({fill: false}, style);
        var path = this.drawLinearRing(geometry, style, featureId);
        this.canvas.addChild(path);
        this.features[featureId] = [path,style,geometry];
        if(!this.locked) {
            this.engine.render(this.canvas);
        }
    },

    /**
     * Method: drawLinearRing
     * This method is only called by the renderer itself.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     * style    - {Object}
     * featureId - {String}
     */
    drawLinearRing: function(geometry, style, featureId) {
        if (style.fill !== false) {
            return this.renderPath(geometry, style, featureId, "fill");
        }
        if (style.stroke !== false) {
            return this.renderPath(geometry, style, featureId, "stroke");
        }
    },

    /**
     * Method: renderPath
     * Render a path with stroke and optional fill.
     */
    renderPath: function(geometry, style, featureId, type) {
        var components = geometry.components;
        var len = components.length;
        var graphic = new PIXI.Graphics();
        var sw = style.strokeWidth || 1;
        var fc = this.stringToHex(style.fillColor) || 0x000000;
        var sc = this.stringToHex(style.strokeColor) || this.stringToHex(style.fillColor) || 0xFFFFFF;
        var strokeAlpha = style.strokeOpacity || 1;
        var fillAlpha = style.fillOpacity || 1;
        if(type == 'fill') {
            graphic.beginFill(fc,fillAlpha);
        }
        graphic.lineStyle(sw,sc,strokeAlpha);
        var start = this.getLocalXY(components[0]);
        var x = start[0];
        var y = start[1];
        if (!isNaN(x) && !isNaN(y)) {
            graphic.moveTo(start[0], start[1]);
            for (var i=1; i<len; ++i) {
                var pt = this.getLocalXY(components[i]);
                graphic.lineTo(pt[0], pt[1]);
            }
            if (type === "fill") {
                graphic.endFill();
            }
            this.canvas.addChild(graphic);
            return graphic;
        }
    },

    /**
     * Method: drawPolygon
     * This method is only called by the renderer itself.
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     * style    - {Object}
     * featureId - {String}
     */
    drawPolygon: function(geometry, style, featureId) {
        var components = geometry.components;
        var len = components.length;
        var outer = this.drawLinearRing(components[0], style, featureId);
        // erase inner rings
        for (var i=1; i<len; ++i) {
              var ring = this.drawLinearRing(components[i],style,featureId);
              outer.addChild(ring);
        }
        this.canvas.addChild(outer);
        this.features[featureId] = [outer,style,geometry];
        if(!this.locked) {
            this.engine.render(this.canvas);
        }
    },

    /**
     * Method: drawText
     * This method is only called by the renderer itself.
     *
     * Parameters:
     * location - {<OpenLayers.Point>}
     * style    - {Object}
     */
    drawText: function(location, style) {
        var pt = this.getLocalXY(location);
        var fontStyle = [style.fontStyle ? style.fontStyle : "normal",
                         "normal",
                         style.fontWeight ? style.fontWeight : "normal",
                         style.fontSize ? style.fontSize : "1em",
                         style.fontFamily ? style.fontFamily : "sans-serif"].join(" ");
        var fontParams = {
            font: fontStyle,
            dropShadow: false,
            fill: this.stringToHex(style.fontColor) || 0x000000
        }
        if(style.labelOutlineWidth) {
            fontParams.strokeThickness = style.labelOutlineWidth || 1;
            fontParams.stroke = this.stringToHex(style.labelOutlineColor);
        }
        var pixiText = new PIXI.Text(style.label || '', fontParams);
        pixiText.x = pt[0];
        pixiText.y = pt[1];
        this.canvas.addChild(pixiText);
    },

    /**
     * Method: getLocalXY
     * transform geographic xy into pixel xy
     *
     * Parameters:
     * point - {<OpenLayers.Geometry.Point>}
     */
    getLocalXY: function(point) {
        var resolution = this.getResolution();
        var extent = this.extent;
        var x = ((point.x - this.featureDx) / resolution + (-extent.left / resolution));
        var y = ((extent.top / resolution) - point.y / resolution);
        return [x, y];
    },

    /**
     * Method: clear
     * Clear all vectors from the renderer.
     */
    clear: function() {
        this.clearCanvas();
        this.features = {};
    },

    /**
     * Method: clearCanvas
     * Clear the canvas element of the renderer.
     */
    clearCanvas: function() {
        this.canvas.removeChildren();
        if(!this.locked) {
            this.engine.render(this.canvas);
        }
    },

    /**
     * Method: getFeatureIdFromEvent
     * Returns a feature id from an event on the renderer.
     *
     * Parameters:
     * evt - {<OpenLayers.Event>}
     *
     * Returns:
     * {<OpenLayers.Feature.Vector} A feature or undefined.  This method returns a
     *     feature instead of a feature id to avoid an unnecessary lookup on the
     *     layer.
     */
    getFeatureIdFromEvent: function(evt) {
        var featureId, feature;
        var pixipoint = new PIXI.Point(evt.xy.x,evt.xy.y);
        for(var f in this.features) {
            if(vector_layer.renderer.features[f][0].containsPoint(pixipoint)) {
                return f;
            }
        }
        return feature;
    },

    /**
     * Method: eraseFeatures
     * This is called by the layer to erase features; removes the feature from
     *     the list, then redraws the layer.
     *
     * Parameters:
     * features - {Array(<OpenLayers.Feature.Vector>)}
     */
    eraseFeatures: function(features) {
        if(!(OpenLayers.Util.isArray(features))) {
            features = [features];
        }
        for(var i=0; i<features.length; ++i) {
            var feature_to_delete = this.features[features[i].id];
            this.canvas.removeChild(feature_to_delete[0]);
            delete this.features[features[i].id];
        }
        if(!this.locked) {
            this.engine.render(this.canvas);
        }
    },

    lock: function() {
       this.locked = true;
       console.time('renderer lock');
    },

    unlock: function() {
        this.locked = false;
        this.engine.render(this.canvas);
        console.timeEnd('renderer lock');
    },

    /**
     * Method: redraw
     * The real 'meat' of the function: any time things have changed,
     *     redraw() can be called to loop over all the data and (you guessed
     *     it) redraw it.  Unlike Elements-based Renderers, we can't interact
     *     with things once they're drawn, to remove them, for example, so
     *     instead we have to just clear everything and draw from scratch.
     */
    redraw: function() {
        if (!this.locked) {
            this.clearCanvas();
        //    var labelMap = [];
            var feature, geometry, style;
            var worldBounds = (this.map.baseLayer && this.map.baseLayer.wrapDateLine) && this.map.getMaxExtent();
            for (var id in this.features) {
                if (!this.features.hasOwnProperty(id)) { continue; }
                var geometry = this.features[id][2];
                this.calculateFeatureDx(geometry.getBounds(), worldBounds);
                style = this.features[id][1];
                this.drawGeometry(geometry, style, id);
                /*if(style.label) {
                    labelMap.push([feature, style]);
                }*/
            }
            var item;
            /*for (var i=0, len=labelMap.length; i<len; ++i) {
                item = labelMap[i];
                this.drawText(item[0].geometry.getCentroid(), item[1]);
            }*/
        }
    },

    CLASS_NAME: "OpenLayers.Renderer.PIXI"
});
