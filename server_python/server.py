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
from calculateScore import compute_distance_score
from matchContours import matchContours
from chamferDist import  chamferDist
import base64
import json

class ImageAnalyser(object):

    def wakeUp(self):
        return

    # global beforeGrad , mainImg, geometrical1 , geometrical2 ,geometrical3 ,geometrical4 ,geometrical5

    
    img = cv2.imread('src/models/objects_2/shapes_1_e3.jpeg')
    img = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    img = cv2.resize(img,(800,600))

    geometrical1 = cv2.imread('src/models/still-life-models/geometrical1.png')
    geometrical1 = cv2.cvtColor(geometrical1,cv2.COLOR_BGR2GRAY)
    geometrical1 = cv2.resize(geometrical1,(800,600))
    
    geometrical2 = cv2.imread('src/models/still-life-models/geometrical2.png')
    geometrical2 = cv2.cvtColor(geometrical2,cv2.COLOR_BGR2GRAY)
    geometrical2 = cv2.resize(geometrical2,(800,600))
    
    geometrical3 = cv2.imread('src/models/still-life-models/geometrical3.png')
    geometrical3 = cv2.cvtColor(geometrical3,cv2.COLOR_BGR2GRAY)
    geometrical3 = cv2.resize(geometrical3,(800,600))
    
    geometrical4 = cv2.imread('src/models/still-life-models/geometrical4.png')
    geometrical4 = cv2.cvtColor(geometrical4,cv2.COLOR_BGR2GRAY)
    geometrical4 = cv2.resize(geometrical4,(800,600))
    
    geometrical5 = cv2.imread('src/models/still-life-models/geometrical5.png')
    geometrical5 = cv2.cvtColor(geometrical5,cv2.COLOR_BGR2GRAY)
    geometrical5 = cv2.resize(geometrical5,(800,600))
    
    # mainImg = img


    # global height
    # global width
    # height, width = img.shape

    # blank = np.zeros([height,width,3],dtype=np.uint8)
    # blank.fill(255)
    
    # global corners
    # corners = cv2.goodFeaturesToTrack(mainImg,250,0.01,10)

    # corners = np.int0(corners)

    # for i in corners:
    #     x,y = i.ravel()
    #     cv2.circle(img,(x,y),3,255,-1)


    def DrawingDistance(self, param):
    
        def readb64(base64_string):
            sbuf = StringIO()
            sbuf.write(base64.b64decode(base64_string))
            pimg = Image.open(sbuf)
            return cv2.cvtColor(np.array(pimg), cv2.COLOR_RGB2BGR)

        print(param["model"])
        # global mainImg,geometrical1,geometrical2,geometrical3,geometrical4,geometrical5
        if param["model"] == "geometrical1":
            mainImg = self.geometrical1
        elif param["model"] == "geometrical2":
            mainImg = self.geometrical2
        elif param["model"] == "geometrical3":
            mainImg = self.geometrical3
        elif param["model"] == "geometrical4":
            mainImg = self.geometrical4
        elif param["model"] == "geometrical5":
            mainImg = self.geometrical5

        
        # imgplot = plt.imshow(mainImg)
        # plt.title(param["model"]), plt.xticks([]), plt.yticks([])
        # plt.show()
        #This should also be documented
        img2 = imread(BytesIO(b64decode(param["dataURL"])))
        # im = Image.fromarray(img2)
        # im = im.convert('RGB')
        # im.save("your_file.jpeg")

        # img2_before = img2
        img2 = cv2.resize(img2,(800,600))

        # height2, width2, channels = img2.shape


        aligned  = alignImages(img2,mainImg)

        score = compute_distance_score(aligned, mainImg)
        # print('Score: ', score)
        # aligned = cv2.resize(aligned,(400,300))
        new_im = Image.fromarray(aligned)
        buffered = BytesIO()
        new_im.save(buffered, format="PNG")
        buffered.seek(0)
        data_uri = base64.b64encode(buffered.read()).decode('ascii')

        # encoded = aligned.encode('ascii')
        x = {
        "score": score,
        "img": data_uri,
        }

        return json.dumps(x)#data_uri#calculateScore(diff)

imageAnalyser = ImageAnalyser()
# imageAnalyser.DrawingDistance("")

s = zerorpc.Server(ImageAnalyser())
s.bind("tcp://0.0.0.0:9699")
s.run()
