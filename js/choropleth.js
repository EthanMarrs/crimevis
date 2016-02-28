var width = 1200,
    height = 600;

var quantize = d3.scale.quantize()
    .domain([0, .15])
    .range(d3.range(9).map(function(i) { return "q" + i; }));


var zoom = d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

var g = svg.append("g");

svg
    .append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height);

svg
    .call(zoom)
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
});

function zoomed() {
    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
