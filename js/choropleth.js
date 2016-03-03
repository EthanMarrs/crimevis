var width = $("#main").css("width"),
    height = $(window).height() - 130;

var provinceSvg;
var stationSvg;

var provinceColors = ["rgb(198,219,239)","rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)"];

var provinces;
var stations;

function writeProvinces() {
    provinceSvg = d3.select("#main").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "provinces hidden")
        .append("g");

    var g = provinceSvg.append("g");

    provinceSvg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height);

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", function() {
            console.log("zoomed");
            g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        });

    provinceSvg.call(zoom)
        .call(zoom.event);

    write("../json/provinces.json", provinceSvg);
}

function writeStations() {
    stationSvg = d3.select("#main").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "stations hidden")
        .append("g");

    var g = stationSvg.append("g");

    stationSvg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height);

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", function() {
            console.log("zoomed");
            g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        });

    stationSvg.call(zoom)
        .call(zoom.event);

    //svg.call(zoom)
    //    .call(zoom.event);

    write("../json/policeBounds.json", stationSvg);
}

//load the station data
function write(geoData, svg){
    d3.json(geoData, function(error, bounds) {
        if (error) return console.error(error);

        var projection = d3.geo.mercator()
            .center([25, -28 ])
            .scale(1800);

        var path = d3.geo.path()
            .projection(projection);

        svg.select("g")
            .selectAll("path")
                .data(topojson.feature(bounds, bounds.objects.collection).features)
            .enter().append("path")
                .attr("class", "boundary")
                .attr("d", path)
                .attr("class", function(d) {
                    return "boundary " + d.properties.ID;
                });
    });
}

function setColors(crimeData, source) {
    d3.json(crimeData, function(error, data) {
        if (error) return console.error(error);

        var svg;

        if (source == "provinces") {
            svg = provinceSvg;
        }
        else {
            svg = stationSvg;
        }

        var max = 0;
        var min = 1000000;

        var crime = "Murder";
        var year = "2013";

        $.each(data, function(i, x) {
            if (max < x[crime][year]) { max = x[crime][year]; }
            if (min > x[crime][year]) { min = x[crime][year]; }
        });

        var domain = calculateDomain(min, max);
        console.log(domain);

        var color = d3.scale.linear()
            .domain(domain)
            .range(provinceColors);

        svg.append("g")
            .attr("class", "legendLinear")
            .attr("transform", "translate(20,20)");

        var legendLinear = d3.legend.color()
            .shapeWidth(30)
            .orient('vertical')
            .cells(domain)
            .scale(color)
            .labelFormat(d3.format(".0f"));

        svg.select(".legendLinear")
            .call(legendLinear);

        $.each(data, function(i, x) {
            $(document).find("." + escape(i)).css("fill", color(x[crime][year]));
        });
    });
}

function zoomed() {
    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function escape(str) {
    return str
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)")
        .replace(/'/g, "\\'");
}

function calculateDomain(min, max) {
    var add = Math.floor((max - min) / 6);
    var domain = [min];

    for (var i = 1; i <= 4; i++) {
        domain.push(add * i + min);
    }

    domain.push(max);

    return domain;
}
