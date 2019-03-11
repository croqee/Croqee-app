import cv2 
import numpy as np
from matplotlib import pyplot as plt
from PIL import Image
from numpy.core.umath_tests import inner1d
import zerorpc


class HelloRPC(object):
    def hello(self, name):
        return "Hello, %s" % name

class ImageAnalyser(object):


    ######################################
    ##### Hausdorf Distance Operator #####
    ######################################
    def HausdorffDist(A,B):
        D_mat = np.sqrt(inner1d(A,A)[np.newaxis].T + inner1d(B,B)-2*(np.dot(A,B.T)))
        dH = np.max(np.array([np.max(np.min(D_mat,axis=0)),np.max(np.min(D_mat,axis=1))]))
        return(dH)


    #######################################
    ##### Shi Tomasi Corner Detection #####
    #######################################

    img = cv2.imread('model.jpg')
    height, width, channels = img.shape
    #This time we would add the corners to a white blank image
    blank = np.zeros([height,width,3],dtype=np.uint8)
    blank.fill(255)
    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

    corners = cv2.goodFeaturesToTrack(gray,225,0.01,10)
    global corners
    corners = np.int0(corners)

    def DrawingDistance(self, param):
         
        return "%s, You're getting me from Python server" % param 
        #The rest would work befor the initial test
        def HausdorffDist(A,B):
            D_mat = np.sqrt(inner1d(A,A)[np.newaxis].T + inner1d(B,B)-2*(np.dot(A,B.T)))
            dH = np.max(np.array([np.max(np.min(D_mat,axis=0)),np.max(np.min(D_mat,axis=1))]))
            return(dH)


        img2 = cv2.imread('model.jpg')
        gray2 = cv2.cvtColor(img2,cv2.COLOR_BGR2GRAY)

        corners2 = cv2.goodFeaturesToTrack(gray2,225,0.01,10)
        corners2 = np.int0(corners2)

        n1 = np.squeeze(np.asarray(corners))
        n2 = np.squeeze(np.asarray(corners2))
        results = HausdorffDist(n1,n2)
        print(results)
        return results

# imageAnalyser = ImageAnalyser()
# imageAnalyser.DrawingDistance()

# s = zerorpc.Server(ImageAnalyser())
# s.bind("tcp://0.0.0.0:4241")
# s.run()

s = zerorpc.Server(ImageAnalyser())
s.bind("tcp://0.0.0.0:4234")
s.run()