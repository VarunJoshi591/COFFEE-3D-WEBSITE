import os
from PIL import Image
import numpy as np

def clean_brown_cup():
    brown_path = "public/coffee/crop_brown_cup.png"
    if not os.path.exists(brown_path):
        print("crop_brown_cup.png not found!")
        return
        
    img = Image.open(brown_path).convert("RGBA")
    arr = np.array(img)
    
    # The crop box was (650, 200, 960, 660)
    # So X_global = x_local + 650
    # Y_global = y_local + 200
    
    # We want to clear pixels where X_global < 0.077 * (Y_global - 400) + 690
    # Let's check this line.
    for y_local in range(img.size[1]):
        y_global = y_local + 200
        # Cut-off line: X_global = 690 at Y=400, X_global = 710 at Y=660
        # Slope: (710 - 690) / (660 - 400) = 20 / 260 = 0.077
        cut_off_x_global = 690 + 0.077 * (y_global - 400)
        cut_off_x_local = cut_off_x_global - 650
        
        for x_local in range(img.size[0]):
            if x_local < cut_off_x_local:
                arr[y_local, x_local, 3] = 0 # transparent
                
    cleaned = Image.fromarray(arr)
    cleaned.save("public/coffee/crop_brown_cup.png")
    print("Cleaned crop_brown_cup.png successfully!")

if __name__ == "__main__":
    clean_brown_cup()
