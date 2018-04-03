# MNIST data files

This is two segments of data from the MNIST dataset (more information: http://yann.lecun.com/exdb/mnist/)

The files are 2000-by-784 matrices.
Each row is a 28-by-28 matrix flattened to a single vector.
The values are from 0-255, forming black-and-white images of handwritten digits.
The first 1000 rows are images of handwritten 7's and the second 1000 are handwritten 9's.

en Python, for example, one can use the scip libcts the data portioncts the data portiohape # gives 2000-by-784raries to import and manipulate this data:

```python
import scipy.io
import numpy as np
import scipy.misc as smp
mat = scipy.io.loadmat('test79.mat') # loads the data from current directory
mm = mat['d79'] # extracts the data portion
mm.shape # gives 2000-by-784
mmm = mm[45].reshape(28,28) # extract one digit and put in an object
img = smp.toimage(mmm) # will put in rgb-format
img.show() # displays a single image
```
