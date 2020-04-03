import cv2 as cv

def compute_distance_score(img1, img2):
    img1 = np.any(base_img>100, axis=2)
    img2 = img>100
    if not (np.any(np.logical_not(img1)) and np.any(np.logical_not(img2))):
        return 0

    dst1 = cv.distanceTransform(img1.astype(np.uint8), cv.DIST_L2, 3)
    dst2 = cv.distanceTransform(img2.astype(np.uint8), cv.DIST_L2, 3)

    mean_distance1 = np.sum(dst1 * np.logical_not(img2))/np.sum(np.logical_not(img2))
    mean_distance2 = np.sum(dst2 * np.logical_not(img1))/np.sum(np.logical_not(img1))

    summed_distance = mean_distance1 + mean_distance2

    min_dist, max_dist = 5, 40

    clipped_distance = np.clip(summed_distance, min_dist, max_dist)

    score = (clipped_distance - min_dist) / (max_dist - min_dist)
    score = (1 - score) * 100

    return int(score)
