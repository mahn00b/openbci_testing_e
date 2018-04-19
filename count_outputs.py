import numpy as np
import json


parsed_json = json.load(open('./data/970119f9d2cafdd10415a413f64a107a4d1ad6207aff7c614512c628fb60c0ee.json'))
patterns = parsed_json['patterns']
total_patterns = parsed_json['total_patterns']



#inputs = np.empty((total_patterns, 8), dtype = np.float64)
outputs = np.empty((total_patterns, 1), dtype = np.float64)
outputs = np.zeros(total_patterns)



i = 0

for (pattern) in patterns[1:]:
    outputs[i] = np.float64(pattern['output'][0])
    i+=1

train_outputs = outputs[0:total_patterns/2]
test_outputs = outputs[total_patterns/2 + 1 : total_patterns]
#total_train_ones = /(total_patterns/2)
print "number of 1's in training data"
print np.sum(train_outputs)


#total_test_ones = np.sum(test_outputs)/(total_patterns/2)
print "number of 1's in testing data"
print np.sum(test_outputs)
