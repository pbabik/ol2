/**
 * @requires OpenLayers/Topology/Rule.js
 */

/**
 * Class: OpenLayers.Topology.Rule.VerticesMustIntersect
 * This rule will be satisfied if each considered vertex intersects at least one other vertex.
 */
OpenLayers.Topology.Rule.VerticesMustIntersect = OpenLayers.Class(OpenLayers.Topology.Rule, {
    layer: null,
    
    /**
     * Constructor: OpenLayers.Topology.Rule.VerticesMustIntersect
     *
     * Parameters:
     * options - {Object} Optional object whose properties will be set on the
     *     instance.
     * 
     * Valid options properties:
     * enforce - {Boolean} Set to true if the rule should be enforced on geometry operations.
     */
    initialize: function(options) {
        OpenLayers.Topology.Rule.prototype.initialize.apply(this, arguments);
    },
    
    /** 
     * Property: cache 
     * {Object} A vertex intersection cache.
     */
    cache: {},
    
    /**
     * Method: onVertexmodified
     * Handler for the vertexmodified event that will enforce the rule if enabled
     */
    onVertexmodified: function(e) {
        var i,ilen;
        
        var vertex = e.vertex;
        var feature = e.feature;
        
        var vc = this.cache[vertex.id];
        if (vc === undefined) {return;}

        for (i=0, ilen=vc.length; i<ilen; i++) {
            var featurei = vc[i].feature;
            var vertexi = vc[i].vertex;
            vertexi.move(e.dx, e.dy);
            if (featurei.state != OpenLayers.State.INSERT && featurei.state != OpenLayers.State.DELETE) {
                featurei.state = OpenLayers.State.UPDATE;
            }
            this.layer.drawFeature(featurei);
        }
    },
    
    /**
     * Method: onVertexadded
     * Handler for the vertexadded event that will enforce the rule if enabled
     */
    onVertexadded: function(e) {
        var i,ilen,
            j,jlen,
            features = this.layer.features,
            vertex = e.vertex,
            feature = e.feature,
            newVertex = new OpenLayers.Geometry.Point(e.ox, e.oy),
            startpoint = e.startpoint,
            endpoint = e.endpoint;

        // use vertex intersection caches of start and endpoint to calculate if and where to put additional vertices 
        var vci = this.cache[startpoint.id];
        var vcj = this.cache[endpoint.id];
        for (i=0, ilen=vci.length; i<ilen; i++) {
            var featurei = vci[i].feature;
            var vertexi = vci[i].vertex;
            for (j=0, jlen=vcj.length; j<jlen; j++) {
                var featurej = vcj[j].feature;
                var vertexj = vcj[j].vertex;
                
                if (vertexi.parent !== vertexj.parent) { continue; }
                    
                var linearRing = vertexi.parent;
                
                var vertexii = OpenLayers.Util.indexOf(linearRing.components, vertexi);
                var vertexji = OpenLayers.Util.indexOf(linearRing.components, vertexj);
                
                var newindex = 0;
                // test for in sequence vertices
                if ( Math.abs(vertexii-vertexji) !== 1) {
                    // test for nodes
                    if (!(linearRing.components.length-2 === vertexii && vertexji === 0)) {
                        newindex = 1;
                        if (!(linearRing.components.length-2 === vertexji && vertexii === 0)) {
                            continue;
                        }
                    }
                }

                // use highest index as index for new vertex
                if (vertexii>vertexji) {
                    newindex = newindex + vertexii;
                }
                else {
                    newindex = newindex + vertexji;
                }
                
                // need to replicate the drag event movement
                newVertex.move(e.dx, e.dy);
                linearRing.addComponent(newVertex, newindex);
                
                this.cache[vertex.id] = [];
                this.cache[vertex.id].push({vertex: newVertex, feature: featurej});
                this.cache[newVertex.id] = [];
                this.cache[newVertex.id].push({vertex: vertex, feature: feature});
            }
        }        
    },

    /**
     * Method: onVertexremoved
     * Handler for the vertexremoved event that will enforce the rule if enabled
     */
    onVertexremoved: function(e) {
        var i,ilen;
        
        var vertex = e.vertex;
        var feature = e.feature;
        
        var vc = this.cache[vertex.id];
        if (vc === undefined) {return;}

        for (i=0, ilen=vc.length; i<ilen; i++) {
            var featurei = vc[i].feature;
            var vertexi = vc[i].vertex;
            vertexi.parent.removeComponent(vertexi);
            if (featurei.state != OpenLayers.State.INSERT && featurei.state != OpenLayers.State.DELETE) {
                featurei.state = OpenLayers.State.UPDATE;
            }
            this.layer.drawFeature(featurei);
        }
    },
    
    /**
     * Method: setEnforce
     * Attach the onVertexmodified on enforcement and vice verca.
     * 
     * Parameters:
     * enforce - {Boolean} To enforce or not.
     */
    setEnforce: function(enforce) {
        if (enforce) {
            this.layer.events.registerPriority("vertexadded", this, this.onVertexadded);
            this.layer.events.registerPriority("vertexmodified", this, this.onVertexmodified);
            this.layer.events.registerPriority("vertexremoved", this, this.onVertexremoved);
        }
        else {
            this.layer.events.unregister("vertexadded", this, this.onVertexadded);
            this.layer.events.unregister("vertexmodified", this, this.onVertexmodified);
            this.layer.events.unregister("vertexremoved", this, this.onVertexremoved);
        }
    },

    /**
     * Method: calcVertexCache
     * Calculate vertex cache for single vertex against a geometry that supports getVertices.
     * 
     * Parameters:
     * vertex - {<OpenLayers.Geometry.Point>} The vertex to calculate the cache for.
     * feature - {<OpenLayers.Feature.Vector>} The feature that the vertices to check belongs to.
     * 
     * Returns:
     * {Boolean} The vertex are intersecting one or more of the the feature vertices.
     */
    calcVertexCache: function(vertex, feature) {
        var i, ilen, hasIntersectingVertices = false;

        if (this.cache[vertex.id] === undefined) {
            this.cache[vertex.id] = [];
        }

        var vertices = feature.geometry.getVertices();
        for (i=0, ilen=vertices.length; i<ilen; i++) {
            var vertexi = vertices[i];
            
            if (vertex.equals(vertexi)) {
                this.cache[vertex.id].push({vertex: vertexi, feature: feature});
                hasIntersectingVertices = true;
            }            
        }
        
        return hasIntersectingVertices;
    },
    
    /**
     * Method: areVerticesIntersecting
     * Checks if vertices are intersecting other vertices using the cache.
     * 
     * Parameters:
     * vertices - {Array} Array of vertices.
     * 
     * Returns:
     * {Boolean} The vertices are intersecting other vertices.
     */
    areVerticesIntersecting: function(vertices) {
        var i, ilen, state = true;
        
        for (i=0, ilen=vertices.length; i<ilen; i++) {
            var vertexi = vertices[i];
            
            if (this.cache[vertexi.id].length===0) { 
                state = false;
            }
        }
        
        return state;
    },

    /**
     * Method: getIntersectingFeatures
     * Uses the vertex intersection cache to find the involved intersecting features in a collection of vertices.
     * 
     * Parameters:
     * vertices - {Array} Array of vertices.
     * 
     * Returns:
     * {Array} The features that have vertices that intersect the input vertices.
     */
    getIntersectingFeatures: function(vertices) {
        var i, ilen, j, jlen, k, klen, features = [];
        
        var contains = function(feature) {
            var j, jlen;
            
            for (j=0, jlen=features.length; j<jlen; j++) {
                if (features[j] === feature) {
                    return true;
                }
            }
            
            return false;
        };
        
        for (i=0, ilen=vertices.length; i<ilen; i++) {
            var vertexi = vertices[i];
            
            var vc = this.cache[vertexi.id];
            
            for (k=0, klen=vc.length; k<klen; k++) {
                var feature = vc[k].feature;
                if (!contains(feature)) {
                    features.push(feature);
                }
            }
        }
        
        return features;
    },
    
    /**
     * Method: calcVertexCaches
     * Checks if vertices are intersecting other vertices using the cache.
     * 
     * Parameters:
     * feature - {<OpenLayers.Vector.Feature>} The feature to process.
     * calcIntersecting - {Boolean} If true, features of vertices that are intersecting the 
     *     input feature vertices will also have their vertex cache recalculated.
     */
    calcVertexCaches: function(feature, calcIntersecting) {
        var i, ilen, j, jlen, 
            layer = this.layer,
            geometry = feature.geometry,
            vertices = geometry.getVertices(),
            features = layer.features;
        
        if (!(geometry instanceof OpenLayers.Geometry.Polygon)) { return; }
        
        for (i=0, ilen=vertices.length; i<ilen; i++) {
            delete this.cache[vertices[i].id];
        }
        
        for (i=0, ilen=features.length; i<ilen; i++) {
            var featurei = features[i];
            if (featurei === feature) { continue; }
            
            var geometryi = featurei.geometry;
            
            if (!(geometryi instanceof OpenLayers.Geometry.Polygon)) { continue; }
    
            // only check intersecting geometry which (I presume) is an optimization ( tests indicate that it is slower :/ )
            //if (geometry.intersects(geometryi) === false) { continue; } 

            for (j=0, jlen=vertices.length; j<jlen; j++) {
                var vertexj = vertices[j];
                
                this.calcVertexCache(vertexj, featurei);
            }
        }
        
        if (calcIntersecting === true) {
            this.calcFeatures(this.getIntersectingFeatures(vertices));
        }
        
        // TODO: make optional?
        if (this.areVerticesIntersecting(vertices)) {
            feature.renderIntent = "default";
            layer.drawFeature(feature);
        }
        else {
            feature.renderIntent = "error";
            layer.drawFeature(feature);
        }
    },
    
    /**
     * Method: calcFeatures
     * Calculate vertex cache for features
     * 
     * Parameters:
     * features - {Array} The features to process. If not supplied all 
     *     features of the attached layer will be processed.
     */ 
    calcFeatures: function(features) {
        var i, ilen;
                
        for (i=0, ilen=features.length; i<ilen; i++) {            
            this.calcVertexCaches(features[i], false);
        }
    },
    
    /**
     * Method: calc
     * Calculate vertex cache for all features
     * 
     * Parameters:
     * features - {Array} The features to process. If not supplied all 
     *     features of the attached layer will be processed.
     */ 
    calc: function() {
        this.calcFeatures(this.layer.features);
    },
    
    /**
      * Method: activate
      * Will cause the rule state to be calculated once and each time whenever
      * geometry is changed in a way that affects the rule.
      */
    activate: function() {
        this.calc();
        
        this.layer.events.registerPriority("featureunselected", this, this.calc);
        this.layer.events.registerPriority("featuremodified", this, this.calc);
        this.layer.events.registerPriority("featureadded", this, this.calc);
    },
    
    /**
      * Method: deactivate
      * Will stop the rule state to be calculated.
      */
    deactivate: function() {
        this.layer.events.unregister("featureunselected", this, this.calc);
        this.layer.events.unregister("featuremodified", this, this.calc);
        this.layer.events.unregister("featureadded", this, this.calc);
    },
    
    /**
     * Method: destroy
     * Cleanup.
     */
    destroy: function() {
        this.deactivate();
    }

});
