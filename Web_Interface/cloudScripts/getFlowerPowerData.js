var FlowerPower = require('flower-power');
var async = require('async');

FlowerPower.discoverAll(function(flowerPower) {
	console.log("HIT");
	flowerPower.connectAndSetup(function(error){
		var result = {};
		async.parallel([
			function(callback){
				flowerPower.readSystemId(function(err, id){
					result["SystemId"] = id;
					callback(null, id);
				});				
			},
			function(callback){
				flowerPower.readSerialNumber(function(err, id){
					result["SerialNumber"] = id;
					callback(null, id);
				});				
			},
			function(callback){
				flowerPower.readFirmwareRevision(function(err, id){
					result["FirmwareRevision"] = id;
					callback(null, id);
				});				
			},
			function(callback){
				flowerPower.readManufacturerName(function(err, id){
					result["ManufacturerName"] = id;
					callback(null, id);
				});				
			},
			function(callback){
				flowerPower.readBatteryLevel(function(err, id){
					result["BatteryLevel"] = id;
					callback(null, id);
				});				
			},
			function(callback){
				flowerPower.readSunlight(function(err, id){
					result["Sunlight"] = id;
					callback(null, id);
				});				
			},function(callback){
				flowerPower.readSoilTemperature(function(err, id){
					result["SoilTemperature"] = id;
					callback(null, id);
				});				
			},
			function(callback){
				flowerPower.readAirTemperature(function(err, id){
					result["AirTemperature"] = id;
					callback(null, id);
				});				
			},
			function(callback){
				flowerPower.readSoilMoisture(function(err, id){
					result["SoilMoisture"] = id;
					callback(null, id);
				});				
			},
		], function(error, results){
			console.log(result);
		});
	});
	
//flowerPower.connectAndSetup(function(error){
//		console.log("CONNECTED");
//		flowerPower.readAirTemperature(function(err, id){
//			console.log("ID:", id);
//		});
//	});
});
