import os
from PIL import Image, ImageDraw
import numpy as np

def crop_elements():
    start_path = "public/coffee/start_keyed.png"
    # We will generate end_keyed.png first
    end_raw_path = r"C:\Users\VARUN-LAP\.gemini\antigravity-ide\brain\7f46d1ea-832d-4219-a310-5b71b6c6f667\frame_end_1781273245528.png"
    bg_path = "public/coffee/generated_bg.png"
    
    # Delta key the end frame to make end_keyed.png
    from crop_assets import delta_key
    delta_key(end_raw_path, bg_path, "public/coffee/end_keyed.png", threshold=35, feather=8)
    
    start = Image.open(start_path)
    end = Image.open("public/coffee/end_keyed.png")
    
    # Crop Brown Cup (from end to avoid cream cup overlap)
    # We can keep it simple: crop box and place on background
    brown_cup = end.crop((650, 200, 960, 660))
    brown_cup.save("public/coffee/crop_brown_cup.png")
    
    # Crop Cream Cup Body (from start, using polygon mask to exclude lid)
    # We want a mask just for the cup body
    mask = Image.new("L", start.size, 0)
    draw = ImageDraw.Draw(mask)
    # Define polygon enclosing the cream cup body (excluding the black lid)
    # Top edge of cup body: (480, 455) to (692, 398)
    # Right edge: to (742, 706)
    # Bottom: to (600, 763)
    # Left: to (480, 455)
    cup_poly = [
        (478, 455),
        (692, 398),
        (742, 706),
        (600, 763)
    ]
    draw.polygon(cup_poly, fill=255)
    cream_cup_body = Image.new("RGBA", start.size)
    cream_cup_body.paste(start, mask=mask)
    cream_cup_body = cream_cup_body.crop((460, 390, 760, 780))
    cream_cup_body.save("public/coffee/crop_cream_cup_body.png")
    
    # Crop Black Lid (from start, using polygon mask)
    mask_lid = Image.new("L", start.size, 0)
    draw_lid = ImageDraw.Draw(mask_lid)
    lid_poly = [
        (450, 435),
        (665, 370),
        (695, 405),
        (480, 470),
        (460, 465)
    ]
    draw_lid.polygon(lid_poly, fill=255)
    lid = Image.new("RGBA", start.size)
    lid.paste(start, mask=mask_lid)
    lid = lid.crop((440, 360, 710, 480))
    lid.save("public/coffee/crop_lid.png")
    
    # Crop Coffee Splash (from end)
    # The splash is in the region X: [220, 660], Y: [200, 565]
    # We want to exclude the lid and the cream cup body in the end image if possible,
    # or just crop the splash itself.
    # In the end image, the splash is erupting. Let's see if we can crop the splash.
    # The splash is roughly bounded by X: [220, 660], Y: [200, 565].
    # Let's crop it and save it.
    splash = end.crop((220, 200, 660, 570))
    splash.save("public/coffee/crop_splash.png")
    
    print("Cropped assets saved successfully!")

if __name__ == "__main__":
    crop_elements()
