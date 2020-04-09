import numpy as np
import matplotlib.pyplot as plt
import cv2 as cv
from PIL import Image


def create_line_drawing(base_img):
    assert type(base_img) == np.ndarray and len(base_img.shape) == 3#
    sigma = 1.5
    edge_list = []
    for i in range(3):
        img = base_img[..., i]
        edge_list.append(cv.Canny(img.astype(np.uint8), 20, 100))

    edges = np.logical_not(np.any(np.array(edge_list) > 0, axis=0))
    edges = edges.astype(np.uint8) * 255
    return edges


import os
dir_path = os.path.dirname(os.path.abspath(__file__))
base_image_path = dir_path + '/ColorImages'
line_image_path = dir_path + '/LineImages'

image_names = [x for x in os.listdir(base_image_path) if x[-4:] == '.png']

for img_name in image_names:
    image_path = base_image_path + '/' + img_name
    im_ar = np.array(Image.open(image_path))

    line_image = create_line_drawing(im_ar)

    Image.fromarray(line_image).save(line_image_path + '/' + img_name)
