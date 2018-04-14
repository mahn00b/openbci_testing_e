#!/home/lela/Python/anaconda2/bin/python

import scipy
import numpy as np
import json
import pickle
from sklearn.neural_network import MLPClassifier

#TODO: use scaler to scale data see scikit-learn 1.17.8

parsed_json = json.load(open('./data/ea6335460de66ef90a4f0b3b50842cae8d9db1a938ab7e6b1c2a270057eae934.json'))
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

clf = MLPClassifier(solver='lbfgs', alpha=1e-5, hidden_layer_sizes=(1000, ), random_state=1, activation = 'logistic')
clf.fit(inputs[1:(total_patterns/2)], outputs[1:(total_patterns/2)])
train = clf.predict(inputs[(total_patterns/2)+1:])
print(train)
print(outputs[(total_patterns/2)+1:])

match = np.logical_not(np.logical_xor(train, outputs[(total_patterns/2)+1:]))
print(np.sum(match)*1.0/len(match)*1.0)

pickle.dump(clf, open('./nn/blink.pk1', 'wb+'))
