import socketio
import eventlet
import os
import json
import base64
from chamferDist import chamferDist
from matchContours import matchContours
from calculateScore import compute_distance_score
from displayImages import displayImages
from distanceMeasurment import HausdorffDist
import sys
from alignImages import alignImages
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
from base64 import b64decode
import logging
logging.basicConfig()


class ImageAnalyser(object):

    def wakeUp(self):
        return

    folder_names = os.listdir('./src/models')
    image_dict = {}
    for folder_name in folder_names:
        for image_name in os.listdir('./src/models/'+folder_name):
            if not '.png' in image_name:
                continue
            img = cv2.imread('./src/models/'+folder_name+'/'+image_name)
            # print('./src/models/'+folder_name+'/'+image_name)
            # img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            # img = cv2.resize(img, (800, 600))
            image_dict[image_name.split('.')[0]] = img

    def numpy2pil(self, np_array: np.ndarray) -> Image:
        img = Image.fromarray(np_array.astype(np.uint8))
        return img
    def pilToNumpy(self, img):
        img = np.array(img)
        return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    def DrawingDistance(self, param):

        userDrawing = imread(BytesIO(b64decode(param["dataURL"])))

        # print(param["model"])

        userDrawingScale =  userDrawing.shape
        userCanvasHeight = userDrawingScale[0]
        userCanvasWidth = userDrawingScale[1]
        _mainImg = self.image_dict[param["model"]]

        mainImg = np.zeros([userCanvasHeight,userCanvasWidth,3],dtype=np.uint8)
        mainImg.fill(255) # or img[:] = 255
        mainImg = Image.fromarray(mainImg, 'RGB')

        imgRatio = 800 / 600
        if (userCanvasWidth / userCanvasHeight) <= imgRatio:
            imgWidth = userCanvasWidth
            imgHeight = round(imgWidth / imgRatio)
            resizedModel = cv2.resize(_mainImg, (imgWidth, imgHeight))
            resizedModel = self.numpy2pil(resizedModel)
            spaceFromTop = round((userCanvasHeight - imgHeight) / 2)
            mainImg.paste(resizedModel, (0 , spaceFromTop))
            mainImg = self.pilToNumpy(mainImg)
        else:
            imgHeight = userCanvasHeight
            imgWidth = round(imgHeight * imgRatio)
            resizedModel = cv2.resize(_mainImg, (imgWidth, imgHeight))
            resizedModel = self.numpy2pil(resizedModel)
            spaceFromLeft = round((userCanvasWidth - imgWidth) / 2)
            mainImg.paste(resizedModel, (spaceFromLeft , 0))
            mainImg = self.pilToNumpy(mainImg)



        alignedDrawing = alignImages(userDrawing, mainImg, userCanvasWidth, userCanvasHeight, (round(userCanvasHeight/4),round(userCanvasWidth/4)))

        score = compute_distance_score(alignedDrawing, mainImg)
        alignedDrawing = Image.fromarray(alignedDrawing)
        buffered = BytesIO()
        alignedDrawing.save(buffered, format="PNG")
        buffered.seek(0)
        data_uri = base64.b64encode(buffered.read()).decode('ascii')
        # encoded = aligned.encode('ascii')
        x = {
            "score": score,
            "img": data_uri,
        }

        return json.dumps(x)  # data_uri#calculateScore(diff)


sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files={
    '/': {'content_type': 'text/html', 'filename': 'index.html'}
})
imageAnalyser = ImageAnalyser()


@sio.event
def connect(sid, environ):
    print('connect ', sid)


@sio.event
def calculate_score(sid, data):
    return imageAnalyser.DrawingDistance(data)


@sio.event
def disconnect(sid):
    print('disconnect ', sid)


if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', 9699)), app)
