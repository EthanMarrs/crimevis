var width = 1200,
    height = 600;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);



d3.json("provinces.json", function(error, bounds) {
  if (error) return console.error(error);

  var pb = topojson.feature(bounds, bounds.objects.collection);

  var projection = d3.geo.mercator()

      // .center([0, 55.4])
      .center([18, -27 ])
      .scale(2000);
      // .translate([width / 2, height / 2]);

  var path = d3.geo.path()
    .projection(projection);
  //
  // var projection = d3.geo.albers()
  //     .center([0, 55.4])
  //     .rotate([4.4, 0])
  //     .parallels([50, 60])
  //     .scale(6000)
  //     .translate([width / 2, height / 2]);
  //
  // svg.selectAll(".Police_bounds")
  //     .data(topojson.feature(bounds, bounds.objects.Police_bounds).features)
  //     .enter().append("path")
  //     .attr("class", function(d) { return "police_bounds"; }) //+ d.id;
  //     .attr("d", path);

  svg.append("path")
    .datum(topojson.mesh(bounds, bounds.objects.collection))
    .attr("d", path)
    .attr("class", "police_bounds");
});
