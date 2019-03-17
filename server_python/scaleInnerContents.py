import cv2 as cv

def scaleInnerContents(img, scale):
    fixedHeight, fixedWidth = img.shape
    newWidth  = int(fixedWidth*scale)
    newHeight = int(fixedHeight*scale)
    img= cv.resize(img,(newWidth,newHeight))
    cropped = img[(newHeight - fixedHeight)/2 : newHeight - (newHeight - fixedHeight)/2 , (newWidth - fixedWidth)/2 : newWidth - (newWidth - fixedWidth)/2 ]
    return cropped