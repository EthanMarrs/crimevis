var width = 1200,
    height = 600;

var provinceColors = ["rgb(198,219,239)","rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)"];

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

var g = svg.append("g");

svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height);

svg.call(zoom)
    .call(zoom.event);

/**
 * Load Province Data
 */

d3.json("../json/provinces.json", function(error, bounds) {
    if (error) return console.error(error);

    var projection = d3.geo.mercator()
        .center([18, -27 ])
        .scale(2000);

    var path = d3.geo.path()
        .projection(projection);

    svg.select("g")
            .attr("class", "provinces")
        .selectAll("path")
            .data(topojson.feature(bounds, bounds.objects.collection).features)
        .enter().append("path")
            .attr("class", "province")
            .attr("d", path)
            .attr("class", function(d) {
                return "province " + d.properties.ID;
            });

    d3.json("../provinceCrime.json", function(error, data) {
        if (error) return console.error(error);

        var max = 0;
        var min = 1000000;

        var crime = "Murder";
        var year = "2013";

        $.each(data["Provinces"], function(i, x) {
            if (max < x[crime][year]) { max = x[crime][year]; }
            if (min > x[crime][year]) { min = x[crime][year]; }
        });

        var domain = calculateDomain(min, max);
        console.log(min);
        console.log(max);
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

        $.each(data["Provinces"], function(i, x) {
            console.log(i + " " + x[crime][year]);
            $(document).find("." + i).css("fill", color(x[crime][year]));
        });
    });
});

function zoomed() {
    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
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
