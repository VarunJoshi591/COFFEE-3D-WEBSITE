import os
from PIL import Image, ImageDraw

def clean_splash():
    end_path = "public/coffee/end_keyed.png"
    if not os.path.exists(end_path):
        print("end_keyed.png not found!")
        return
        
    end = Image.open(end_path).convert("RGBA")
    
    # We want to remove the black lid from the end image.
    # The lid is located at roughly:
    # Top-left: (300, 190)
    # Top-right: (560, 280)
    # Bottom-right: (520, 400)
    # Bottom-left: (300, 320)
    lid_poly = [
        (300, 190),
        (560, 280),
        (525, 405),
        (300, 320)
    ]
    
    # Create a mask where the lid is 0 and everything else is 255
    mask = Image.new("L", end.size, 255)
    draw = ImageDraw.Draw(mask)
    draw.polygon(lid_poly, fill=0)
    
    # Apply mask to alpha channel of end image
    r, g, b, a = end.split()
    new_a = Image.new("L", end.size)
    new_a.paste(a, mask=mask)
    
    cleaned_end = Image.merge("RGBA", (r, g, b, new_a))
    
    # Crop the splash area
    splash = cleaned_end.crop((220, 200, 660, 570))
    splash.save("public/coffee/crop_splash_clean.png")
    print("Saved clean splash to public/coffee/crop_splash_clean.png")

if __name__ == "__main__":
    clean_splash()
