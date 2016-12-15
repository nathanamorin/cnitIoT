$(document).ready(run);

var barwidth = 420,
    barHeight = 20;

var reset = true;

var dataDir = "datafiles/";

var flower_power_data_url = "flowerPower.json";

var data_cache = {}

function run()
{

  $.getJSON(dataDir+"getFiles.php",function(data){

    data_cache["files"] = data;


      var mySlider = new Slider("#ex6", {
         "max":data_cache["files"].length-1
       });

      $("#ex6SliderVal").text(getPrettyDate(data_cache["files"][0]) + " to " + getPrettyDate(data_cache["files"][0]));

      renderDates(1,2);

      $("#ex6").on("slide", function(slideEvt) {
 

          $("#ex6SliderVal").text(getPrettyDate(data_cache["files"][slideEvt.value[0]]) 
            + " to " + getPrettyDate(data_cache["files"][slideEvt.value[1]]));

          renderDates(slideEvt.value[0],slideEvt.value[1])
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
   $("svg").empty();
}


function addToGraphs(data)
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
      .x(function(d) { return x(d.DateTime); })
      .y(function(d) { return y(d.Sunlight); });
      
  // Adds the svg canvas
  var svg = d3.select("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.DateTime; }));
  y.domain([0, d3.max(data, function(d) { return d.Sunlight; })]);

  // // Add the valueline path.
  // svg.append("path")
  //     .attr("class", "line")
  //     .attr("d", valueline(data));

  // Add the scatterplot
  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 3.5)
      .attr("cx", function(d) { return x(d.DateTime); })
      .attr("cy", function(d) { return y(d.Sunlight); });

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


  reset = false;
}










