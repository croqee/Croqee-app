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
from alignImages import alignImages
import sys
from distanceMeasurment import HausdorffDist
from displayImages import displayImages
from calculateScore import compute_distance_score
from matchContours import matchContours
from chamferDist import  chamferDist
import base64
import json
import os
import eventlet
import socketio

class ImageAnalyser(object):

    def wakeUp(self):
        return

    folder_names = os.listdir('./src/models')
    image_dict = {}
    for folder_name in folder_names:
        for image_name in os.listdir('./src/models/'+folder_name):
            if not '.png' in image_name: continue
            img = cv2.imread('./src/models/'+folder_name+'/'+image_name)
            # print('./src/models/'+folder_name+'/'+image_name)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            img = cv2.resize(img, (800, 600))
            image_dict[image_name.split('.')[0]] = img

    def DrawingDistance(self, param):
    

        # print(param["model"])
        mainImg = self.image_dict[param["model"]]

        img2 = imread(BytesIO(b64decode(param["dataURL"])))

        img2 = cv2.resize(img2,(800,600))

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
