import os
from PIL import Image, ImageFilter
import numpy as np

def remove_background():
    bean_path = os.path.join("public", "coffee", "bean.png")
    if not os.path.exists(bean_path):
        print("bean.png not found!")
        return False
        
    img = Image.open(bean_path).convert("RGB")
    w, h = img.size
    
    # Downscale for fast and smooth flood fill
    scale_w, scale_h = 256, 256
    img_small = img.resize((scale_w, scale_h), Image.Resampling.LANCZOS)
    arr_small = np.array(img_small)
    
    # Pure black threshold
    bg_candidates = np.max(arr_small, axis=2) < 10
    
    # BFS Flood Fill from corners
    bg_mask = np.zeros((scale_h, scale_w), dtype=bool)
    queue = []
    
    corners = [(0,0), (0, scale_w-1), (scale_h-1, 0), (scale_h-1, scale_w-1)]
    for cy, cx in corners:
        if bg_candidates[cy, cx]:
            queue.append((cy, cx))
            bg_mask[cy, cx] = True
            
    # Push borders
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
        for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
            ny, nx = y + dy, x + dx
            if 0 <= ny < scale_h and 0 <= nx < scale_w:
                if bg_candidates[ny, nx] and not bg_mask[ny, nx]:
                    bg_mask[ny, nx] = True
                    queue.append((ny, nx))
                    
    alpha_small = np.where(bg_mask, 0, 255).astype(np.uint8)
    alpha_small_img = Image.fromarray(alpha_small, mode="L")
    alpha_large_img = alpha_small_img.resize((w, h), Image.Resampling.BILINEAR)
    alpha_large_img = alpha_large_img.filter(ImageFilter.GaussianBlur(1.0))
    
    rgba_img = img.copy().convert("RGBA")
    rgba_img.putalpha(alpha_large_img)
    
    # Clean up outer speckles with an ellipse mask
    arr_rgba = np.array(rgba_img)
    y_indices, x_indices = np.meshgrid(np.arange(h), np.arange(w), indexing='ij')
    cx, cy = 512, 512
    rx, ry = 375, 470
    
    ellipse_mask = ((x_indices - cx) / rx) ** 2 + ((y_indices - cy) / ry) ** 2 > 1.05
    arr_rgba[ellipse_mask, 3] = 0
    
    final_img = Image.fromarray(arr_rgba)
    final_img.save(bean_path, "PNG")
    print("Background successfully removed from bean.png!")
    return True

if __name__ == "__main__":
    remove_background()
