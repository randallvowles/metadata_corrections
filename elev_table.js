(function () {
    "use strict";



    // var i;
    // var json_total = {};
    // function _getJSON (){
    //     for(i=1; i < 218; i++) {
    //     $.getJSON("http://home.chpc.utah.edu/~u0540701/metadata_correction/stations_to_investigate_network_" + i + ".json", function(json) {
    //         json_total[i] = json;
    //     })
    // }
    // };
    // _getJSON();
    // $.when(_getJSON()).done(function(){
    //     _networkTableEmitter(json_total)
    // });
    function get(url, callback) {
        var request = new XMLHttpRequest();
        request.open("GET", url)
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                var type = request.getResponseHeader("Content-Type");
                if (type.indexOf("XML") !== -1 && request.responseXML) {
                    callback(request.responseXML);
                } else if (type === "application/json") {
                    callback(JSON.parse(request.responseText));
                    var json_total = (JSON.parse(request.responseText));
                } else {
                    callback(request.responseText);
                }
            }
        }
    }
    get("http://home.chpc.utah.edu/~u0540701/metadata_correction/stations_to_investigate_network_153.json", console.log(request.responseText))
    // var myRequest = new Request("http://home.chpc.utah.edu/~u0540701/metadata_correction/stations_to_investigate_network_153.json");
    // fetch(myRequest)
    //     .then(function(response){
    //         return response.blob();
    //     })
    //     .then(function(response){
    //         var json_total = JSON.parse(myRequest.responseText)
    //     })
    // $.when(fetch(myRequest)).done(function(){
    //     _networkTableEmitter(json_total)
    // });
    
    
    
    return;

    /**
     * 
     * @param {object} json_total
     * @param {object} args - Table configuration arguments
     */
    function _networkTableEmitter(json_total) {
        var rankedSensors = [
            "api_elev", "delta_api", "latitude", "longitude",
            "resolved_method_used", "resolved_elev", "stid"
        ];
        var headerName = [
            "API Elevation", "Delta Elevation", "Latitude", "Longitude",
            "Resolved Method Used", "Resolved Elevation", "STID", "LINK"
        ];

        var tableArgs = {
            table_container: "#nettable-container",
            table_id: "nettable",
            table_class: "",
            sensors: rankedSensors
        };
        var stations = [];
        var i = 0;
        var l = json_total.length;
        while (i < l) {
            var tmp = {};
            rankedSensors.map(function (d) {
                tmp[d] = json_total[i][d];
            });
            stations.push(tmp);
            i++;
        }

        // Create and append table to DOM, but first check to see if we have a table node.
        d3.select("body " + args.table_container).selectAll("table").remove();
        var table = d3.select("body " + args.table_container).append("table")
            .attr("id", args.table_id);

        // Make the header
        table.append("thead").attr("class", "fixed-header").append("tr")
            .selectAll("th").data(headerName).enter().append("th")
            .html(function (d) {
                return d;
            })
            .property("sorted", false)
            .on("click", function (d) {
                if (d !== "STID") {
                    return;
                }
                var _this = this;
                var _state = d3.select(this).property("sorted");
                d3.select(_this).property("sorted", function (d) {
                    return _state ? false : true;
                });
                rows.sort(function (a, b) {
                    return _state ? b.STID.localeCompare(a.STID) : a.STID.localeCompare(b.STID);
                });
            });

        // Create the rows
        var rows = table.append("tbody").selectAll("tr").data(stations).enter().append("tr");

        // Create and populate the cells
        var cells = rows.selectAll('td')
            .data(function (row) {
                return rankedSensors.map(function (d) {
                    return {
                        name: d,
                        value: row[d] === null ? "" : row[d]
                    };
                });
            })
            .enter().append("td")
            .text(function (d) {
                return d.value;
            });
    }
})();