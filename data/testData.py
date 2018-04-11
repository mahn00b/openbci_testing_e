#! /bin/sh

import scipy
import numpy as np
import json

parsed_json = json.load(open('mahmoud_Yousif_BlinkTest_1.json'))
patterns = parsed_json['patterns']
total_patterns = parsed_json['total_patterns']

for pattern in patterns[1:10]:
    print(pattern)
