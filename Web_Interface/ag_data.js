$(document).ready(runAg);

var barwidth = 420,
    barHeight = 20;

var reset = true;

var dataDir = "agg_flowerpower_datafiles/";

var flower_power_data_url = "flowerPower.json";

var data_cache = {}

function runAg()
{
  console.log(dataDir+"getFiles.php");

  $.getJSON(dataDir+"getFiles.php",function(data){

    data_cache["files"] = data;


      var mySlider = new Slider("#ag_data_timegraph_slider", {
         "max":data_cache["files"].length-1
       });

      $("#ag_data_timegraph_slider_label").text(getPrettyDate(data_cache["files"][0]) + " to " + getPrettyDate(data_cache["files"][0]));

      renderDates(1,2);

      mySlider.on("slide", function(slideEvt) {

        console.log(slideEvt);
        var index_begin = slideEvt[0];
        var index_end = slideEvt[1];
 

          $("#ag_data_timegraph_slider_label").text(getPrettyDate(data_cache["files"][index_begin]) 
            + " to " + getPrettyDate(data_cache["files"][index_end]));

          renderDates(index_begin,index_end)
      });
  });
}


function getPrettyDate(fileName)
{
  var split = fileName.split("_")

  return split[2] + " " + split[1] + ", " + split[3]
}

function renderDates(indexStart,indexEnd)
{
  var parseTime = d3.time.format("%Y_%b_%d_%H:%M").parse;
  clearGraphs();
  for (var i = indexStart; i < indexEnd; i++)
  {


    if ( (Object.keys(data_cache)).indexOf(data_cache.files[i]) >= 0)
    {
      addToGraphs(data_cache[data_cache.files[i]]);
    }
    else
    {
    
      d3.tsv(dataDir+data_cache.files[i], function(data){

        data.Sunlight = parseFloat(data.Sunlight);
        data.DateTime = parseTime(data.DateTime);
        data.SoilTemperature = parseFloat(data.SoilTemperature);
        data.SoilMoisture = parseFloat(data.SoilMoisture);
        data.AirTemperature = parseFloat(data.AirTemperature);
        return data;
      }, function(error, data)
      {
        if (error) throw error;
        data_cache[data_cache.files[i]] = data;
        addToGraphs(data);
      });
    } 

  }
}

function clearGraphs()
{
   reset = true;
   $("#ag_data_sun_timegraph").empty();
   $("#ag_data_soil_temp_timegraph").empty();
   $("#ag_data_soil_moisture_timegraph").empty();
   $("#ag_data_air_timegraph").empty();
}


function addToGraphs(data)
{

  renderGraph("ag_data_sun_timegraph", function(d) { return d.DateTime; },function(d) { return d.Sunlight; }, data);
  renderGraph("ag_data_soil_temp_timegraph", function(d) { return d.DateTime; },function(d) { return d.SoilTemperature; }, data);
  renderGraph("ag_data_soil_moisture_timegraph", function(d) { return d.DateTime; },function(d) { return d.SoilMoisture; }, data);
  renderGraph("ag_data_air_timegraph", function(d) { return d.DateTime; },function(d) { return d.AirTemperature; }, data);

  reset = false;

}

function renderGraph(id, xfunc, yfunc, data, resetGraph)
{
    // Set the dimensions of the canvas / graph
  var margin = {top: 30, right: 20, bottom: 30, left: 50},
      width = 600 - margin.left - margin.right,
      height = 270 - margin.top - margin.bottom;

  // Set the ranges
  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  // Define the line
  var valueline = d3.svg.line()
      .x(function(d) { return x(xfunc(d)); })
      .y(function(d) { return y(yfunc(d)); });
      
  // Adds the svg canvas
  var svg = d3.select("#"+id)
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return xfunc(d); }));
  y.domain([0, d3.max(data, function(d) { return yfunc(d); })]);

  // // Add the valueline path.
  // svg.append("path")
  //     .attr("class", "line")
  //     .attr("d", valueline(data));

  // Add the scatterplot
  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 3.5)
      .attr("cx", function(d) { return x(xfunc(d)); })
      .attr("cy", function(d) { return y(yfunc(d)); });

if (reset == true)
{
  console.log("test reset");

    // Define the axes
  var xAxis = d3.svg.axis().scale(x)
      .orient("bottom").ticks(5);

  var yAxis = d3.svg.axis().scale(y)
      .orient("left").ticks(5);
    // Add the X Axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  // Add the Y Axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

}

}










