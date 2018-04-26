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
from sklearn.cross_validation import KFold
from sklearn.neighbors import KNeighborsClassifier
from sklearn.cross_validation import cross_val_score
from sklearn import metrics

def KNeighborsPlot(inputs, outputs):
    X = inputs
    y = outputs
    k_range = range(1,101)
    k_scores = []

    for k in k_range:
        knn = KNeighborsClassifier(n_neighbors=k)
        scores = cross_val_score(knn, X, y, cv=10, scoring='accuracy')
        k_scores.append(scores.mean())
    print k_scores

    plt.plot(k_range, k_scores)
    plt.xlabel('Value of K for KNN')
    plt.ylabel('Cross-validated accuracy')
    plt.show()

def KNeighbors(inputs, outputs):
    X = inputs
    y = outputs
    X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=6)
    knn = KNeighborsClassifier(n_neighbors=15)
    knn.fit(X_train, y_train)
    y_pred = knn.predict(X_test)
    metrics.accuracy_score(y_test, y_pred)

def KFolds(inputs, outputs):
    kf = KFold(n_splits=10)
    clf = MLPClassifier(solver='lbfgs', alpha=1e-5, hidden_layer_sizes=(1000, ), random_state=1, activation = 'logistic')

    for train_indices, test_indices in kf.split(X):
        clf.fit(X[train_indices], y[train_indices])
        print(clf.score(X[test_indices], y[test_indices]))


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

KNeighborsPlot(inputs, outputs)
