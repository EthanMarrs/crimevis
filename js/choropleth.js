var width = $("#main").css("width"),
    height = $(window).height() - 130;

var depth = 0;

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

    provinceSvg.append("g")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height);

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 20])
        .on("zoom", function() {
            g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            depth = d3.event.scale;
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

    stationSvg.append("g")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height);

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 20])
        .on("zoom", function() {
            //if (d3.event.scale > 3.5) {
            //    $(document).find(".boundary").addClass("close-boundary").removeClass("boundary");
            //}
            //else {
            //    $(document).find(".close-boundary").addClass("boundary").removeClass("close-boundary");
            //}
            g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            depth = d3.event.scale;
        });

    stationSvg.call(zoom)
        .call(zoom.event);

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
                })
                .attr("data", function(d) {
                        return d.properties.ID;
                })
                .on("mouseover", function() {
                    d3.select(this).style("stroke", "#000000").style("stroke-width", 1.5 / depth + "px");
                    d3.select(this).moveToFront();
                    $("#explore-info").append(d3.select(this).attr("data") + "</br>" + d3.select(this).attr("value"));
                })
                .on("mouseout", function() {
                    d3.select(this).style("stroke", "#ffffff").style("stroke-width", 0);
                    $("#explore-info").empty();
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

        var crime = $(document).find("#crime-select").val();
        var year = Math.floor(slider.noUiSlider.get());

        $.each(data, function(i, x) {
            for (var j = 2004; j < 2014; j++) {
                if (max < x[crime][j]) { max = x[crime][j]; }
                if (min > x[crime][j]) { min = x[crime][j]; }
            }
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
            .ascending(true)
            .cells(domain)
            .scale(color)
            .labelFormat(d3.format(".0f"));

        svg.select(".legendLinear")
            .call(legendLinear);

        $.each(data, function(i, x) {
            if ((x[crime][year].toString()).indexOf("?") >= 0) {
                $(document).find("." + escape(i)).css("fill", "#ffffff");
            }
            else {
                $(document).find("." + escape(i)).css("fill", color(x[crime][year])).attr("value", x[crime][year]);
            }
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

d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};
