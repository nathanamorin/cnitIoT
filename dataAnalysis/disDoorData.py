from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.dates as mdates
import csv


def enterExit(data, exportNoDisplay=False):
	"""
	enterExit analysis input door & motion data to record datetime when lab
	has been entered or exited.

	Ars:
		data (itterable): itterable should have component elements 
			of [event,datetime,...]
		exportNoDisplay (boolian): [Default false] enable when numpy 2d array 
			should with analysed results should be returned instead of plot

	Returns:
		None [default displays plot] OR numpy.array [when exportNoDisplay enabled]
	
	Example Usage:
		
		#Default, display plot
		enterExit(data)

		#Result: display plot

		print enterExit(data,exportNoDisplay=True)[:,1]

		#Result: datetime array of events

		print enterExit(data,exportNoDisplay=True)[:,0]

		#Result: string array of analysed enter or exit events
	"""


	#Define points which will be compared
	last_point = None
	current_point = None
	next_point = None

	dates = []
	colors = []
	

	for i in data:
			#Set comparision points
			last_point = current_point
			current_point = next_point
			next_point = i
			
			#Check that points used in comparision are defined
			if current_point != None and next_point != None:

				
				#Check for entering room
				if (current_point[0] == 'Open' or current_point[0] == 'Closed') and next_point[0] == 'Movement' and (next_point[1] - current_point[1]) < timedelta(minutes=4):
					# print "Enter\t" +  current_point[1]
					colors.append("green")
					dates.append(current_point[1])

				#Check for exiting room
				if current_point[0] == 'Closed' and (next_point[1] - current_point[1]) > timedelta(minutes=4):
					# print "Exit\t" + current_point[1]
					colors.append("red")
					dates.append(current_point[1])




	if exportNoDisplay == True:
		date_array = np.array(dates)
		action_array = np.array(colors)

		return np.vstack((date_array,action_array)).T

	fig,ax = plt.subplots(figsize=(6,1))
	ax.scatter(dates,[1]*len(dates),c=colors,marker='s',s=100)
	fig.autofmt_xdate()

	ax.yaxis.set_visible(False)
	ax.spines['right'].set_visible(False)
	ax.spines['left'].set_visible(False)
	ax.spines['top'].set_visible(False)
	ax.xaxis.set_ticks_position('bottom')

	ax.get_yaxis().set_ticklabels([])
	day = timedelta(days=1)
	plt.xlim(dates[0] - day, dates[-1] + day)
	# plt.show()





def doorStatusScatter(data):
	"""
	Displays simple time graphic of the door & motion activity.

	Args:
		data (itterable): itterable should have component elements 
			of [event,datetime,...]

	Returns:
		None [displays mathplotlib plot]
	"""
	fig, ax = plt.subplots()
	min_date = None
	max_date = None
	for i in data:
			timestamp = datetime.strptime(i[1], '%B %d, %Y at %H:%M%p')
			if min_date == None and max_date == None:
				min_date = timestamp
				max_date = timestamp


			if timestamp > max_date:
				max_date = timestamp
			if timestamp < min_date:
				min_date = timestamp

			color="grey"
			pos = 0
			
			if i[0] == "Open":
				color = "green"
				pos = -10

			if i[0] == "Closed":
				color = "red"
				pos = 0
			
			if i[0] == "Movement":
				color = "blue"
				pos = 10
			# print color + " " + str(pos)
			ax.scatter(timestamp, pos,color=color)

	ax.set_xlim(min_date,max_date)
	ax.set_ylim(-100,100)
	# plt.show()



def getNumpy(reader, cols):
	data_list = []
	for line in reader:
		line_list = []
		for num_col in range(len(cols)):
			line_list.append(cols[num_col][1](line[num_col]))

		data_list.append(line_list)


	return np.array(data_list)

def pie_chart(data, labels):
	fig, ax = plt.subplots()

	ax.pie(data,labels=labels,autopct='%1.1f%%')

	# plt.show()

def bar_chart(data,labels,bar_width=0.4):
	fig, ax = plt.subplots()

	num_bars = np.arange(data.size)
	print num_bars


	ax.bar(num_bars,data,width=bar_width)
	ax.set_ylabel('Sum of Activity')
	ax.set_title('Activity by Type')
	ax.set_xticks(num_bars+bar_width/2)
	ax.set_xticklabels(labels)

	# plt.show()





#Run when this file is executed
if __name__ == '__main__':
		
		#open 'testwireless.csv' as testing data and display plot
		with open('testwireless.csv','r') as file:
			reader  = csv.reader(file)
			np_array = getNumpy(reader,[["Action",lambda x: x],["DateTime",lambda x: datetime.strptime(x, '%B %d, %Y at %H:%M%p')],["Sensor",lambda x: x]])

			
			#Display figures for counting actions
			np_action_count = np.unique(np_array[:,0],return_counts=True)
			pie_chart(data=np_action_count[1],labels=np_action_count[0])
			bar_chart(data=np_action_count[1],labels=np_action_count[0])

			#Display figures for counting sensor calls
			np_sensor_count = np.unique(np_array[:,2],return_counts=True)			
			pie_chart(data=np_sensor_count[1],labels=np_sensor_count[0])
			bar_chart(data=np_sensor_count[1],labels=np_sensor_count[0])

			#Display figures for door open/closed
			enterExit(np_array)



			plt.show()




###TODO [Use numpy array to import data]

# #Numpy method
# def displayDoorData():
# 	# data = np.loadtxt(open('testwireless.csv','r'),delimiter=',',usecols=(0,1),dtype=object,converters={0:np.str_, 1: lambda x: datetime.strptime(x, '%B %d, %Y at %H:%M%p') })

# 	dt = np.dtype([('action',np.str),('timestamp','datetime64[s],i4')])
# 	data = []
# 	with open('testwireless.csv','r') as file:
# 		csv_file  = csv.reader(file)

# 		min_date = None
# 		max_date = None

# 		for line in csv_file:
# 			timestamp = datetime.strptime(line[1], '%B %d, %Y at %H:%M%p')
# 			if min_date == None and max_date == None:
# 				min_date = timestamp
# 				max_date = timestamp


# 			if timestamp > max_date:
# 				max_date = timestamp
# 			if timestamp < min_date:
# 				min_date = timestamp
# 			# print line[0]
# 			data.append( (line[0], timestamp) )

# 		data = np.array(data)

# 		print data[np.size/2-1,0]

# 		for i in range(np.size/2-3):
# 			if data[i:i+3]
