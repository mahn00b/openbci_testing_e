from pandas import Series
from pandas import DataFrame
from pandas import TimeGrouper
from matplotlib import pyplot
import numpy as np
import json

parsed_json = json.load(open('./data/a88ac021f60d23d32aec7764199fcfcf64c3784548eedc852c90f6a4baa24f48.json'))
patterns = parsed_json['patterns']
inputs = map(lambda p: p['input'], patterns[2:])
for inputed in inputs:
    if(np.sum(inputed) == 0):
        print(inputed)
series = Series(inputs)
nodes = DataFrame(data = inputs)

ylims = [(-.009, -.006), (-.009, -.006), (-.009, -.006), \
(-.009, -.006), (-.009, -.006), (-.009, -.006), (-.009, -.006), (-.009, -.006)]

ax = nodes.plot(subplots = True)
print series.min()
print series.max()

for i,axes in enumerate(ax):
    axes.set_ylim(auto = True)
    axes.set_yticklabels(' ')
    axes.legend(str(i + 1))
    # print axes.set_ylabel(i)
    # axes.set_ylim(series.min()[i], series.max()[i])
    # print [series.min()[i], series.max()[i]]
# pyplot.subplot(8, 1, 1)
# pyplot.ylabel('Node 1')
# pyplot.ylim(-.009, -.006)
# pyplot.autoscale(enable = True)
#
# pyplot.subplot(8, 1, 2)
# pyplot.ylabel('Node 2')
# pyplot.ylim(-.009, -.006)
#
#
# pyplot.subplot(8, 1, 3)
# pyplot.ylabel('Node 3')
# pyplot.ylim(-.009, -.006)
#
# pyplot.subplot(8, 1, 4)
# pyplot.ylabel('Node 4')
# pyplot.ylim(-.009, -.006)
#
# pyplot.subplot(8, 1, 5)
# pyplot.ylabel('Node 5')
# pyplot.ylim(-.009, -.006)
#
# pyplot.subplot(8, 1, 6)
# pyplot.ylabel('Node 6')
# pyplot.ylim(-.009, -.006)
#
# pyplot.subplot(8, 1, 7)
# pyplot.ylabel('Node 7')
# pyplot.ylim(-.009, -.006)
#
# pyplot.subplot(8, 1, 8)
# pyplot.ylabel('Node 8')
# pyplot.ylim(-.009, -.006)

pyplot.show()
