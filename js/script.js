function drawSVG(){
	var _svg = d3.select("body")
		.append("svg")
		.attr("id", "canvas")
		.attr("width", _svg_attr.width)
		.attr("height", _svg_attr.height)

	_svg.append("g")
		.attr("class", "calque-01")
    // .attr("transform", "translate(" + _svg_attr.width / 2 + "," + svg_attr.height / 2 + ")");
		.attr("transform", "translate(" + [_svg_attr.padding, _svg_attr.padding] + ")")

};

function drawMenu(){
// A drop-down menu for selecting a state; uses the "menu" namespace.
  dispatch.on("load.menu", function(stateById) {
    var select = d3.select("body")
      .append("div")
      .append("select")
        .on("change", function() { dispatch.statechange(stateById.get(this.value)); });

    select.selectAll("option")
        .data(stateById.values())
      .enter().append("option")
        .attr("value", function(d) { return d.locations; })
        .text(function(d) { return d.locations; });

    dispatch.on("statechange.menu", function(state) {
      select.property("value", state.locations);
    });
  });
}

function drawDonut(){
// A pie chart to show population by age group; uses the "pie" namespace.
dispatch.on("load.pie", function(stateById) {
  var width = 880,
      height = 700;
      radius = Math.min(width, height) / 2;
      // radius = Math.min(function(d){ return d.nb_users});

  var color = d3.scale.ordinal()
      .domain(groups)
      .range(["#ff8d00", "#468499", "#ffaabc", "#00cc00"]);

  var arc = d3.svg.arc();
      //.outerRadius(radius - 10)
      //.innerRadius(radius - 70);

  var pie = d3.layout.pie()
      .sort(null);

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var path = svg.selectAll("path")
      .data(groups)
    .enter().append("path")
      .style("fill", color)
      .each(function() { this._current = {startAngle: 0, endAngle: 0}; });

  dispatch.on("statechange.pie", function(d) {
    path.data(pie.value(function(g) {
      return d[g]; 
    })(groups)).transition()
        .attrTween("d", function(b) {
          var big_scale = d3.scale.linear()
            .domain(d3.extent(_data, function(t){
              return t.nb_users;
            }))
            .range([0, radius-70]);
          var little_scale = d3.scale.linear()
            .domain(d3.extent(_data, function(t){
              return t.nb_users;
            }))
            .range([0, radius-10]);
          
          arc.outerRadius(big_scale(d.nb_users))
            .innerRadius(little_scale(d.nb_users));     
          console.log(b);



          var interpolate = d3.interpolate(this._current, b);
          this._current = interpolate(0);
          return function(t) {
            return arc(interpolate(t));
          };
        });
  });
});


	return;
}



