import os
from PIL import Image
import numpy as np

def analyze():
    start_path = r"C:\Users\VARUN-LAP\.gemini\antigravity-ide\brain\7f46d1ea-832d-4219-a310-5b71b6c6f667\frame_start_1781273228722.png"
    end_path = r"C:\Users\VARUN-LAP\.gemini\antigravity-ide\brain\7f46d1ea-832d-4219-a310-5b71b6c6f667\frame_end_1781273245528.png"
    
    if not os.path.exists(start_path) or not os.path.exists(end_path):
        print("Images not found!")
        return
        
    start_img = Image.open(start_path).convert("RGB")
    end_img = Image.open(end_path).convert("RGB")
    
    # Get corner colors
    print("Start img corner (0,0):", start_img.getpixel((0,0)))
    print("Start img center (512,512):", start_img.getpixel((512,512)))
    print("End img corner (0,0):", end_img.getpixel((0,0)))
    print("End img center (512,512):", end_img.getpixel((512,512)))
    
    # Let's find background color range
    # Sample edges (top, bottom, left, right)
    start_arr = np.array(start_img)
    edges = np.concatenate([
        start_arr[0, :, :],       # Top row
        start_arr[-1, :, :],      # Bottom row
        start_arr[:, 0, :],       # Left col
        start_arr[:, -1, :]       # Right col
    ])
    mean_bg = np.mean(edges, axis=0)
    std_bg = np.std(edges, axis=0)
    print("Mean BG color of edges:", mean_bg)
    print("Std BG color of edges:", std_bg)

if __name__ == "__main__":
    analyze()
