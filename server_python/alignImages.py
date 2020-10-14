from __future__ import print_function
import cv2 as cv
import numpy as np
import argparse
from numpy.core.umath_tests import inner1d
from matplotlib import pyplot as plt
from scipy.signal import fftconvolve
#from scaleInnerContents import scaleInnerContents
#from distanceMeasurment import HausdorffDist

### TODO crop images and perform convolution on cropped images for added speed and do loop around inside scale loop


def cropImage(img):
    """
    :param img: np.ndarray(n, m) of uint8; grayscale image to crop 0-part at the edges away
    :return: touple(int, int, np.ndarray(k, l)); touple containing the x and y crop start coordinates
        as well as the cropped image
    crops and image such that uninportant zero-valued parts are cropped away and returns the crop
    starting coordinates
    """
    # get which rows are white
    x_white = np.all(img==0, axis=1)
    # get their indices
    white_rows = np.logical_not(x_white).nonzero()[0]
    # take the first and the last of these indices to get the x bounding box
    a,b = white_rows[0], white_rows[-1]+1

    # get which columns are white
    y_white = np.all(img==0, axis=0)
    # get their indices
    white_columns = np.logical_not(y_white).nonzero()[0]
    # take the first and the last of these indices to get the y bounding box
    c,d = white_columns[0], white_columns[-1]+1

    # return cropping offset and cropped image
    return a, c, img[a:b, c:d]

def computeShiftDft(img1, img2):
    """
    :param img1: np.ndarray(n, m) of uint8; grayscale image to match to
    :param img2: np.ndarray(k, l) of uint8; grayscale image to get matched
    :return: touple(float, int, int); a touple containing the matching score
        as the convolution value and the computed shift to get that matching
    This function takes two images, crops away the 0-part of them, then computes
    their convolution with optimal padding using the DFT and returns the optimal sift
    """
    # crop white parts away which are not relevant and remember cropping offset
    img1_x_crop_offset, img1_y_crop_offset, img1 = cropImage(img1)
    img2_x_crop_offset, img2_y_crop_offset, img2 = cropImage(img2)

    a, b = img1.shape
    c, d = img2.shape
    #pad correctly and such that the resulting image sizes are divisible by 2 (for the DFT)
    img1 = np.pad(img1, ((0, c+(a+c)%2),(0, d+(b+d)%2)), mode='constant')
    img2 = np.pad(img2, ((0, a+(a+c)%2),(0, b+(b+d)%2)), mode='constant')
    #convolve using the fourier transform
    conv = np.fft.irfft2(np.fft.rfft2(img1)*np.conjugate(np.fft.rfft2(img2)))
    # compute the optimal shift indices and save convolution value for comparison
    sx, sy = np.unravel_index(np.argmax(conv), img1.shape[:2])
    conv_value = conv[sx, sy]
    # for negative shift, the shift value has to be 'looped around'
    if sx > a: sx -= a+c+(a+c)%2
    if sy > b: sy -= b+d+(b+d)%2
    # add the offset coming from cropping unimportant stuff
    sx += img1_x_crop_offset - img2_x_crop_offset
    sy += img1_y_crop_offset - img2_y_crop_offset

    return conv_value, sx, sy


def alignImages(img, target, rescale_factor=0.25, tightness=3, num_scales=16, min_scale=0.8, max_scale=1.6):
    """
    :param img: np.ndarray(n, m) of uint8; grayscale drawing image
    :param target: np.ndarray(k, l) of uint8; grayscale reference image
    :param rescale_factor: float; factor to resize the images before computation to save on speed
    :param tightness: positive number; the sigma of the blurring:
                      lower values (1-3) lead to lines being matched very exactly
                      higher values (5-10) lead to the image being matched more smoothly
    :param num_scales: int number of scale steps
                       higher values increase accuracy at the cost of computatinal time (N-fold)
    :param min_scale: float; minimum scale to be checked, should be smaller than one
    :param max_scale: float; maximum scale to be checked, should be bigger than one and smaller than 2, otherwise, there will be errors
    :return: np.ndarray(n, m) of uint8; matched drawing image
    """

    # #if nothing is in the image: just return it
    if np.all(img==0):
        return img

    # save the original image for later output
    orig_img = img
    userCanvasWidth, userCanvasHeight = img.shape

    # rescale images for computation with the given factor
    img = cv.resize(255 - img, tuple([int(x * rescale_factor) for x in img.shape[::-1]]))
    target = cv.resize(255 - target, tuple([int(x * rescale_factor) for x in target.shape[::-1]]))

    # smoothing target image
    target = cv.GaussianBlur(target, (4*tightness+1,4*tightness+1),tightness)

    similarities = []
    # looping through all scales between min_scale and max_scale
    for s in np.linspace(min_scale,max_scale,num_scales):
        # rescaling the image with that particular scale
        new_size = (int(img.shape[0] * s), int(img.shape[1] * s))
        img1 = cv.resize(img, new_size[::-1])
        # blurring this scaled image
        img1 = cv.GaussianBlur(img1, (4*tightness+1, 4*tightness+1), tightness)
        # norming image such that maximum maching determined by the convolution is comparable over scales
        img1_norm = np.linalg.norm(img1)
        if img1_norm == 0: continue
        # get the shift from computeshiftdft
        conv_value, sx, sy = computeShiftDft(target, img1)
        # saving matching score, scale and shift
        similarities.append((conv_value / img1_norm, s, (sx, sy)))

    # select the scaling and shift with maximum matching score
    s, shift = max(similarities, key=lambda x:x[0])[1:]
    sx, sy = shift
    # scale the shift back to be used for the original iamge
    sx, sy = sx / rescale_factor, sy / rescale_factor
    # apply the transformation to the original image with compensation for the scaling in the shift value
    M = np.float32([[s, 0, sy],
                    [0, s, sx]])

    out = cv.warpAffine(orig_img, M, orig_img.shape[::-1], borderValue=255)
    return out
