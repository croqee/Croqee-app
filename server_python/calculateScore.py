import cv2 as cv
import numpy as np

def compute_distance_score(img, base_img, min_dist=4, max_dist=25, closeness_threshold=15):
    img1 = base_img>100
    img2 = img>100
    if not (np.any(np.logical_not(img1)) and np.any(np.logical_not(img2))):
        return 0

    dst1 = cv.distanceTransform(img1.astype(np.uint8), cv.DIST_L2, 3)
    dst2 = cv.distanceTransform(img2.astype(np.uint8), cv.DIST_L2, 3)

    mean_distance_img_to_template = np.sum(dst1 * np.logical_not(img2))/np.sum(np.logical_not(img2))
    
    close_portion = np.sum((dst2 < closeness_threshold) * np.logical_not(img1)) / np.sum(np.logical_not(img1))
    
    clipped_distance = np.clip(mean_distance_img_to_template, min_dist, max_dist)
    
    print(clipped_distance)
    score = (clipped_distance - min_dist) / (max_dist - min_dist)
    score = (1 - score) * 100
    score *= close_portion
    
    return int(score)
