from __future__ import print_function
import cv2 as cv
import numpy as np
import argparse
from numpy.core.umath_tests import inner1d
from matplotlib import pyplot as plt
from scaleInnerContents import scaleInnerContents
from distanceMeasurment import HausdorffDist

def alignImages(img, target):
   if len(img.shape)==3:
      img = cv.cvtColor(img,cv.COLOR_BGR2GRAY)
   if len(target.shape)==3:
      target = cv.cvtColor(target,cv.COLOR_BGR2GRAY)
   assert img.shape==target.shape==(600,800)
   if np.all(img==0):
      return img, 0, 0

   orig_img = img
   pad_shape = ((300,300),(400,400))
   img = np.pad(255-img,pad_shape,mode='constant').astype(np.float32)
   target = np.pad(255-target,pad_shape,mode='constant').astype(np.float32)
   target /= np.linalg.norm(target)
   sigma = 5
   target = cv.GaussianBlur(target, (4*sigma+1,4*sigma+1),sigma)

   similarities = []
   for s in np.linspace(0.8,1.6,8):
      M = np.float32([[s,0,0],[0,s,0]])
      img1 = cv.warpAffine(img,M,img.shape[::-1])
      img1 = cv.GaussianBlur(img1, (4*sigma+1,4*sigma+1),sigma)
      img1 /= np.linalg.norm(img1)
      conv = np.fft.irfft2(np.fft.rfft2(img1)*np.conjugate(np.fft.rfft2(target)))
      sx, sy = np.unravel_index(np.argmax(conv), img1.shape[:2])
      similarities.append((conv[sx,sy],s,(sx,sy)))

   s, shift = max(similarities, key=lambda x:x[0])[1:]
   sx, sy = shift
   if sx>600:sx-=1200
   if sy>800:sy-=1600
   M = np.float32([[s,0,-sy+400*(s-1)],[0,s,-sx+300*(s-1)]])
   out = cv.warpAffine(orig_img,M,orig_img.shape[::-1],borderValue=255)
   return out

def alignImages__old(img, img2):
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
