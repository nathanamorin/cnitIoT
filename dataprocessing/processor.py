import json
import os

file_pre = "datafiles/flowerPowerData_"

with open('test.json') as data_file:    
    data = json.load(data_file)

    for date_str in data.keys():

    	currDayMonth = date_str.split("_")[0] + date_str.split("_")[1]

        if not os.path.isfile(file_pre+currDayMonth):
            os.system('echo "Month\tDay\tTime\tDeviceName\tSunlight\tSoilTemperature\tAirTemperature\tSoilMoisture" > '+file_pre+currDayMonth)

    	for device_name in data[date_str].keys():
    		line = (date_str.split("_")[0] + "\t" +
    			date_str.split("_")[1] + "\t" +
    			date_str.split("_")[2] + "\t" + 
    			device_name + "\t"
    		+	str(data[date_str][device_name]["Sunlight"]) + "\t"
    		+ str(data[date_str][device_name]["SoilTemperature"]) + "\t" 
    		+ str(data[date_str][device_name]["AirTemperature"]) + "\t"
    		+ str(data[date_str][device_name]["SoilMoisture"]) )

    		print 'echo "'+line+'" >> '+file_pre+currDayMonth
    		os.system('echo "'+line+'" >> '+file_pre+currDayMonth)




    		

