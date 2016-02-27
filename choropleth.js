var width = 1200,
    height = 600;

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
d3.json("provinces.json", function(error, bounds) {
  if (error) return console.error(error);

  var projection = d3.geo.mercator()
      .center([18, -27 ])
      .scale(2000);

  var path = d3.geo.path()
    .projection(projection);

  g.append("path")
    .datum(topojson.mesh(bounds, bounds.objects.collection))
    .attr("d", path)
    .attr("class", "police_bounds");
});

function zoomed() {
  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
