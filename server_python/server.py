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
    global mainImg
    img = cv2.imread('Edge_Detected_Box_2.png')
    img = cv2.resize(img,(800,600))
    mainImg = img
    global height
    global width
    height, width, channels = img.shape
    print(height)
    print(width)
    print("____")
    #This time we would add the corners to a white blank image
    blank = np.zeros([height,width,3],dtype=np.uint8)
    blank.fill(255)
    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    
    global corners
    corners = cv2.goodFeaturesToTrack(gray,225,0.01,10)
    corners = np.int0(corners)

    for i in corners:
        x,y = i.ravel()
        cv2.circle(img,(x,y),3,255,-1)


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

        img2 = imread(BytesIO(b64decode(param)))
        img2 = cv2.resize(img2,(800,600))

        height2, width2, channels = img2.shape
        print(height2)
        print(width2)
        print("+++++")
     
    

        gray2 = cv2.cvtColor(img2,cv2.COLOR_BGR2GRAY)

        corners2 = cv2.goodFeaturesToTrack(gray2,225,0.01,10)
        corners2 = np.int0(corners2)

   #for TEST
        # blank = np.zeros([height,width,3],dtype=np.uint8)
        # blank.fill(255)
        # for i in corners2:
        #     x,y = i.ravel()
        #     cv2.circle(blank,(x,y),3,255,-1)

        # plt.subplot(121),plt.imshow(blank,cmap = 'gray')
        # plt.title('Your Drawing'), plt.xticks([]), plt.yticks([])
        # plt.subplot(122),plt.imshow(mainImg,cmap = 'gray')
        # plt.title('Model'), plt.xticks([]), plt.yticks([])
        # plt.imshow(mainImg),plt.show()

    #END - for TEST



        n1 = np.squeeze(np.asarray(corners))
        n2 = np.squeeze(np.asarray(corners2))
        results = HausdorffDist(n1,n2)
        worstResult = 249
        if results < 100:
            score = (((250-results)/250)*100) + ((100-results)*1.2) 
        elif  results < worstResult:
            score = ((250-results)/250)*100  
        else:   
            score = 0 
        print(score)
        return score

imageAnalyser = ImageAnalyser()
# imageAnalyser.DrawingDistance("")
# s = zerorpc.Server(ImageAnalyser())
# s.bind("tcp://0.0.0.0:4241")
# s.run()

s = zerorpc.Server(ImageAnalyser())
s.bind("tcp://0.0.0.0:9699")
s.run()