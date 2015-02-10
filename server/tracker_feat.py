import cv2
import numpy as np

cap = cv2.VideoCapture(0)

# Initiate SIFT detector
orb = cv2.ORB()

img1 = cv2.imread('images/which.jpeg', 0) 

while(1):
    
    _, frame = cap.read()
    
    img2 = frame
    
    # find the keypoints and descriptors with SIFT
    kp1, des1 = orb.detectAndCompute(img1,None)
    kp2, des2 = orb.detectAndCompute(img2,None)
    
    # create BFMatcher object
    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

    # Match descriptors.
    matches = bf.match(des1,des2)

    # Sort them in the order of their distance.
    matches = sorted(matches, key = lambda x:x.distance)

    # Draw first 10 matches.
    img3 = cv2.drawMatches(img1,kp1,img2,kp2,matches[:10], flags=2)



    #cv2.imshow('mask',mask)
    cv2.imshow('frame',img3)
    #cv2.imshow('res',res)
    k = cv2.waitKey(5) & 0xFF
    if k == 27:
        break

cv2.destroyAllWindows()

