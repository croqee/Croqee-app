from __future__ import print_function
import cv2 as cv
import numpy as np
import argparse
from numpy.core.umath_tests import inner1d
from matplotlib import pyplot as plt
from scaleInnerContents import scaleInnerContents
from distanceMeasurment import HausdorffDist

def alignImages(img, img2):
    global img_final , n2_org , corners2_org
    img_final = cv.cvtColor(img,cv.COLOR_BGR2GRAY)
    gray1 = img_final
    gray2 = img2

   #  def Hausdorff_Dist(A,B):
   #      D_mat = np.sqrt(inner1d(A,A)[np.newaxis].T + inner1d(B,B)-2*(np.dot(A,B.T)))
   #      dH = np.max(np.array([np.max(np.min(D_mat,axis=0)),np.max(np.min(D_mat,axis=1))]))
   #      return(dH)

    corners_org = cv.goodFeaturesToTrack(gray1,250,0.01,10)
    n1_org = np.squeeze(np.asarray(corners_org))
    corners2_org = cv.goodFeaturesToTrack(gray2,250,0.01,10)
    n2_org = np.squeeze(np.asarray(corners2_org))
    distance_org = HausdorffDist(n1_org,n2_org)
   #  print("khas  "+ str(Hausdorff_Dist(n1_org,n2_org)))
   #  print("lib  "+ str(distance_org))

    img = cv.resize(gray1,(80,60))
    img2 = cv.resize(gray2,(80,60))
    rows,cols = img.shape
    corners2 = cv.goodFeaturesToTrack(img2,100,0.01,10)
    global n2
    n2 = np.squeeze(np.asarray(corners2))
    
    global bestX , bestY , bestScaleX, bestScaleY, bestScale
    bestX = 0
    bestY = 0
    bestScale = 0
    global smallestDistance

    
    smallestDistance = 1000




    for i in range(0, 40):
        for j in range(0, 30):
           for k in range(0, 6):
                M = np.float32([[1,0,i-20],[0,1,j-15]])
                dst = cv.warpAffine(img,M,(cols,rows))
                scale = 0.8 + float(( k * 0.1 ))
                dst = scaleInnerContents(dst,scale)

                corners = cv.goodFeaturesToTrack(dst,100,0.01,10)
                n1 = np.squeeze(np.asarray(corners))
                try:
                   distance = HausdorffDist(n1,n2)
                except:
                   distance = 1000
                if distance < smallestDistance:
                    smallestDistance = distance
                    bestX = i
                    bestY = j
                    bestScale = scale


   #  print("smallestDistance final")
   #  print(smallestDistance)
   #  print(bestX)
   #  print(bestY)
   #  print(bestScale)
   #  print("bestScale")

    dst = cv.warpAffine(img,M,(cols,rows))
   #  cv.imshow('img2',dst)
   #  cv.waitKey(0)
   #  cv.destroyAllWindows()

    bestX = (bestX -20) * 10
    bestY = (bestY -15) * 10
    M = np.float32([[1,0,bestX],[0,1,bestY]])
    rows,cols = img_final.shape
    aligned = cv.warpAffine(img_final,M,(cols,rows), borderValue=(255,255,255))
    aligned = scaleInnerContents(aligned,bestScale)


    corners_alg = cv.goodFeaturesToTrack(aligned,250,0.01,10)
    n1_alg = np.squeeze(np.asarray(corners_alg))
    distance_alg = HausdorffDist(n1_alg,n2_org)

   #  print("distance_alg: " + str(distance_alg))
   #  plt.title(' drawing'), plt.xticks([]), plt.yticks([])
   #  plt.imshow(aligned),plt.show()
   

    finalImg = aligned
    finalDistance = 0
    lengthDiff = 0
    if distance_org < distance_alg:
       finalImg =  img_final
       finalDistance = distance_org
       lengthDiff = abs(len(corners_org)-len(corners2_org))
    else:
       finalImg =  aligned
       finalDistance = distance_alg
       lengthDiff = abs(len(corners_alg)-len(corners2_org))
    

    return finalImg , finalDistance, lengthDiff 
