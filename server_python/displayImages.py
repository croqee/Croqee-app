from matplotlib import pyplot as plt

def displayImages(img1, img2, title1 ="image1", title2="image2") :

        plt.subplot(121),plt.imshow(img1,cmap = 'gray')
        plt.title(title1), plt.xticks([]), plt.yticks([])
        plt.subplot(122),plt.imshow(img2,cmap = 'gray')
        plt.title(title2), plt.xticks([]), plt.yticks([])
        plt.imshow(img2),plt.show()

