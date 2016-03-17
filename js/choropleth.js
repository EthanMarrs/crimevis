var width = $("#main").css("width"),
    height = $(window).height() - 130;

var provinceSvg;
var stationSvg;

//var provinceColors = ["rgb(198,219,239)","rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)"];
//var provinceColors = ["#FEEBE2","#FCC5C0", "#FA9FB5", "#F768A1", "#C51B8A", "#C51B8A"];
var provinceColors = ["#FFFFCC","#A1DAB4", "#41B6C4", "#2C7FB8", "#253494", "#192466"];
//var provinceColors = ["#FFFFD4","#FED98E", "#FE9929", "#D95F0E", "#993404", "#993404"];
//var provinceColors = ["#CCFFFF","#FFFFCC", "FFEE99", "#FFCC66", "#FFC44D", "#FF8000 "];

var provinces;
var stations;

function writeProvinces() {
    provinceSvg = d3.select("#main").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "provinces hidden")
        .append("g");

    var g = provinceSvg.append("g").attr("id", "grab");

    provinceSvg.append("g")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height);

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 30])
        .on("zoom", function() {
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

    var g = stationSvg.append("g").attr("id", "grab");

    stationSvg.append("g")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height);

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 30])
        .on("zoom", function() {
            //if (d3.event.scale > 3.5) {
            //    $(document).find(".boundary").addClass("close-boundary").removeClass("boundary");
            //}
            //else {
            //    $(document).find(".close-boundary").addClass("boundary").removeClass("close-boundary");
            //}

            //d3.selectAll(".boundary").style("stroke-width", 1.5 / d3.event.scale + "px");
            g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
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
                .attr("vector-effect", "non-scaling-stroke")
                .on("mouseenter", function() {
                    var fill = d3.select(this).style("fill");
                    d3.select(this).style("fill", d3.rgb(fill).darker(0.7));
                    d3.select(this).moveToFront();
                    //$("#explore-info").append(d3.select(this).attr("data").replace(/_/g, ' ') + "</br>" + d3.select(this).attr("value"));
                    //var mouse = d3.mouse(this);
                    console.log("enter");
                    $(".tooltip")
                        .append(d3.select(this).attr("data").replace(/_/g, ' ') + "</br>" + d3.select(this).attr("value"))
                        .css("left", event.clientX - 25)
                        .css("top", event.clientY + 25)
                        .removeClass("hidden");
                })
                .on("mouseleave", function() {
                    var fill = d3.select(this).style("fill");
                    d3.select(this).style("fill", d3.rgb(fill).brighter(0.7));
                    $(".tooltip").empty().addClass("hidden");
                })
                .on("mousemove", function() {
                    $(".tooltip")
                        .css("left", event.clientX - 25)
                        .css("top", event.clientY + 25);
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

function setBestWorst() {
    $("#worst").empty();
    $("#best").empty();

    $(".boundary").css("fill", "#e0e0e0");
    var path;
    if ($("#provincial_radio").attr("checked") == "checked") {
        path = "../json/provinceCrime.json";
    }
    else {
        path = "../json/stationCrime.json";
    }

    d3.json(path, function(error, data) {
        var crime = $(document).find("#crime-select").val();
        var year = Math.floor(slider.noUiSlider.get());
        var max = 0, min = 1000000;
        var minName = "", maxName = "";

        $.each(data, function(i, x) {
            if (max < x[crime][year]) {
                max = x[crime][year];
                maxName = i;
            }
            if (min > x[crime][year]) {
                min = x[crime][year];
                minName = i;
            }
        });

        $("." + minName).css("fill", "#00C853");
        $("." + maxName).css("fill", "red");

        $("#worst").append('<span class="red white-text large-text">Worst Region</span>' + "</br>" + maxName.replace(/_/g, ' ') + "</br>" + max);
        $("#best").append('<span class="green white-text large-text">Best Region</span>'+ "</br>" + minName.replace(/_/g, ' ') + "</br>" + min);
    });
}

function update() {
    var selected = $(".accordion-option.active").attr("id");

    if (selected == "explore") {
        if ($("#provincial_radio").attr("checked") == "checked") {
            setColors("../json/provinceCrime.json", "provinces");
        }
        else {
            setColors("../json/stationCrime.json", "stations");
        }
    }
    else if (selected == "change") {

    }
    else if (selected == "region") {

    }
    else if (selected == "best-worst") { setBestWorst(); }
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
