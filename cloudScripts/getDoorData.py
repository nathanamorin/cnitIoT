import urllib2
import csv

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





#Example usage, downloads and prints data for the Wireless Door Lab
#Dictionary of google sheets export urls
DocumentKeys = {
	'Wireless_Door_Lab':'147Gf1f3z-r1weIikSwSSd741baTqqqRkc06716gF09c'
	# ,'Presence':'1MAg21Z2H01UHSK1WiAzxfcqziD-CYvMnpafM_XPXwMs'
}

CSVData = getCSVData(DocumentKeys)
for event in CSVData['Wireless_Door_Lab']:
	for field in event:
		print field + '\t'

writeCSVData(DocumentKeys,{'Wireless_Door_Lab':'testwireless.csv'})

