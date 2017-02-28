(function () {
    "use strict";


    var allFileURLs = [];
    var i;
    for (i = 1; i < 218; i++) {
        var baseUrl = "http://home.chpc.utah.edu/~u0540701/metadata_correction/";
        var fileName = "stations_to_investigate_network_" + String(i) + ".json";
        allFileURLs[i] = baseUrl + fileName;
        }
    var state = {
        baseUrl: 'http://home.chpc.utah.edu/~u0540701/metadata_correction/',
        thisJSONFile: "stations_to_investigate_network_153.json"
    }

    // HTTPFetch(state.baseUrl + state.thisJSONFile, printResponse)
    // HTTPFetch(state.baseUrl + state.thisJSONFile, _networkTableEmitter)
    allFileURLs.map(function(d){
        HTTPFetch(d, _networkTableEmitter)
    })

    function HTTPFetch(url, callback) {
        var request = new XMLHttpRequest();
        request.open("GET", url)
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {

                callback(JSON.parse(request.responseText))
            }
        }
        request.send(null);
    }

    function printResponse(a) {
        console.log('URL To Fetch')
        console.log(state.baseUrl + state.thisJSONFile)
        console.log(a)
    }

    /**
     * 
     * @param {object} json
     * @param {object} args - Table configuration arguments
     */
    function _networkTableEmitter(json) {
        // console.log(json)
        // var rankedSensors = [
        //     "api_elev", "delta_api", "latitude", "longitude",
        //     "resolved_method_used", "resolved_elev", "stid"
        // ];
        // var headerName = [
        //     "API Elevation", "Delta Elevation", "Latitude", "Longitude",
        //     "Resolved Method Used", "Resolved Elevation", "STID", "LINK"
        // ];
        var rankedSensors = [
            "stid", "latitiude", "longitude", "api_elev", "delta_api",
            "resolve_method_used", "resolved_elev", "urlLink"
        ];
        var headerName = [
            "STID", "Latitude", "Longitude", "API Elevation", "Delta Elevation", 
            "Resolved Method Used", "Resolved Elevation", "LINK"
        ];

        var googleURL = "http://maps.google.com/maps?z=12&t=k&q=loc:"

        var args = {
            table_container: "#nettable-container",
            table_id: "nettable",
            table_class: "",
            sensors: rankedSensors
        };
        // var json1 = JSON.parse(json)
        var stations = [];
        (Object.keys(json)).map(function (d) {
            json[d]["urlLink"] = googleURL + String(json[d]["latitiude"]) + "+" + String(json[d]["longitude"])
            var tmp = {};
            tmp = json[d];
            stations.push(tmp);
            
        })
        console.log(stations)
        // console.log(json.length)
        // Create and append table to DOM, but first check to see if we have a table node.
        // d3.select("body " + args.table_container).selectAll("table").remove();
        var table = d3.select("body " + args.table_container).append("table")
            .attr("id", args.table_id);

        // Make the header
        table.append("thead").attr("class", "fixed-header").append("tr")
            .selectAll("th").data(headerName).enter().append("th")
            .html(function (d) {
                return d;
            })
        // .property("sorted", false)
        // .on("click", function (d) {
        //     if (d !== "STID") {
        //         return;
        //     }
        //     var _this = this;
        //     var _state = d3.select(this).property("sorted");
        //     d3.select(_this).property("sorted", function (d) {
        //         return _state ? false : true;
        //     });
        //     rows.sort(function (a, b) {
        //         return _state ? b.STID.localeCompare(a.STID) : a.STID.localeCompare(b.STID);
        //     });
        // });

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
                // console.log("here we are2")
            })
            .attr("id", function (d) {
                return d.name;
            })
        // var hyperlink = d3.selectAll("urlLink")
        //     .on("click", function () {
        //         window.open(d3.select(this).value());
        //     });
    }
})();