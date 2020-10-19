import socketio
import eventlet
import os
import json
import base64
#from chamferDist import chamferDist
# from matchContours import matchContours
from calculateScore import compute_distance_score
#from displayImages import displayImages
# from distanceMeasurment import HausdorffDist
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

    ### load all reference images into dictionary
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

    def padReferenceImage(self, mainImg, userDrawingScale):
        """
        :param mainImg: np.ndarray(n, m) of int; base line image in grayscale as reference
        :param userDrawingScale: (k, l) touple of int; shape of the drawing canvas
        :return: np.ndarray(k, l) of int; base line image padded with white (255) to match canvas shape
        """
        wdth, hght = userDrawingScale
        ref_wdth, ref_hght = mainImg.shape[:2]
        x_pad = (wdth - ref_wdth)
        y_pad = (hght - ref_hght)
        return np.pad(mainImg, ((x_pad // 2, x_pad - x_pad // 2), (y_pad // 2, y_pad - y_pad // 2)), mode='constant', constant_values=255)

    def matchUserDrawingSize(self, userDrawing, refImageShape):
        """
        :param userDrawing: np.ndarray(n, m) of int; drawing supplied by the usert
        :param refImageShape: (k, l) touple of int; shape of the reference drawing
        :return: np.ndarray(x, l) or np.ndarray(k, y) of int; rescaled image such that width or height
            matches the refImageShape but the proportions are kept and the image is bigger than the reference size.
            If this image is bigger than 4096 in any direction, it gets cropped
        """
        canvasShape = userDrawing.shape[:2]

        # get scaling factor which scales such that the relatively smaller side coincides with the reference size
        scaling_factor = max(refImageShape[0] / canvasShape[0], refImageShape[1] / canvasShape[1])
        userDrawingScale = tuple([max(int(x * scaling_factor), y) for x, y in zip(canvasShape, refImageShape)])

        # resize image
        userDrawing = cv2.resize(userDrawing, userDrawingScale[::-1])

        # if image is too large, it is cropped
        hx, hy = max(userDrawingScale[0] - 4096, 0), max(userDrawingScale[1] - 4096, 0)
        userDrawing = userDrawing[hx//2:hx//2+4096, hy//2:hy//2+4096]

        return userDrawing

    def DrawingDistance(self, param):
        """
        :param param: byte-data; parameters coming from the server the server
        :return: byte-data; matched drawing and score
        if the user drawing is bigger than 4096 after matching it to the reference image (for extreme proportions), it gets
        cropped to retain performance
        TODO: COULD PRODUCE INCONSISTENT RESULTS IF CANVAS IS MUCH LARGER THAN REFERENCE
        """

        # load user drawing and get corresponding reference
        userDrawing = imread(BytesIO(b64decode(param["dataURL"])))
        # reference image should be around (800, 600) in size. For different sizes, scores has to be adjusted
        mainImg = self.image_dict[param["model"]]
        refImageShape = mainImg.shape[:2]
        canvasShape = userDrawing.shape[:2]

        # reference image should be around (800, 600) in size. For different sizes, scores has to be adjusted
        mainImg = self.image_dict[param["model"]]
        refImageShape = mainImg.shape[:2]
        canvasShape = userDrawing.shape[:2]

        # if images are not grayscale, convert them
        if len(mainImg.shape) == 3: mainImg = cv2.cvtColor(mainImg, cv2.COLOR_BGR2GRAY)
        if len(userDrawing.shape) == 3: userDrawing = cv2.cvtColor(userDrawing, cv2.COLOR_BGR2GRAY)

        # match image sizes by padding and rescaling
        userDrawing = self.matchUserDrawingSize(userDrawing, refImageShape)
        userDrawingScale = userDrawing.shape[:2]
        mainImg = self.padReferenceImage(mainImg, userDrawingScale)

        # get aligned drawing
        alignedDrawing = alignImages(userDrawing, mainImg)

        score = compute_distance_score(alignedDrawing, mainImg)
        alignedDrawing = Image.fromarray(cv2.resize(alignedDrawing, canvasShape[::-1]))
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
