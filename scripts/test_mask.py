import os
from PIL import Image, ImageDraw
import numpy as np

def test_mask():
    start_path = r"C:\Users\VARUN-LAP\.gemini\antigravity-ide\brain\7f46d1ea-832d-4219-a310-5b71b6c6f667\frame_start_1781273228722.png"
    if not os.path.exists(start_path):
        print("Start image not found!")
        return
        
    img = Image.open(start_path).convert("RGBA")
    
    # Let's define a polygon for the cream cup in frame_start.
    # The cup body (excluding the black lid)
    # Let's guess some coordinates:
    # Top-left of cup body (below lid): (475, 455)
    # Top-right of cup body (below lid): (690, 395)
    # Bottom-right: (740, 710)
    # Bottom-left: (600, 765)
    cup_poly = [
        (478, 455),
        (692, 398),
        (742, 706),
        (600, 763)
    ]
    
    # Black lid in frame_start:
    # Sits on the cup
    # Top-left of lid: (450, 440)
    # Top-right of lid: (660, 380)
    # Bottom-right of lid: (690, 410)
    # Bottom-left of lid: (478, 465)
    # It is tilted. Let's make it a polygon
    lid_poly = [
        (450, 440),
        (665, 375),
        (695, 410),
        (480, 475),
        (460, 470)
    ]
    
    # Draw them on a mask
    mask = Image.new("L", img.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.polygon(cup_poly, fill=255)
    draw.polygon(lid_poly, fill=255)
    
    # Save masked cream cup
    cream_cup = Image.new("RGBA", img.size)
    cream_cup.paste(img, mask=mask)
    
    cream_cup.save("public/coffee/cream_cup_test.png")
    print("Saved test masked cream cup to public/coffee/cream_cup_test.png")

if __name__ == "__main__":
    test_mask()
