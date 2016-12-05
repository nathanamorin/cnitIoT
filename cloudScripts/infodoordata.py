import urllib2
import csv
import time
from datetime import datetime, timedelta

GoogleSheetsURL = 'https://spreadsheets.google.com/feeds/download/spreadsheets/Export?key={key}&exportFormat=csv'


#Retrieves data from dict of urls & places CSV data into corresponding dict
def getCSVData(urls):
	csvData = {}
	for urlName in urls.keys():
		csvData[urlName] = csv.reader(urllib2.urlopen(GoogleSheetsURL.replace('{key}',urls[urlName])))

	return csvData

#Retrieves data from dict of urls & places CSV data into the specified file
def writeCSVData(urls, fileURIs):
	csvData = {}
	for urlName in urls.keys():
		with open(fileURIs[urlName],'w') as file:
			file.write(urllib2.urlopen(GoogleSheetsURL.replace('{key}',urls[urlName])).read())


def readCSVFile(file):
	with open(file,'r') as file:
		return csv.reader(file)


def output():
    CSVData=getCSVData(DocumentKeys)
    list_data=list(CSVData['Wireless_Door_Lab'])
    list_data.reverse()
    
    #print list_data
    closeddoor=0
    opendoor=0
    
    for event in list_data:
        if event[0]=="Closed":
            closeddoor=closeddoor+1
        if event[0]=="Open":
            opendoor=opendoor+1
    print("Total number of times the door has been opened: "+str(opendoor)+"and closed: "+str(closeddoor))

     
    #file=open("output.txt","a")
    #file.write("Open door:"+str(opendoor)+"Closed door:"+str(closeddoor)+"\n")
    #file.close()
    
def monthly():
    CSVData=getCSVData(DocumentKeys)
    list_data=list(CSVData['Wireless_Door_Lab'])
    dt = datetime.strptime(list_data[1][1], '%B %d, %Y at %H:%M%p')
    k=dt.strftime('%m/%d/%Y')
    #for event in list_data:
    opendoor=0
    closeddoor=0
    for i in list_data:
        dt = datetime.strptime(i[1], '%B %d, %Y at %H:%M%p')
        j=dt.strftime('%m/%d/%Y')
        if k==j:
            if i[0]=="Open":
                opendoor=opendoor+1
            if i[0]=="Closed":
                closeddoor=closeddoor+1
        else:
            print("On "+k+" number of opendoor = "+str(opendoor)+" number of closeddoor = "+str(closeddoor))
            k=j
            opendoor=0
            closeddoor=0
            if i[0]=="Open":
                opendoor=1
            if i[0]=="Closed":
                closeddoor=1
    print("On "+k+" number of opendoor = "+str(opendoor)+" number of closeddoor = "+str(closeddoor))         
            
def currentcondition():
    CSVData=getCSVData(DocumentKeys)
    list_data=list(CSVData['Wireless_Door_Lab'])
    list_data.reverse()
    if(list_data[1]=='Open'):
        print("Right now Please Close the door")
    else:
        print("Right now Door is closed no problem")        

#Example usage, downloads and prints data for the Wireless Door Lab
#Dictionary of google sheets export urls
DocumentKeys = {
	'Wireless_Door_Lab':'147Gf1f3z-r1weIikSwSSd741baTqqqRkc06716gF09c'
	# ,'Presence':'1MAg21Z2H01UHSK1WiAzxfcqziD-CYvMnpafM_XPXwMs'
}


if __name__ == '__main__':
    #while 1:
        output()
        monthly()
        currentcondition()
        #time.sleep(20)
