import os
from PIL import Image
import numpy as np

def reconstruct_bg():
    start_path = r"C:\Users\VARUN-LAP\.gemini\antigravity-ide\brain\7f46d1ea-832d-4219-a310-5b71b6c6f667\frame_start_1781273228722.png"
    if not os.path.exists(start_path):
        print("Start image not found!")
        return
        
    img = Image.open(start_path).convert("RGB")
    arr = np.array(img, dtype=float)
    h, w, c = arr.shape
    
    # We will sample background pixels from regions we know contain ONLY background.
    # The left half of the image (x < 350) and top (y < 200) and bottom (y > 900) are background.
    # Let's collect coords and RGB values.
    x_indices, y_indices = np.meshgrid(np.arange(w), np.arange(h))
    
    # Define mask for known background pixels
    bg_mask = (x_indices < 350) | (y_indices < 150) | (y_indices > 900) | ((x_indices > 850) & (y_indices < 250))
    
    # We can fit a 2D polynomial to each channel (R, G, B)
    # Let's use a 2D quadratic polynomial: Z = a*x^2 + b*y^2 + c*x*y + d*x + e*y + f
    X = x_indices[bg_mask]
    Y = y_indices[bg_mask]
    
    # Design matrix for quadratic fit
    A = np.column_stack([X**2, Y**2, X*Y, X, Y, np.ones_like(X)])
    
    reconstructed = np.zeros_like(arr)
    
    for channel in range(c):
        Z = arr[:, :, channel][bg_mask]
        # Solve least squares: A * coeff = Z
        coeff, _, _, _ = np.linalg.lstsq(A, Z, rcond=None)
        
        # Evaluate polynomial over all coordinates
        all_X = x_indices.ravel()
        all_Y = y_indices.ravel()
        all_A = np.column_stack([all_X**2, all_Y**2, all_X*all_Y, all_X, all_Y, np.ones_like(all_X)])
        
        channel_bg = np.dot(all_A, coeff).reshape(h, w)
        reconstructed[:, :, channel] = np.clip(channel_bg, 0, 255)
        
    bg_img = Image.fromarray(reconstructed.astype(np.uint8))
    bg_img.save("public/coffee/generated_bg.png")
    print("Saved generated background to public/coffee/generated_bg.png")

if __name__ == "__main__":
    reconstruct_bg()
