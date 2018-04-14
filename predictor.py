#!/home/lela/Python/anaconda2/bin/python
# import scipy
# import numpy as np
# import json
# import pickle
# import sys
# import select
# from sklearn.neural_network import MLPClassifier
#
# # nn = pickle.load(open('./nn/blink.pk1', 'rb'))
# print "we in da pythong "
#
#
# def read_in():
#     lines = sys.stdin.readlines()
#     return json.loads(lines[0])
#
# def main():
#     lines = read_in()
#     np_lines = np.array(lines)
#     print np_lines
#
# if __name__ == '__main__':
#     main()
#
#
# #         while True:
# #          line =  sys.stdin.readlines()
# #          print json.loads(line[0])
#
# # def main():
# #
# #     while 1:
# #         for line in sys.stdin.readlines():
# #             sys.stdout.write(line)
import sys, json

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    #get our data as an array from read_in()
    lines = read_in()
    #return the sum to the output stream
    print lines

# Start process
if __name__ == '__main__':
    main()
