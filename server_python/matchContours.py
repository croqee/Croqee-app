import cv2
import numpy as np
from matplotlib import pyplot as plt

# img1 = cv2.imread('input_images/box/shapes_1_e.png',0)
# img2 = cv2.imread('input_images/box/box_1_201.jpg',0)
# img1 =  cv2.bitwise_not(img1)
# img2 =  cv2.bitwise_not(img2)


def matchContours(im1, im2):
    im1 =  cv2.bitwise_not(im1)
    im2 =  cv2.bitwise_not(im2)
    # im1 = cv2.cvtColor(im1,cv2.COLOR_BGR2GRAY)
    # im2 = cv2.cvtColor(im2,cv2.COLOR_BGR2GRAY)
    # def getBordered(image, width):
    #     bg = np.zeros(image.shape)
    #     _, contours, _ = cv2.findContours(image.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    #     biggest = 0
    #     bigcontour = None
    #     for contour in contours:
    #         area = cv2.contourArea(contour) 
    #         if area > biggest:
    #             biggest = area
    #             bigcontour = contour
    #     return cv2.drawContours(bg, [bigcontour], 0, (255, 255, 255), width).astype(np.uint8)

    # im1 = cv2.Canny(im1 ,60,120)
    # im2 = cv2.Canny(im2 ,60,120)

    # img1 = getBordered(im1, 3)
    # img2 = getBordered(im2, 3)
    img1 = im1
    img2 = im2

    # plt.subplot(121),plt.imshow(img2)
    # plt.title('Orignial image'), plt.xticks([]), plt.yticks([])
    # plt.subplot(122),
    # plt.title(' drawing'), plt.xticks([]), plt.yticks([])
    # plt.imshow(img1),plt.show()

    # ret, thresh = cv2.threshold(img1, 127, 255,0)
    # ret, thresh2 = cv2.threshold(img2, 127, 255,0)
    # _,contours,hierarchy = cv2.findContours(thresh,2,1)
    # cnt1 = contours[0]
    # _,contours,hierarchy = cv2.findContours(thresh2,2,1)
    # cnt2 = contours[0]
    ret = cv2.matchShapes(img1,img2,1,0.0)
    return round(ret,6)