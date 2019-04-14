import cv2 
import numpy as np
from matplotlib import pyplot as plt
import matplotlib.image as mpimg
from PIL import Image
import PIL.Image
from numpy.core.umath_tests import inner1d
from io import StringIO
from io import BytesIO
from scipy.misc import imread
import zerorpc
from base64 import b64decode
import logging
logging.basicConfig()
from alignImages import alignImages
import sys
from distanceMeasurment import HausdorffDist
from displayImages import displayImages
from calculateScore import calculateScore

class ImageAnalyser(object):



    global mainImg
    img = cv2.imread('src/models/objects_2/shapes_1_e.png',0)
    img = cv2.resize(img,(800,600))
    mainImg = img
    global height
    global width
    height, width = img.shape
    # print(height)
    # print(width)
    # print("____")
    #This time we would add the corners to a white blank image
    blank = np.zeros([height,width,3],dtype=np.uint8)
    blank.fill(255)
    
    global corners
    corners = cv2.goodFeaturesToTrack(img,250,0.01,10)
    corners = np.int0(corners)

    for i in corners:
        x,y = i.ravel()
        cv2.circle(img,(x,y),3,255,-1)


    def DrawingDistance(self, param):

        def readb64(base64_string):
            sbuf = StringIO()
            sbuf.write(base64.b64decode(base64_string))
            pimg = Image.open(sbuf)
            return cv2.cvtColor(np.array(pimg), cv2.COLOR_RGB2BGR)
            
        #This should also be documented
        img2 = imread(BytesIO(b64decode(param)))
        img2 = cv2.resize(img2,(800,600))

        height2, width2, channels = img2.shape
        # print(height2)
        # print(width2)
        # print("+++++")
     
    
        try:
            aligned = alignImages(img2,mainImg)
        except:
            aligned = cv2.cvtColor(img2,cv2.COLOR_BGR2GRAY)

        corners2 = cv2.goodFeaturesToTrack(aligned,250,0.01,10)

    
#    for TEST

        # blank = np.zeros([height,width,3],dtype=np.uint8)
        # blank.fill(255)
        # for i in corners2:
        #     x,y = i.ravel()
        #     cv2.circle(blank,(x,y),3,255,-1)

        # blank2 = np.zeros([height,width,3],dtype=np.uint8)
        # blank2.fill(255)
        # # print(corners)
        # for i in corners:
        #     x,y = i.ravel()
        #     cv2.circle(blank2,(x,y),3,255,-1)


      
        # plt.subplot(121),plt.imshow(blank2,cmap = 'gray')
        # plt.title('Original image'), plt.xticks([]), plt.yticks([])
        # plt.subplot(122)
        # plt.title('drawn'), plt.xticks([]), plt.yticks([])
        # plt.imshow(blank,cmap = 'gray'),plt.show()


    # END - for TEST



        n1 = np.squeeze(np.asarray(corners))
        n2 = np.squeeze(np.asarray(corners2))
        results = HausdorffDist(n1,n2)
        return calculateScore(results)

imageAnalyser = ImageAnalyser()
# imageAnalyser.DrawingDistance("")

s = zerorpc.Server(ImageAnalyser())
s.bind("tcp://0.0.0.0:9699")
s.run()