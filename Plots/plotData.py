#!/home/lela/Python/anaconda2/bin/python
#!/home/lela/Python/anaconda2/bin/python
from pandas import TimeGrouper
import matplotlib.pyplot as plt
import numpy as np
import json
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import MinMaxScaler
from sklearn import datasets

#different learning rate parameters
params = [{'solver': 'sgd', 'learning_rate': 'constant', 'momentum': 0,
           'learning_rate_init': 0.2},
          {'solver': 'sgd', 'learning_rate': 'constant', 'momentum': .9,
           'nesterovs_momentum': False, 'learning_rate_init': 0.2},
          {'solver': 'sgd', 'learning_rate': 'constant', 'momentum': .9,
           'nesterovs_momentum': True, 'learning_rate_init': 0.2},
          {'solver': 'sgd', 'learning_rate': 'invscaling', 'momentum': 0,
           'learning_rate_init': 0.2},
          {'solver': 'sgd', 'learning_rate': 'invscaling', 'momentum': .9,
           'nesterovs_momentum': True, 'learning_rate_init': 0.2},
          {'solver': 'sgd', 'learning_rate': 'invscaling', 'momentum': .9,
           'nesterovs_momentum': False, 'learning_rate_init': 0.2},
          {'solver': 'adam', 'learning_rate_init': 0.01}]

labels = ["constant learning", "constant w/momentum",
          "constant w/Nesterov's momentum",
          "inv-scaling learning", "inv-scaling w/momentum",
          "inv-scaling w/Nesterov's momentum", "adam"]


plot_args = [{'c': 'red', 'linestyle': '-'},
             {'c': 'green', 'linestyle': '-'},
             {'c': 'blue', 'linestyle': '-'},
             {'c': 'red', 'linestyle': '--'},
             {'c': 'green', 'linestyle': '--'},
             {'c': 'blue', 'linestyle': '--'},
             {'c': 'black', 'linestyle': '-'}]

def plot_on_dataset(X, y):
    # for each dataset, plot learning for each learning strategy
    #X = MinMaxScaler().fit_transform(X)
    mlps = []
    max_iter = 400

    for label, param in zip(labels, params):
        mlp = MLPClassifier(verbose=0, random_state=0,
                            max_iter=max_iter, **param)
        mlp.fit(X, y)
        mlps.append(mlp)
    for mlp, label, args in zip(mlps, labels, plot_args):
            plt.plot(mlp.loss_curve_, label=label, **args)

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

ax = plt.plot(linewidth = .6, fontsize = 30)
#for tick in plt.get_xticklabels():
#    tick.set_fontsize(25)
plot_on_dataset(inputs, outputs)
plt.xticks(size = 20)
plt.yticks(size = 20)
plt.suptitle("Loss Function of Stochatic Models of Neural Nets", fontsize = 30)
plt.legend(labels, ncol=2, loc="upper center", fontsize = 23)
plt.ylabel('Loss', fontsize = 30)
plt.xlabel('Training amount in thousands', fontsize = 30)
plt.show()
