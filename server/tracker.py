import cv2
import numpy as np

cap = cv2.VideoCapture(0)


hsv = None

lower = None
upper = None
# mouse callback function
def sample_color(event, x,y, flags, param):
    global lower
    global upper
    if event == 1:
        
        if hsv is not None:
            
            val = hsv[y,x]
            print(lower)
            if lower is not None:
                lower = np.minimum(lower, val) 
            else:
                lower = val

            if upper is not None:
                upper = np.maximum(upper, val)
            else:
                upper = val

        print('color')
        print(upper)
        print(lower)

cv2.namedWindow('frame')
cv2.setMouseCallback('frame', sample_color)

lower = None
upper = None



while(1):
    # Take each frame
    _, frame = cap.read()

    # Convert BGR to HSV
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # define range of blue color in HSV
    
    # green/red
    # lower = np.array([56, 73, 50])
    # upper = np.array([88, 255, 136])

    # blue/orange
    lower = np.array([107, 91, 142])
    upper = np.array([112, 255, 255])
    
    if upper is not None and lower is not None:
        # Threshold the HSV image to get only blue colors
        mask = cv2.inRange(hsv, lower, upper)

        kernel = np.ones((5,5),np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)


        # Bitwise-AND mask and original image
        # res = cv2.bitwise_and(frame,frame, mask= mask)
        contours, hierarchy = cv2.findContours(mask, cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)

        
        areas = []
        
        if(len(contours)):
            
            for cnt in contours:
                areas.append(cv2.contourArea(cnt))
                    
            print areas
            
            if(len(areas)>1):
                bestMatch = np.argmax(np.array(areas))
                
                largeA = contours[bestMatch]
                contours.pop(bestMatch);
                areas.pop(bestMatch);
                
                bestMatch = np.argmax(np.array(areas))
                largeB = contours[bestMatch]
                
                
                x1, y1, w1, h1 = cv2.boundingRect(largeA)
                cv2.rectangle(frame,(x1,y1),(x1+w1,y1+h1),(0,255,0),2)
                #print('x: %s y: %s\nw: %s h:%s' % (x,y,w,h))
                cv2.drawContours(frame, [largeA], 0, (0,255,0), 3)
                
                x2, y2, w2, h2 = cv2.boundingRect(largeB)
                cv2.rectangle(frame,(x2,y2),(x2+w2,y2+h2),(255,0,0),2)
                #print('x: %s y: %s\nw: %s h:%s' % (x,y,w,h))
                cv2.drawContours(frame, [largeB], 0, (255,0,0), 3)
                
                centerX = x1+x2/2.0
                centerY = y1+y2/2.0
                
                if(x1>x2):
                    width = x1-x2
                else:
                    width = x2-x1
                    
                print('x: %s y: %s\nw: %s' % (centerX,centerY,width))
                
        
    #cv2.drawContours(mask, contours, -1, (0,255,0), 3)

    #cv2.imshow('mask',mask)
    cv2.imshow('frame',frame)
    #cv2.imshow('res',res)
    k = cv2.waitKey(5) & 0xFF
    if k == 27:
        break

cv2.destroyAllWindows()

