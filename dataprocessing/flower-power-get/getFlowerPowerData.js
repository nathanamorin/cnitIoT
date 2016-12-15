var FlowerPower = require('flower-power');
var async = require('async');
var fs = require('fs');

FlowerPower.discoverAll(function(flowerPower) {

	var count = 0;
	var sensors = [];

	count++;

	sensors.push(flowerPower);

	if(count === 3) {
		console.log("FINISHED");
		getSensorData(sensors);
	}
});

function getSensorData(sensors) {
	var totalData = {};
	console.log("STARTING SERIES");
	async.forEachOfSeries(sensors, function(sensor, key, callbackFinal){
		console.log("GETTING DATA FOR " + sensor.name + " (DEVICE " + key + ")");
		sensor.connectAndSetup(function(error) {
		  if(error) {
		    console.log("Error:", error);
		    return;
		  }
		  console.log("connection to sensor " + key + " successful.")
		  var result = {};
		  async.parallel([
		    function(callback){
		      console.log("Reading SysID of Sensor #" + key);
		      sensor.readSystemId(function(err, id){
		        result["SystemId"] = id;
		        console.log("Finished Reading SysID of Sensor #" + key);
		        callback(null, id);
		      });
		    },
		    function(callback){
		      console.log("Reading Serial Number of Sensor #" + key);
		      sensor.readSerialNumber(function(err, id){
		        result["SerialNumber"] = id;
		        console.log("Finished Reading Serial Number of Sensor #" + key);
		        callback(null, id);
		      });
		    },
		    function(callback){
		      console.log("Reading Firmware Rev of Sensor #" + key);
		      sensor.readFirmwareRevision(function(err, id){
		        result["FirmwareRevision"] = id;
		        console.log("Finished Reading Firmware Rev of Sensor #" + key);
		        callback(null, id);
		      });
		    },
		    function(callback){
		      console.log("Reading Manufacturer Name of Sensor #" + key);
		      sensor.readManufacturerName(function(err, id){
		        result["ManufacturerName"] = id;
		        console.log("Finished Reading Manufacturer Name of Sensor #" + key);
		        callback(null, id);
		      });
		    },
		    function(callback){
		      console.log("Reading Battery Level of Sensor #" + key);
		      sensor.readBatteryLevel(function(err, id){
		        result["BatteryLevel"] = id;
		        console.log("Finished Reading Battery Level of Sensor #" + key);
		        callback(null, id);
		      });
		    },
		    function(callback){
		      console.log("Reading Sunlight of Sensor #" + key);
		      sensor.readSunlight(function(err, id){
		        result["Sunlight"] = id;
		        console.log("Finished Reading Sunlight of Sensor #" + key);
		        callback(null, id);
		      });
		    },function(callback){
		      console.log("Reading Soil Temps of Sensor #" + key);
		      sensor.readSoilTemperature(function(err, id){
		        result["SoilTemperature"] = id;
		        console.log("Finished Reading Soil Temps of Sensor #" + key);
		        callback(null, id);
		      });
		    },
		    function(callback){
		      console.log("Reading Air Temps of Sensor #" + key);
		      sensor.readAirTemperature(function(err, id){
		        result["AirTemperature"] = id;
		        console.log("Finished Reading Air Temps of Sensor #" + key);
		        callback(null, id);
		      });
		    },
		    function(callback){
		      console.log("Reading Soil Moisture of Sensor #" + key);
		      sensor.readSoilMoisture(function(err, id){
		        result["SoilMoisture"] = id;
		        console.log("Finished Reading Soil Moisture of Sensor #" + key);
		        callback(null, id);
		      });
		    },
		    function(callback){
		      console.log("Reading Friendly Name of Sensor #" + key);
		      sensor.readFriendlyName(function(err, id){
		        result["FriendlyName"] = id;
		        console.log("Finished Reading Friendly Name of Sensor #" + key);
		        callback(null, id);
		      });
		    }
		  ], function(error, results){
		    if(error) {
		      console.log("ERROR AGGREGATING DATA:", error);
		    }

				totalData[sensor.name] = result;
				callbackFinal();
		  });
		});
	}, function(err) {
		if(err)
			console.log("ERROR AGGREGATING SENSORS:", err);

		console.log("WRITE TO FILE",totalData);
		fs.writeFile('/home/pi/scripts/flower-power-scripts/data/data.json', JSON.stringify(totalData), 'utf8', function(err) {
			if(err) {
				console.log("ERROR WRITING TO FILE", err);
			}

			process.exit();
		});

	});
}
