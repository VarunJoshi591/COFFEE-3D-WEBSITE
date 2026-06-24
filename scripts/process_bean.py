import os
from PIL import Image

def make_transparent(img_path, output_path, tolerance=30):
    if not os.path.exists(img_path):
        print(f"Error: {img_path} does not exist.")
        return False
    
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()
    
    # Let's assume the background color is the color of the corner pixel (0, 0)
    bg_color = data[0]
    print(f"Detected background color (at 0,0): {bg_color[:3]}")
    
    new_data = []
    for item in data:
        # Calculate Euclidean distance in RGB space
        r_diff = abs(item[0] - bg_color[0])
        g_diff = abs(item[1] - bg_color[1])
        b_diff = abs(item[2] - bg_color[2])
        
        # If the pixel is very close to the background color, make it transparent
        if r_diff <= tolerance and g_diff <= tolerance and b_diff <= tolerance:
            new_data.append((0, 0, 0, 0)) # transparent black
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Saved transparent image to: {output_path}")
    return True

if __name__ == "__main__":
    bean_path = os.path.join("public", "coffee", "bean.png")
    make_transparent(bean_path, bean_path, tolerance=35)
