import os
from PIL import Image, ImageFilter
import numpy as np

def delta_key(img_path, bg_path, output_path, threshold=20, feather=5):
    img = Image.open(img_path).convert("RGB")
    bg = Image.open(bg_path).convert("RGB")
    
    img_arr = np.array(img, dtype=float)
    bg_arr = np.array(bg, dtype=float)
    
    # Calculate Euclidean distance in RGB
    diff = np.sqrt(np.sum((img_arr - bg_arr) ** 2, axis=2))
    
    # Create mask: 0 for background, 255 for foreground
    mask = np.zeros_like(diff, dtype=np.uint8)
    
    # Soft thresholding (feathering)
    # distance < threshold -> alpha = 0
    # distance > threshold + feather -> alpha = 255
    # in between -> linear interpolation
    
    low = threshold
    high = threshold + feather
    
    # Calculate alpha mask values from 0.0 to 1.0
    alpha = (diff - low) / (high - low)
    alpha = np.clip(alpha, 0.0, 1.0)
    
    mask = (alpha * 255).astype(np.uint8)
    
    # Convert mask to Image and apply a slight gaussian blur to smooth edges
    mask_img = Image.fromarray(mask, mode="L")
    if feather > 0:
        mask_img = mask_img.filter(ImageFilter.GaussianBlur(1))
        
    # Create RGBA image
    rgba_img = img.copy().convert("RGBA")
    rgba_img.putalpha(mask_img)
    rgba_img.save(output_path, "PNG")
    print(f"Saved delta-keyed image to {output_path}")

if __name__ == "__main__":
    start_path = r"C:\Users\VARUN-LAP\.gemini\antigravity-ide\brain\7f46d1ea-832d-4219-a310-5b71b6c6f667\frame_start_1781273228722.png"
    bg_path = "public/coffee/generated_bg.png"
    
    # Ensure output dir exists
    os.makedirs("public/coffee", exist_ok=True)
    delta_key(start_path, bg_path, "public/coffee/start_keyed.png", threshold=35, feather=8)
