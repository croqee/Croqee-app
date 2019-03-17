from __future__ import print_function
import cv2 as cv
import numpy as np
import argparse
from numpy.core.umath_tests import inner1d
from matplotlib import pyplot as plt


def alignImages(img, img2):
    img_final = cv.cvtColor(img,cv.COLOR_BGR2GRAY)
    img = img_final

    print(img2)
    print(img)

    img = cv.resize(img,(80,60))
    img2 = cv.resize(img2,(80,60))
    rows,cols = img.shape

    corners2 = cv.goodFeaturesToTrack(img2,525,0.01,10)
    global n2
    n2 = np.squeeze(np.asarray(corners2))

    global bestX , bestY , bestScaleX, bestScaleY
    bestX = 0
    bestY = 0
    bestScale = 0
    global smallestDistance
    smallestDistance = 1000
    # corners = cv2.goodFeaturesToTrack(gray,225,0.01,10)
    # corners = np.int0(corners)

    def HausdorffDist(A,B):
        D_mat = np.sqrt(inner1d(A,A)[np.newaxis].T + inner1d(B,B)-2*(np.dot(A,B.T)))
        dH = np.max(np.array([np.max(np.min(D_mat,axis=0)),np.max(np.min(D_mat,axis=1))]))
        return(dH)

    for i in range(0, 40):
        for j in range(0, 30):
                M = np.float32([[1,0,i-20],[0,1,j-15]])
                dst = cv.warpAffine(img,M,(cols,rows))
        
                corners = cv.goodFeaturesToTrack(dst,525,0.01,10)
                n1 = np.squeeze(np.asarray(corners))
                try:
                   distance = HausdorffDist(n1,n2)
                except:
                   distance = 1000
                if distance < smallestDistance:
                    smallestDistance = distance
                    bestX = i
                    bestY = j



    print(smallestDistance)
    print(bestX)
    print(bestY)
    print(bestScale)

    M = np.float32([[1,0,bestX-20],[0,1,bestY-20]])
    dst = cv.warpAffine(img,M,(cols,rows))
    # cv.imshow('img2',dst)
    # cv.waitKey(0)
    # cv.destroyAllWindows()

    bestX = (bestX - 20) * 10
    bestY = (bestY - 15) * 10
    M = np.float32([[1,0,bestX],[0,1,bestY]])
    rows,cols = img_final.shape
    aligned = cv.warpAffine(img_final,M,(cols,rows))
    return aligned