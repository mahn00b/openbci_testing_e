#!/home/lela/Python/anaconda2/bin/python
import scipy
import numpy as np
import json
import pickle
import sys
import select

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


#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one loine, parse our JSON data from that
    #print lines
    return json.loads(lines[0])

def main():
    nn = pickle.load(open('./nn/blink2.pk1', 'rb'))

    #get our data as an array from read_in()
    lines = read_in()
    lines = np.array(lines)
    print lines
    outputs = nn.predict(lines)
    total_blinks = np.sum(outputs)
    print total_blinks
    # print total_blinks
    # total_blinks = (float(total_blinks)/float(len(outputs)))
    # print total_blinks



# Start process
if __name__ == '__main__':
    main()
