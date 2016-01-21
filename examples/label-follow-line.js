
    // style the vectorlayer
    var styleMap = new OpenLayers.StyleMap({
        'default': new OpenLayers.Style({
            strokeColor: "#333333",
            strokeWidth: 1.2,
            strokeOpacity: 1,
            label: 'Lorem ipsum dolor sit amet enim etiam ullamcorper',
            labelFollowLine: true
        })
    });

    // the vectorlayer
    var vectorlayer = new OpenLayers.Layer.Vector('Vectorlayer', {
        isBaseLayer: true,
        styleMap: styleMap
    });

    var vector = OpenLayers.Geometry.fromWKT("LINESTRING (18.2169285 50.0788042,18.2166262 50.0785414,18.2161234 50.0780898,18.2154094 50.0774614,18.2150988 50.0772028,18.2148354 50.0770007,18.2145185 50.0767715,18.2141338 50.0765137,18.2137063 50.0762518,18.2131764 50.0759516,18.2125859 50.0756394,18.2100419 50.0743382,18.2093792 50.0740246,18.2087605 50.0737499,18.2080075 50.0734397,18.207434 50.0732155,18.2067133 50.0729481,18.2058728 50.0726581,18.2050229 50.0723908,18.2017827 50.0714403,18.1963171 50.0698462,18.1960334 50.0697624,18.1884312 50.0675331,18.187682 50.0673134,18.1865558 50.0669847,18.1852473 50.0666029,18.1846591 50.0664292,18.1840811 50.0662754,18.1834902 50.0661442,18.1828261 50.066025,18.1822179 50.065948,18.181575 50.0658925,18.1807401 50.065857,18.1800725 50.0658571,18.1794208 50.0658763,18.1746482 50.066079,18.1738902 50.0660959,18.1732301 50.0660904,18.1725184 50.0660453,18.1717262 50.0659624,18.170973 50.0658403,18.1703395 50.0657111,18.1697947 50.0655724,18.1691839 50.0653945,18.1685162 50.0651613,18.1679596 50.0649362,18.167401 50.0646829,18.1668987 50.0644166,18.1595115 50.0604472,18.1588826 50.0601306,18.1582273 50.0598514,18.157563 50.0596056,18.1568494 50.0593936,18.1562158 50.0592371,18.1555207 50.0591006,18.1547509 50.0589855,18.1539398 50.0589094,18.1534087 50.0588824,18.1528267 50.0588713,18.1522246 50.0588756,18.1502707 50.0589404,18.1449152 50.059101,18.144207 50.0591329,18.1435343 50.0591896,18.1428462 50.0592813,18.1422432 50.0593995,18.1415908 50.0595635,18.1409962 50.059753,18.1404763 50.0599565,18.1398812 50.0602324,18.1393386 50.0605334,18.1388807 50.0608243,18.1373825 50.0618036,18.1370954 50.0619957,18.1313175 50.0657581,18.1313175 50.0657581,18.1312433 50.0658075,18.1312433 50.0658075,18.130969 50.0659736,18.130693 50.0661328,18.1304223 50.0662836,18.1300972 50.0664448,18.1297624 50.0665959,18.1293438 50.0667679,18.1288281 50.0669669,18.128498 50.0670749,18.1280494 50.0672056,18.1276173 50.0673209,18.1271646 50.0674276,18.1266012 50.0675436,18.1260939 50.0676366,18.118674 50.0688869,18.1115307 50.0700904,18.1113566 50.07012,18.1113566 50.07012,18.1111772 50.0701513,18.1111772 50.0701513,18.1081948 50.0706518,18.1060966 50.0710128,18.1052931 50.0711769,18.1045069 50.0713684,18.1035055 50.0716535,18.1026342 50.0719495,18.1018662 50.0722549,18.1012018 50.0725745,18.1007974 50.0727859,18.1007974 50.0727859,18.100264 50.0730725,18.100264 50.0730725,18.0996623 50.0734283,18.0992046 50.0737412,18.0987006 50.0741266,18.0982687 50.0744805,18.0978701 50.0748424,18.0974397 50.0752591,18.094439 50.0783033,18.0941814 50.0785707,18.0939142 50.0788632,18.0936457 50.0791955,18.0934403 50.0794913,18.0932627 50.0797722,18.0930866 50.0801192,18.0929573 50.0804165,18.0928494 50.0807077,18.0927625 50.0810048,18.0927131 50.081241,18.0926736 50.0814628,18.0926443 50.0817573,18.0926303 50.0821554,18.0926607 50.0827844,18.0926724 50.0829367,18.0926724 50.0829367,18.0926786 50.0830043,18.0926786 50.0830043,18.0927102 50.0832335,18.0928686 50.0841067,18.093214 50.0858717,18.0936835 50.0882405,18.0937239 50.0885037,18.0937431 50.0887708,18.0937357 50.0890227,18.0937143 50.0892733,18.0936655 50.0895478,18.0935382 50.0901159,18.0934392 50.090559,18.0933127 50.0911326,18.093188 50.0915451,18.093061 50.0918792,18.093061 50.0918792,18.0930108 50.0919967,18.0930108 50.0919967,18.0928511 50.0923866,18.0926517 50.0928295,18.0924348 50.0932286,18.0921964 50.0936159,18.0919099 50.0940243,18.091633 50.0943829,18.0912877 50.0947945,18.0912877 50.0947945,18.0910358 50.0951021,18.0910358 50.0951021,18.0905922 50.0956409,18.0898466 50.0964952,18.0893302 50.097044,18.0887872 50.0976001,18.0880191 50.0983555,18.0872921 50.0991126,18.0872921 50.0991126,18.0868104 50.099622,18.0868104 50.099622,18.0863552 50.1001135,18.0858975 50.1005759,18.0854934 50.1009233,18.0850236 50.101271,18.0845624 50.1015857,18.0840482 50.1019053,18.0835477 50.1021933,18.0829692 50.1024911,18.0823886 50.1027751,18.078348 50.1046744,18.077721 50.1049547,18.0771743 50.1051815,18.0766095 50.1053987,18.0760208 50.1056091,18.0753693 50.1058201,18.0747329 50.1060147,18.0740711 50.1061968,18.0734258 50.1063632,18.0674789 50.1078578,18.0668235 50.1080331,18.0661598 50.1082213,18.0653402 50.1084748,18.0645417 50.1087409,18.0636946 50.1090396,18.060908 50.1100374,18.0566221 50.1115546,18.0562411 50.1116886,18.054152 50.1124287,18.0526224 50.1129716,18.0521013 50.1131709,18.0478041 50.1149666,18.0362611 50.1198303,18.0356421 50.1200866,18.0350087 50.1203332,18.0343688 50.1205773,18.0316168 50.1216041,18.0280696 50.1229277,18.0176991 50.1267991,18.0117348 50.1290244,18.0112956 50.1291918,18.0112956 50.1291918,18.0111805 50.1292386,18.0111805 50.1292386,18.0105501 50.1295029,18.0099568 50.1297762,18.0093918 50.1300619,18.0088435 50.1303578,18.0082891 50.1306858,18.0075252 50.131172,17.9986918 50.1378023,17.9933897 50.1417889,17.9933897 50.1417889,17.9933185 50.1418442,17.9933185 50.1418442,17.9898615 50.1444362,17.98932 50.1448617,17.9888344 50.1452781,17.9883686 50.1457225,17.9879733 50.1461434,17.9875739 50.1465926,17.985345 50.1491908,17.9841803 50.1505422,17.9839392 50.1507913,17.9837113 50.1510014,17.9830619 50.1516324,17.9824533 50.1522063,17.9821506 50.152475,17.9801281 50.1541337,17.9774212 50.1563041,17.9762389 50.1572321,17.9759563 50.1574616,17.9744041 50.1587217,17.9739774 50.1590283,17.9735347 50.1593257,17.9731125 50.1595819,17.9726459 50.1598338,17.9721606 50.1600767,17.9716957 50.1602776,17.9712297 50.160463,17.9706575 50.1606528,17.9699923 50.160851,17.9692655 50.1610486,17.9684244 50.1612559,17.9676011 50.1614454,17.9669159 50.161575,17.9662704 50.1616585,17.9656372 50.1617154,17.9650363 50.1617511,17.9597089 50.162006,17.958919 50.1620255,17.9580425 50.1620236,17.9545953 50.1619761,17.9509031 50.161926,17.9500091 50.1619019,17.9490674 50.1618553,17.9482823 50.1617671,17.9475457 50.1616353,17.9468346 50.1614407,17.9462333 50.1612224,17.9456326 50.1609619,17.9450956 50.1606658,17.9446013 50.1603448,17.9424947 50.1588005,17.9419844 50.1584507,17.9414757 50.1581437,17.9408773 50.1578482,17.9402998 50.1575816,17.9397085 50.1573577,17.9390626 50.1571459,17.9383897 50.1569524,17.9351348 50.1560913,17.9344704 50.1559458,17.9338877 50.1558392,17.9332381 50.1557338,17.9327158 50.155678,17.9321349 50.1556359,17.9314438 50.1556142,17.9307451 50.1556342,17.9300037 50.155687,17.9292031 50.1557607,17.9277471 50.1559547,17.9271165 50.1560319,17.9264669 50.1560958,17.9258392 50.1561282,17.9253274 50.1561354,17.9247292 50.1561238,17.9187593 50.1557724,17.9181296 50.1557385,17.9174705 50.1557197,17.9168912 50.1557083,17.9163514 50.1557223,17.9157914 50.1557579,17.9152179 50.1558186,17.914641 50.1558994,17.9075323 50.1570374,17.9048977 50.1574748,17.9042042 50.1575771,17.9034902 50.157671,17.9028701 50.157731,17.9021634 50.1577791,17.8986596 50.1579373,17.8978776 50.1579838,17.8970623 50.1580561,17.8960625 50.1581668,17.8953284 50.1582647,17.8945111 50.1584052,17.8937373 50.1585481,17.888891 50.1596512,17.8850383 50.1605141,17.8840403 50.1607669,17.8803723 50.1618671,17.8786614 50.1624396,17.8786614 50.1624396,17.8777457 50.1627631,17.8777457 50.1627631,17.8755074 50.1636501,17.869722 50.1662108,17.8600932 50.1704837,17.8576403 50.1716249,17.8567106 50.1720881,17.8548401 50.1730637,17.8478862 50.1767079,17.841563 50.1800202,17.8360853 50.1828739,17.8352563 50.1833456,17.834442 50.1838709,17.8338785 50.1843043,17.8334861 50.1846387,17.8330898 50.1849959,17.8328015 50.1852914,17.8324478 50.1856891,17.8320754 50.1861344,17.8317646 50.1865688,17.8314806 50.1870138,17.8312011 50.1875143,17.828695 50.1922981,17.8285051 50.1926074,17.8282659 50.1929465,17.828 50.1932642,17.8277406 50.1935134,17.8274201 50.1937916,17.8270705 50.1940599,17.8267784 50.1942704,17.8264761 50.1944493,17.8260915 50.1946538,17.8257178 50.1948249,17.8253544 50.194972,17.8250107 50.1950867,17.8246218 50.1952037,17.8242079 50.1953108,17.823792 50.1954015,17.8195079 50.1961581,17.8171698 50.1965904,17.8147015)");
    vectorlayer.addFeatures([new OpenLayers.Feature.Vector(vector)]);
    var maxExtent = vectorlayer.getDataExtent();
    // instanciate the map
    map = new OpenLayers.Map("map", {
        fractionalZoom: true,
        maxExtent: maxExtent,
        layers: [vectorlayer]
    });
    map.zoomToMaxExtent();
