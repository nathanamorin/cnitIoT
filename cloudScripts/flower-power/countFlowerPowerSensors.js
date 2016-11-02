var FlowerPower = require('flower-power');
var async = require('async');

var count = 0;
var nameList = "";

FlowerPower.discoverAll(function(flowerPower) {
	count++;
	process.stdout.write("\u001b[2J\u001b[0;0H");
	nameList = nameList + flowerPower.name + "\n";
	console.log("DETECTED SENSORS:" + count);
	console.log(nameList);
});
