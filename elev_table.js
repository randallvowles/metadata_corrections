(function () {
    "use strict";


    var allFileURLs = [];
    var i;
    for (i = 1; i < 218; i++) {
        var baseUrl = "http://home.chpc.utah.edu/~u0540701/metadata_correction/";
        var fileName = "stations_to_investigate_network_" + String(i) + ".json";
        allFileURLs[i] = baseUrl + fileName;
    }
    var windowURL = getWindowArgs();
    var networkID = windowURL.network;
    var state = {
        baseUrl: 'http://home.chpc.utah.edu/~u0540701/metadata_correction/',
        thisJSONFile: "stations_to_investigate_network_" + String(networkID) + ".json"
    }

    // HTTPFetch(state.baseUrl + state.thisJSONFile, printResponse)
    HTTPFetch(state.baseUrl + state.thisJSONFile, _networkTableEmitter);
    // allFileURLs.map(function(d){
    //     HTTPFetch(d, _networkTableEmitter)
    // })

    var json_total = []

    function HTTPFetch(url, callback) {
        var request = new XMLHttpRequest();
        request.open("GET", url)
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                json_total = JSON.parse(request.responseText)
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
            "stid", "latitiude", "longitude", "api_elev", "resolved_elev", "delta_api", "elev_m_ft",
            "resolve_method_used", "urlLink"
        ];
        var headerName = [
            "STID", "Latitude", "Longitude", "API Elevation", "Resolved Elevation", "Delta Elevation", "API Elev (m to ft), Delta Prime",
            "Resolved Method Used", "LINK"
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
            var delta_prime = json[d]["api_elev"] - (json[d]["delta_api"] / 3.28084)
            if (delta_prime < 100){
                json[d]["elev_m_ft"] = [json[d]["api_elev"] * 3.28084, delta_prime]
            } else {
                json[d]["elev_m_ft"] = json[d]["api_elev"] * 3.28084
            }
            var tmp = {};
            tmp = json[d];
            stations.push(tmp);

        })
        // console.log(stations)
        // console.log(json.length)
        // Create and append table to DOM, but first check to see if we have a table node.
        // d3.select("body " + args.table_container).selectAll("table").remove();
        var networkIDheader = d3.select("body").select("h2").append("h1").text("Network ID: " + String(networkID))
        var table = d3.select("body " + args.table_container).append("table")
            .attr("id", args.table_id);
        // table.append("thead").attr("class", "fixed-header").append("h1").text()
        // Make the header
        table.append("thead").attr("class", "fixed-header").append("tr")
            .selectAll("th").data(headerName).enter().append("th")
            .html(function (d) {
                return d;
            })

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
            .attr("class", function (d) {
                return d.name;
            })
            // .classed("bang", function(d){
            //     console.log(json_total)
            //     if ((json[d]["api_elev"] - ((json[d]["elev_m_ft"]) / 3.28084)) < 10) {
            //         return true;
            //     } else {
            //         return false;
            //     }
            // })

        var hyperlink = d3.selectAll(".urlLink")
            .on("click", function () {
                window.open(d3.select(this).text());
            })
            .classed("urlLink", true);
        d3.select("tbody").selectAll("td").classed("bang", function (d) {
            try {
                return d.value[1] < 100 && d.name === "elev_m_ft" ? true : false;
            } catch (e) {
                console.log(d.value)
            }
        })
    }

    function getWindowArgs() {
        var a = {};
        var b = window.location.search.substring(1).split("&");
        var pair;
        var c;
        var l = b.length;

        if (window.location.search.substring(1).split("=") === 1) {
            return "undefined";
        } else {
            for (var i = 0; i < l; i++) {
                // Grab the values and add a key
                pair = b[i].split("=");
                if (typeof a[pair[0]] === "undefined") {
                    a[pair[0]] = decodeURIComponent(pair[1]);
                    // if (pair[1].split(",").length > 1) {
                    //     a[pair[0]] = pair[1].split(",");
                    // }
                }
            }
            return a;
        }
    }

    // function delta_prime(json) {
    //     d3.selectAll(".elev_m_ft").classed("bang", function (d) {
    //         if ((json[d]["api_elev"] - ((d3.select(this)) / 3.28084)) < 10) {
    //             return true;
    //         } else {
    //             return false;
    //             }
    //         })
    //     }
})();