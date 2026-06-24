import os
from PIL import Image
import numpy as np

def clean_splash_color():
    end_path = "public/coffee/end_keyed.png"
    if not os.path.exists(end_path):
        print("end_keyed.png not found!")
        return
        
    end = Image.open(end_path).convert("RGBA")
    arr = np.array(end)
    
    # Bounding box of the lid: Y: [190, 420], X: [280, 580]
    # We want to clear pixels in this box that are dark (the black lid)
    # The splash has color like [180, 110, 60] (light brown).
    # The lid has color like [30, 30, 30] (dark gray/black).
    
    box_y1, box_y2 = 190, 420
    box_x1, box_x2 = 280, 580
    
    for y in range(box_y1, box_y2):
        for x in range(box_x1, box_x2):
            r, g, b, a = arr[y, x]
            # If the pixel is part of the lid:
            # - Very dark pixels (lid shadow/core)
            # - Gray/white pixels (lid highlights): they have low color saturation (r, g, b are close)
            # - And not orange/caramel (where r > g + 15 and g > b + 15)
            is_caramel = (r > g + 10) and (g > b + 10) and (r > 80)
            if not is_caramel:
                # If it's dark or if it's gray-ish (low saturation)
                is_dark = (r < 80 and g < 80 and b < 80)
                is_gray = (abs(int(r) - int(g)) < 18 and abs(int(g) - int(b)) < 18 and abs(int(r) - int(b)) < 18)
                if is_dark or is_gray:
                    arr[y, x, 3] = 0 # transparent
                    
    cleaned = Image.fromarray(arr)
    
    # Now clear the cup body as well (which is at the bottom)
    # The cup body is light beige, but we can just use a simple polygon to clear it,
    # since it does not overlap with the splash in a way that causes issues.
    # The cup body is below Y = 460 in the end image.
    # Let's clear everything below the splash.
    # The rim is roughly at (370, 560) to (650, 440).
    # Let's write a loop to clear pixels below the rim line:
    # y = m * x + c
    # x1, y1 = 360, 565
    # x2, y2 = 645, 435
    # m = (435 - 565) / (645 - 360) = -130 / 285 = -0.456
    # c = 565 - m * 360 = 565 + 0.456 * 360 = 729
    # So for any x, if y > -0.456 * x + 729 + 10 (offset), we clear it!
    
    for y in range(end.size[1]):
        for x in range(end.size[0]):
            # Clear background brown cup (right side)
            if x > 640:
                arr[y, x, 3] = 0
            # Clear cup body below the rim line
            elif x >= 350 and x <= 660:
                rim_y = -0.456 * x + 735
                if y > rim_y:
                    arr[y, x, 3] = 0
            elif x < 350:
                # Clear left cup body if any
                if y > 540:
                    arr[y, x, 3] = 0
                    
    cleaned_splash = Image.fromarray(arr)
    splash_cropped = cleaned_splash.crop((220, 200, 660, 570))
    splash_cropped.save("public/coffee/splash_only_color.png")
    print("Saved color-cleaned splash to public/coffee/splash_only_color.png")

if __name__ == "__main__":
    clean_splash_color()
