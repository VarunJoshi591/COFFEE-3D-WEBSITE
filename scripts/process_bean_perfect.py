import os
from PIL import Image, ImageFilter
import numpy as np

def make_bean_transparent():
    bean_path = "public/coffee/bean.png"
    if not os.path.exists(bean_path):
        print("bean.png not found!")
        return
        
    img = Image.open(bean_path).convert("RGB")
    w, h = img.size
    
    # 1. Downscale to 256x256 for fast and smooth flood fill
    scale_w, scale_h = 256, 256
    img_small = img.resize((scale_w, scale_h), Image.Resampling.LANCZOS)
    arr_small = np.array(img_small)
    
    # Create threshold mask: pixels with max(R,G,B) < 10 are background candidates
    bg_candidates = np.max(arr_small, axis=2) < 10
    
    # 2. BFS Flood Fill starting from the four corners
    bg_mask = np.zeros((scale_h, scale_w), dtype=bool)
    queue = []
    
    # Push 4 corners
    corners = [(0,0), (0, scale_w-1), (scale_h-1, 0), (scale_h-1, scale_w-1)]
    for cy, cx in corners:
        if bg_candidates[cy, cx]:
            queue.append((cy, cx))
            bg_mask[cy, cx] = True
            
    # Also push some pixels along the borders
    for x in range(scale_w):
        for y in [0, scale_h-1]:
            if bg_candidates[y, x] and not bg_mask[y, x]:
                queue.append((y, x))
                bg_mask[y, x] = True
    for y in range(scale_h):
        for x in [0, scale_w-1]:
            if bg_candidates[y, x] and not bg_mask[y, x]:
                queue.append((y, x))
                bg_mask[y, x] = True
                
    head = 0
    while head < len(queue):
        y, x = queue[head]
        head += 1
        
        # Check 4 neighbors
        for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
            ny, nx = y + dy, x + dx
            if 0 <= ny < scale_h and 0 <= nx < scale_w:
                if bg_candidates[ny, nx] and not bg_mask[ny, nx]:
                    bg_mask[ny, nx] = True
                    queue.append((ny, nx))
                    
    # Now, bg_mask is True for background pixels, False for the bean.
    # We want the alpha channel to be 0 for background, 255 for bean.
    alpha_small = np.where(bg_mask, 0, 255).astype(np.uint8)
    alpha_small_img = Image.fromarray(alpha_small, mode="L")
    
    # 3. Upscale the mask to 1024x1024 with bilinear filtering for soft edges
    alpha_large_img = alpha_small_img.resize((w, h), Image.Resampling.BILINEAR)
    
    # Apply a very slight Gaussian Blur to smooth the edges further
    alpha_large_img = alpha_large_img.filter(ImageFilter.GaussianBlur(1.0))
    
    # 4. Apply mask to the original image
    rgba_img = img.copy().convert("RGBA")
    rgba_img.putalpha(alpha_large_img)
    
    # 5. Clean up any remaining background speckles outside the bean's shape
    # Using an elliptical boundary centered at (512, 512)
    # The bean spans roughly X: [150, 874] and Y: [50, 974]
    arr_rgba = np.array(rgba_img)
    y_indices, x_indices = np.meshgrid(np.arange(h), np.arange(w), indexing='ij')
    
    # Ellipse equation: ((x - cx)/rx)^2 + ((y - cy)/ry)^2 <= 1
    # Center = (512, 512), rx = 375, ry = 470
    cx, cy = 512, 512
    rx, ry = 375, 470
    
    ellipse_mask = ((x_indices - cx) / rx) ** 2 + ((y_indices - cy) / ry) ** 2 > 1.05
    # Set alpha of pixels outside the ellipse to 0
    arr_rgba[ellipse_mask, 3] = 0
    
    final_img = Image.fromarray(arr_rgba)
    final_img.save("public/coffee/bean.png", "PNG")
    print("Processed bean.png with perfect transparency!")

if __name__ == "__main__":
    make_bean_transparent()
