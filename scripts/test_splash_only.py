import os
from PIL import Image, ImageDraw

def isolate_splash():
    end_path = "public/coffee/end_keyed.png"
    if not os.path.exists(end_path):
        print("end_keyed.png not found!")
        return
        
    end = Image.open(end_path).convert("RGBA")
    
    # We will create a mask to clear the lid and the cup body.
    mask = Image.new("L", end.size, 255)
    draw = ImageDraw.Draw(mask)
    
    # Lid polygon (wider to ensure complete coverage)
    lid_poly = [
        (260, 150),
        (580, 250),
        (540, 430),
        (260, 330)
    ]
    draw.polygon(lid_poly, fill=0)
    
    # Cup body polygon (covers everything below the splash)
    # The rim is roughly at (370, 560) to (650, 440).
    # We clear everything below this line.
    cup_body_poly = [
        (350, 560),
        (660, 440),
        (1024, 440),
        (1024, 1024),
        (0, 1024),
        (0, 560)
    ]
    draw.polygon(cup_body_poly, fill=0)
    
    # Clear background brown cup area just in case (X > 640)
    draw.rectangle([640, 0, 1024, 1024], fill=0)
    
    # Apply mask to alpha channel
    r, g, b, a = end.split()
    new_a = Image.new("L", end.size)
    new_a.paste(a, mask=mask)
    
    splash_only = Image.merge("RGBA", (r, g, b, new_a))
    splash_only.save("public/coffee/splash_only.png")
    print("Saved isolated splash to public/coffee/splash_only.png")

if __name__ == "__main__":
    isolate_splash()
