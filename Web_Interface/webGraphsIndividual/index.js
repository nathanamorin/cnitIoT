$(document).ready(run);

var barwidth = 420,
    barHeight = 20;

var door_data_url = "door_data.csv";

var data_cache = {}


function run()
{

  d3.csv(door_data_url,type, function(error, data){

  // console.log(data);
  var groupByAction = d3.nest().key(function(d){ return d.Action}).entries(data);

  renderBarChart("bar_chart_count_group_by_action", groupByAction, [0,1000])

  renderPieChart("pie_chart_count_group_by_action",groupByAction);

  var groupByDate = d3.nest().key(function(d){ return d.Time.substr(0,d.Time.indexOf(" at")) }).entries(data);

  // console.log(groupByDate);

  groupByDateAction = d3.nest().key(function(d){ return d.Action}).entries(groupByDate[0].values);

  // console.log(groupByDateAction);

  // With JQuery
  var mySlider = new Slider("#ex6", {
    "max":groupByDate.length-1
  });
  // mySlider.setValue("max",groupByDate.length-1);
  $("#ex6SliderVal").text(groupByDate[0].key);
  $("#ex6").on("slide", function(slideEvt) {
  // console.log(slideEvt.value)
  $("#ex6SliderVal").text(groupByDate[slideEvt.value].key);

  // console.log(d3.nest().key(function(d){ return d.Action}).entries(groupByDate[slideEvt.value].values))

  renderBarChart("bar_chart_count_group_by_action", d3.nest().key(function(d){ return d.Action}).entries(groupByDate[slideEvt.value].values), [0,1000]);

  renderPieChart("pie_chart_count_group_by_action",d3.nest().key(function(d){ return d.Action}).entries(groupByDate[slideEvt.value].values));
});



});
}

function renderBarChart(chartid, data, scale)
{
  console.log(data);
  $("#"+chartid).empty();
  var chart = d3.select("#"+chartid)
    .attr("width", barwidth);


  var x = d3.scale.linear()
    .range(scale);

  x.domain([0, d3.max(data,function(d){return d.values.length; })])

  chart.attr("height", barHeight * data.length);


  var bar = chart.selectAll("g")
    .data(data)
  .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });


  bar.append("rect")
    .attr("width", function(d){ return x(d.values.length); })
    .attr("height", barHeight - 1);


  bar.append("text")
    .attr("x", function(d) { return 5 })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return d.key + "  (" + d.values.length + ")"; });

}

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}

function renderPieChart(chartid, data)
{

  $("#"+chartid).empty();
  var width = 500,
    height = 500,
    radius = Math.min(width, height) / 2;

  var color = d3.scale.ordinal()
      .range(["#98abc5", "#7b6888", "#a05d56", "#ff8c00"]);

  var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

  var labelArc = d3.svg.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.values.length; });

  var svg = d3.select("#"+chartid)
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.key); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) {return d.data.key + " (" + d.data.values.length + ")"; });
}