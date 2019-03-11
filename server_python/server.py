import cv2 
import numpy as np
from matplotlib import pyplot as plt
import matplotlib.image as mpimg
from PIL import Image
import PIL.Image
from numpy.core.umath_tests import inner1d
from base64 import b64decode
from io import StringIO
from io import BytesIO
from scipy.misc import imread
import zerorpc
from w3lib.url import parse_data_uri
import logging
logging.basicConfig()

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

    img = cv2.imread('Edge_Detected_Box.png')
    global height
    global width
    height, width, channels = img.shape
    #This time we would add the corners to a white blank image
    blank = np.zeros([height,width,3],dtype=np.uint8)
    blank.fill(255)
    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    
    global corners
    corners = cv2.goodFeaturesToTrack(gray,225,0.01,10)
    corners = np.int0(corners)

    

    def DrawingDistance(self, param):



        def HausdorffDist(A,B):
            D_mat = np.sqrt(inner1d(A,A)[np.newaxis].T + inner1d(B,B)-2*(np.dot(A,B.T)))
            dH = np.max(np.array([np.max(np.min(D_mat,axis=0)),np.max(np.min(D_mat,axis=1))]))
            return(dH)
        def readb64(base64_string):
            sbuf = StringIO()
            sbuf.write(base64.b64decode(base64_string))
            pimg = Image.open(sbuf)
            return cv2.cvtColor(np.array(pimg), cv2.COLOR_RGB2BGR)


        print(param)
        img2 = imread(BytesIO(b64decode(param)))

        # with open("image.png", "wb") as f:
        #  img2 =  f.read(data)
        # imgplot = plt.imshow(img2)
        # plt.show()

        print("worked til here")

        gray2 = cv2.cvtColor(img2,cv2.COLOR_BGR2GRAY)

        corners2 = cv2.goodFeaturesToTrack(gray2,225,0.01,10)
        corners2 = np.int0(corners2)

        n1 = np.squeeze(np.asarray(corners))
        n2 = np.squeeze(np.asarray(corners2))
        results = HausdorffDist(n1,n2)
        print(results)
        return results

imageAnalyser = ImageAnalyser()
# imageAnalyser.DrawingDistance("")

# s = zerorpc.Server(ImageAnalyser())
# s.bind("tcp://0.0.0.0:4241")
# s.run()

s = zerorpc.Server(ImageAnalyser())
s.bind("tcp://0.0.0.0:9999")
s.run()