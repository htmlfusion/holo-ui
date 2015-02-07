import cv2
import numpy as np

cap = cv2.VideoCapture(0)


while(1):

    # Take each frame
    _, frame = cap.read()

    # Convert BGR to HSV
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # define range of blue color in HSV
    lower_blue = np.array([20,10,0])
    upper_blue = np.array([60,200,200])

    # Threshold the HSV image to get only blue colors
    mask = cv2.inRange(hsv, lower_blue, upper_blue)

    kernel = np.ones((5,5),np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)


    # Bitwise-AND mask and original image
    # res = cv2.bitwise_and(frame,frame, mask= mask)
    contours, hierarchy = cv2.findContours(mask, cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)

    print(len(contours))
    if(len(contours)):
        bestContour=None
        maxArea=0
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if(area>maxArea):
                maxArea=area
                bestContour = cnt
                
        if(bestContour is not None):
            x,y,w,h = cv2.boundingRect(bestContour)
            cv2.rectangle(frame,(x,y),(x+w,y+h),(0,255,0),2)
            print('x: %s y: %s\nw: %s h:%s' % (x,y,w,h))
            cv2.drawContours(frame, [bestContour], 0, (0,255,0), 3)
    
    #cv2.drawContours(mask, contours, -1, (0,255,0), 3)

    cv2.imshow('mask',mask)
    cv2.imshow('frame',frame)
    #cv2.imshow('res',res)
    k = cv2.waitKey(5) & 0xFF
    if k == 27:
        break

cv2.destroyAllWindows()

