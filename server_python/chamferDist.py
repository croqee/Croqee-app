import numpy as np
from numpy import linalg as LA
import cv2 

def array2samples_distance(array1, array2):
    """
    arguments: 
        array1: the array, size: (num_point, num_feature)
        array2: the samples, size: (num_point, num_feature)
    returns:
        distances: each entry is the distance from a sample to array1 
    """
    num_point, num_features = array1.shape
    expanded_array1 = np.tile(array1, (num_point, 1))
    expanded_array2 = np.reshape(
            np.tile(np.expand_dims(array2, 1), 
                    (1, num_point, 1)),
            (-1, num_features))
    distances = LA.norm(expanded_array1-expanded_array2, axis=1)
    distances = np.reshape(distances, (num_point, num_point))
    distances = np.min(distances, axis=1)
    distances = np.mean(distances)
    return distances

def chamfer_distance_numpy(array1, array2):
    batch_size, num_point, num_features = array1.shape
    dist = 0
    for i in range(batch_size):
        av_dist1 = array2samples_distance(array1[i], array2[i])
        av_dist2 = array2samples_distance(array2[i], array1[i])
        dist = dist + (av_dist1+av_dist2)/batch_size
    return dist

def chamferDist(img, img2):
    corners = cv2.goodFeaturesToTrack(img,130,0.01,10)
    corners2 = cv2.goodFeaturesToTrack(cv2.cvtColor(img2,cv2.COLOR_BGR2GRAY),130,0.01,10)
    if len(corners2) < len(corners):
        corners = cv2.goodFeaturesToTrack(img,len(corners2),0.01,10)
    elif len(corners) < len(corners2):
        corners2 = cv2.goodFeaturesToTrack(img,len(corners2),0.01,10)


    print("cornersss")
    print(len(corners))
    print(len(corners2))
    dist = chamfer_distance_numpy(corners,corners2)
    return dist

