  ######################################
  ##### Hausdorf Distance Operator #####
  ######################################
import numpy as np
from numpy.core.umath_tests import inner1d
from scipy.spatial.distance import directed_hausdorff


def HausdorffDist(A,B):
            # D_mat = np.sqrt(inner1d(A,A)[np.newaxis].T + inner1d(B,B)-2*(np.dot(A,B.T)))
            # dH = np.max(np.array([np.max(np.min(D_mat,axis=0)),np.max(np.min(D_mat,axis=1))]))
            # return(dH)
            d_forward = directed_hausdorff(A, B)[0]
            d_backward = directed_hausdorff(B, A)[0]
            return max(d_forward, d_backward)