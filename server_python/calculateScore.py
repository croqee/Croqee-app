import cv2
import numpy as np

def compute_distance_score(img, base_img, min_dist=4, max_dist=15, closeness_threshold=15):
    """
    :param img: np.ndarray(n, m) of uint8; grayscale of aligned image to compute score of
    :param base_img: np.ndarray(n, m) of uint8; grayscale of reference image to compare against
    :param min_dist: int; minimum value of average pixel distance for best score
    :param max_dist: int; maximum value of average pixel distance for worst score
    :param closeness_threshold: int; how close a drawn line has to be a reference line for it to be counted as a 'hit'
    :return: int; score given to the drawing

    EXPLANATION OF THE SCORING SYSTEM:
    first we look at how close the drawn lines are to the reference image lines. i.e. for each drawn pixel we get
    the distance to the nearest reference line. Then we get the mean over these squared distances. Taking the square
    instead of the absolute distance gives us a larger penalty on lines drawn far away and less penaly on little
    variations around the reference lines.
    If we would look at this mean squared distance along, one could just make a small dot on a reference line and
    the mean distance would be very small, so wel also have to make sure, that the drawing 'hits' everything in the
    reference image:
    for this, we compute the portion of lines in the reference image, for which a drawn line is close enough,
    specified by the closenes_theshold. The end score is then multiplied by this fraction, i.e. If a user draws only
    half of the image perfectly, the score will be 50.
    in the end the mean squared distance is seen somewhere between the square of min_dist and max_dist to give a score
    and the end is multiplied with the closeness portion.
    """

    # make binary images from grayscale images
    img1 = base_img>100
    img2 = img>100
    if not (np.any(np.logical_not(img1)) and np.any(np.logical_not(img2))):
        return 0

    # get distance transforms, distance from the lines in the base image is capped at max_dist
    dst1 = cv2.distanceTransform(img1.astype(np.uint8), cv2.DIST_L2, 3)
    dst1 = np.minimum(dst1, 2 * max_dist)
    dst2 = cv2.distanceTransform(img2.astype(np.uint8), cv2.DIST_L2, 3)

    # compute the mean square distances of drawn pixels to reference pixels
    mean_distance_img_to_template = np.sum(dst1 ** 2 * np.logical_not(img2)) / np.sum(np.logical_not(img2))

    # get fraction of reference lines within closeness_threshold distance of drawn lines
    # (how much reference line is approximately hit by something drawn by the user)
    close_portion = np.sum((dst2 < closeness_threshold) * np.logical_not(img1)) / np.sum(np.logical_not(img1))

    # clip mean squared distance of drawn pixels to reference pixels in range specified by min_dist and max_dist
    # to lay the values on a linear scale
    clipped_distance = np.clip(mean_distance_img_to_template, min_dist ** 2, max_dist ** 2)
    
    # project the mean squared distance on a linear scale and multiply by the 'close portion'
    score = (clipped_distance - min_dist ** 2) / (max_dist ** 2 - min_dist ** 2)
    score = (1 - score) * 100
    score *= close_portion
    
    return int(score)
