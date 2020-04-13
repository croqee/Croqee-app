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

def get_edge_magnitude(img, ksize=7):
    if len(img.shape) == 2: img = img[:, :, None]
    out_magnitude = np.zeros(img.shape[:2])
    for i in range(img.shape[2]):
        dx = cv.Sobel(img[:,:,i], cv.CV_64F, 1, 0, ksize=ksize)
        dy = cv.Sobel(img[:,:,i], cv.CV_64F, 0, 1, ksize=ksize)
        laplace = cv.Laplacian(img[:,:,i], cv.CV_64F, ksize=ksize)
        out_magnitude += np.abs(laplace) + np.sqrt(dx**2 + dy**2)
    out_magnitude = cv.GaussianBlur(out_magnitude, (ksize, ksize), sigmaX = ksize/2, sigmaY = ksize/2)
    out_magnitude /= max(np.sum(out_magnitude, 1))
    return out_magnitude


def get_line_maxima(edge_mag, ksize=5, offset=8):
    xx = np.zeros((ksize, 1), dtype=np.uint8)
    xx[0] = 1
    xx[-1] = 1
    yy = xx.T
    xy = np.zeros((ksize, ksize), dtype=np.uint8)
    xy[0,0] = 1
    xy[-1,-1] = 1
    yx = xy[::-1,:]
    
    xx_max = cv.dilate(edge_mag, xx, iterations=1)<=edge_mag-offset
    yy_max = cv.dilate(edge_mag, yy, iterations=1)<=edge_mag-offset
    xy_max = cv.dilate(edge_mag, xy, iterations=1)<=edge_mag-offset
    yx_max  = cv.dilate(edge_mag, yx, iterations=1)<=edge_mag-offset
    
    return np.any([xx_max, yy_max, xy_max, yx_max], axis=0)

def normalize_line_thickness(line_img, new_thickness=3):
	#little_kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE,(3, 3))
	filter_kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE,(new_thickness, new_thickness))
	#line_img = cv.dilate(line_img, little_kernel, iterations=1)
	thinned_image = cv.ximgproc.thinning(line_img)
	rethickened_image = cv.dilate(thinned_image, filter_kernel, iterations=1)
	return rethickened_image

def create_line_drawing2(base_img, thres1=7, line_thickness_normalization=True, new_line_thickness=3):
    edge_mag = get_edge_magnitude(base_img, ksize=3)
    edge_mag = (edge_mag*255/np.max(edge_mag)).astype(np.uint8)

    edge_norm = cv.GaussianBlur(edge_mag, (21, 21), sigmaX = 17, sigmaY = 17)

    tmp1 = get_line_maxima(edge_mag, ksize=5, offset=thres1)
    tmp1 *= (edge_mag > thres1)
    tmp1 = (tmp1 * 255).astype(np.uint8)

    if line_thickness_normalization:
    	tmp1 = normalize_line_thickness(tmp1, new_thickness=new_line_thickness)

    return (255 - tmp1)




import os
dir_path = os.path.dirname(os.path.abspath(__file__))
base_image_path = dir_path + '/ColorImages'
line_image_path = dir_path + '/LineImages'

image_names = [x for x in os.listdir(base_image_path) if x[-4:] == '.png']

for img_name in image_names:
    image_path = base_image_path + '/' + img_name
    im_ar = np.array(Image.open(image_path))

    line_image = create_line_drawing2(im_ar)

    Image.fromarray(line_image).save(line_image_path + '/' + img_name)
