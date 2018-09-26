import json
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

#best file= mac_dude_BlinkTest_1.json
#second best = a88ac021f60d23d32aec7764199fcfcf64c3784548eedc852c90f6a4baa24f48.json
filename = open('../data/mac_dude_BlinkTest_1.json', 'r')

#loads json file
data = json.load(filename)

#stores only the eeg data
eeg = np.array(data['patterns'])

#maps the node number to the data2
inputs = map(lambda p: p['input'], eeg[2:])
#puts data into a list
inputs = list(inputs)
#puts data into an array
inputs = np.array(inputs)
#turns into datafram
df = pd.DataFrame(data=inputs)
#plots the data
ax = df.plot(subplots = True)

#Labels each subgraph
for i,axes in enumerate(ax):
    axes.set_ylim(auto = True)
    axes.set_yticklabels(' ')
    axes.legend(str(i + 1), loc = "upper left")

#Title of the Graph with larger font
plt.suptitle("Raw EEG Blink Data", fontsize=16)

#show the graph
plt.show()
