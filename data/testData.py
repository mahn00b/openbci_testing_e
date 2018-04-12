#!/home/lela/Python/anaconda2/bin/python

import scipy
import numpy as np
import json
from sklearn.neural_network import MLPClassifier

#TODO: use scaler to scale data see scikit-learn 1.17.8

parsed_json = json.load(open('ea6335460de66ef90a4f0b3b50842cae8d9db1a938ab7e6b1c2a270057eae934.json'))
patterns = parsed_json['patterns']
total_patterns = parsed_json['total_patterns']

parsed_json1 = json.load(open('mahmoud_Yousif_BlinkTest_1.json'))
patterns1 = parsed_json['patterns']
total_patterns1 = parsed_json['total_patterns']

inputs = np.empty((total_patterns, 8), dtype = np.float64)
# outputs = np.empty((total_patterns, 1), dtype = np.float64)
outputs = np.zeros(total_patterns)

i = 0

for (pattern) in patterns[1:]:
    inputs[i][0] = np.float64(pattern['input'][0])
    inputs[i][1] = np.float64(pattern['input'][1])
    inputs[i][2] = np.float64(pattern['input'][2])
    inputs[i][3] = np.float64(pattern['input'][3])
    inputs[i][4] = np.float64(pattern['input'][4])
    inputs[i][5] = np.float64(pattern['input'][5])
    inputs[i][6] = np.float64(pattern['input'][6])
    inputs[i][7] = np.float64(pattern['input'][7])
    outputs[i] = np.float64(pattern['output'][0])
    i+=1

clf = MLPClassifier(solver='lbfgs', alpha=1e-5, hidden_layer_sizes=(1000, ), random_state=1, activation = 'logistic')
clf.fit(inputs[1:(total_patterns/2)], outputs[1:(total_patterns/2)])
train = clf.predict(inputs[(total_patterns/2)+1:])
print(train)
print(outputs[(total_patterns/2)+1:])

match = np.logical_not(np.logical_xor(train, outputs[(total_patterns/2)+1:]))
print(np.sum(match)*1.0/len(match)*1.0)
