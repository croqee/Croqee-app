from __future__ import print_function
import cv2 as cv
import numpy as np
import argparse
from numpy.core.umath_tests import inner1d
from matplotlib import pyplot as plt
#from scaleInnerContents import scaleInnerContents
#from distanceMeasurment import HausdorffDist

def alignImages(img, target, rescale_size, tightness=3, num_scales=16, min_scale=0.8, max_scale=1.6):
    """
    :param img: np.ndarray(n, m) of uint8; grayscale drawing image
    :param target: np.ndarray(n, m) of uint8; grayscale reference image
    :param rescale_size: touple(k, l) of int; size to rescale the images to before computation, should be divisible by 2
    :param tightness: positive number; the sigma of the blurring:
                      lower values (1-3) lead to lines being matched very exactly
                      higher values (5-10) lead to the image being matched more smoothly
    :param num_scales: int number of scale steps
                       higher values increase accuracy at the cost of computatinal time (N-fold)
    :param min_scale: float; minimum scale to be checked
    :param max_scale: float; maximum scale to be checked
    :return: np.ndarray(n, m) of uint8; matched drawing image
    """

    # #if nothing is in the image: just return it
    if np.all(img==0):
        return img

    # save the original image for later output
    orig_img = img
    userCanvasWidth, userCanvasHeight = img.shape

    # rescale images for computation with the given size
    img = cv.resize(img, rescale_size[::-1])
    target = cv.resize(target, rescale_size[::-1])

    # pad images with zeros half the shape on each side to prevent 'over the edge'-fitting and cropping after rescaling
    n,m = rescale_size[0] // 2, rescale_size[1] // 2
    pad_shape = ((n,n),(m,m))
    rescale_factor_x = userCanvasWidth / rescale_size[0]
    rescale_factor_y = userCanvasHeight / rescale_size[1]
    img = np.pad(255-img, pad_shape, mode='constant').astype(np.float32)
    target = np.pad(255-target, pad_shape, mode='constant').astype(np.float32)

    # smoothing target image
    target = cv.GaussianBlur(target, (4*tightness+1,4*tightness+1),tightness)

    similarities = []
    # looping through all scales between min_scale and max_scale
    for s in np.linspace(min_scale,max_scale,num_scales):
        # rescaling the image with that particular scale
        M = np.float32([[s, 0, 0],[0, s, 0]])
        img1 = cv.warpAffine(img,M,img.shape[::-1])
        # blurring this scaled image
        img1 = cv.GaussianBlur(img1, (4*tightness+1,4*tightness+1),tightness)
        # norming image such that maximum maching determined by the convolution is comparable over scales
        img1 /= np.linalg.norm(img1)
        # computing the convolution using the fourier transform for speed
        conv = np.fft.irfft2(np.fft.rfft2(img1)*np.conjugate(np.fft.rfft2(target)))
        # get the shift by the maximum value of the convolution
        sx, sy = np.unravel_index(np.argmax(conv), img1.shape[:2])
        # saving matching score, scale and shift
        similarities.append((conv[sx, sy], s, (sx, sy)))

    # select the scaling and shift with maximum matching score
    s, shift = max(similarities, key=lambda x:x[0])[1:]
    sx, sy = shift
    # scale the shift back to be used for the original iamge
    sx, sy = sx*rescale_factor_x, sy*rescale_factor_y
    # for negative shift, the shift value has to be 'looped around'
    if sx > userCanvasHeight: sx -= (userCanvasWidth * 2)
    if sy > userCanvasWidth: sy -= (userCanvasHeight * 2)
    # apply the transformation to the original image with compensation for the scaling in the shift value
    M = np.float32([[s, 0, -sy + (userCanvasHeight/2) * (s-1)],
                    [0, s, -sx + (userCanvasWidth/2) * (s-1)]])
    out = cv.warpAffine(orig_img, M, orig_img.shape[::-1], borderValue=255)
    return out
