#!/home/lela/Python/anaconda2/bin/python
from pandas import Series
from pandas import DataFrame
from pandas import TimeGrouper
import matplotlib.pyplot as plt
import scipy
import numpy as np
import json
import pickle
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.model_selection import KFold
from sklearn.cross_validation import cross_val_score
from sklearn import metrics

def KF(inputs, outputs, layer_sizes):
    X = inputs
    y = outputs
    k_scores = []
    kf = KFold(n_splits=3)
    clf = MLPClassifier(solver='sgd', alpha=1e-5, hidden_layer_sizes= layer_sizes, random_state=1, activation = 'logistic')
    i = 0

    for train_indices, test_indices in kf.split(X):
        clf.fit(X[train_indices], y[train_indices])
        k_scores.append(clf.score(X[test_indices], y[test_indices]))

    return np.array(k_scores).mean()

parsed_json = json.load(open('../data/mac_dude_BlinkTest_1.json'))
patterns = parsed_json['patterns']
total_patterns = parsed_json['total_patterns']

inputs = np.empty((total_patterns, 8), dtype = np.float64)
# outputs = np.empty((total_patterns, 1), dtype = np.float64)
outputs = np.zeros(total_patterns)

i = 0

for (pattern) in patterns[1:]:
    for x in range(0,8):
        inputs[i][x] = np.float64(pattern['input'][x])
    outputs[i] = np.float64(pattern['output'][0])
    i+=1

scores = []
start_size = 2100
gap = 300
params = (100, 100)
line = []

for amount in range(start_size, total_patterns, gap):
    scores.append(KF(inputs[0:amount], outputs[0:amount], params))

line.append()
plt.plot(range(start_size, total_patterns, gap), scores)
plt.plot(range(start_size, total_patterns, gap), np.array(scores)-.5)

plt.xlabel('Sample Size')
plt.ylabel('Accuracy')
plt.title('Classifier Accuracy - SGD - ' + str(params))
plt.ylim(0, 1.1)
plt.xlim(1999, 12001)
plt.show()
