import json
import os
import datetime

file_pre = "datafiles/flowerPowerData_"

with open('concatdata.json') as data_file:    
    data = json.load(data_file)

    for date_str in data.keys():

    	fileTimeStamp = date_str.split("_")[1] + "_" + date_str.split("_")[0] + "_" + str(datetime.datetime.now().year)

        if not os.path.isfile(file_pre+fileTimeStamp):
            os.system('echo "DateTime\tYear\tMonth\tDay\tTime\tDeviceName\tSunlight\tSoilTemperature\tAirTemperature\tSoilMoisture" > '+file_pre+fileTimeStamp)

    	for device_name in data[date_str].keys():
    		line = (
                str(datetime.datetime.now().year) + "_"+date_str + "\t"+
                str(datetime.datetime.now().year) + "\t" + 
                date_str.split("_")[0] + "\t" +
    			date_str.split("_")[1] + "\t" +
    			date_str.split("_")[2] + "\t" + 
    			device_name + "\t"
    		+	str(data[date_str][device_name]["Sunlight"]) + "\t"
    		+ str(data[date_str][device_name]["SoilTemperature"]) + "\t" 
    		+ str(data[date_str][device_name]["AirTemperature"]) + "\t"
    		+ str(data[date_str][device_name]["SoilMoisture"]) )

    		print 'echo "'+line+'" >> '+file_pre+fileTimeStamp
    		os.system('echo "'+line+'" >> '+file_pre+fileTimeStamp)




    		

