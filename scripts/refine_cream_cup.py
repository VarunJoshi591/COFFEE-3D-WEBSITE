import os
from PIL import Image, ImageDraw

def refine_cup():
    start_path = "public/coffee/start_keyed.png"
    if not os.path.exists(start_path):
        print("start_keyed.png not found!")
        return
        
    start = Image.open(start_path).convert("RGBA")
    
    # We will refine the polygon for the cream cup body.
    # Top-Left: (478, 455)
    # Top-Right: (692, 398)
    # Bottom-Right: (668, 715)
    # Bottom-Left: (598, 763)
    # Let's add a point along the right edge to match the sleeve contour: (682, 630)
    cup_poly = [
        (478, 455),
        (692, 398),
        (682, 630),
        (668, 715),
        (598, 763)
    ]
    
    mask = Image.new("L", start.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.polygon(cup_poly, fill=255)
    
    cream_cup_body = Image.new("RGBA", start.size)
    cream_cup_body.paste(start, mask=mask)
    cream_cup_body = cream_cup_body.crop((460, 390, 710, 780))
    cream_cup_body.save("public/coffee/crop_cream_cup_body.png")
    print("Saved refined cream cup body to public/coffee/crop_cream_cup_body.png")

if __name__ == "__main__":
    refine_cup()
