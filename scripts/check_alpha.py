from PIL import Image
import numpy as np

def check_alpha():
    img = Image.open("public/coffee/start_keyed.png")
    arr = np.array(img)
    h, w, c = arr.shape
    
    # Let's sample a region in the middle of the cream cup sleeve.
    # Center of cream cup sleeve in frame_start is roughly X: 610, Y: 590.
    sample_y = 590
    sample_x = 610
    
    pixel = arr[sample_y, sample_x]
    print(f"Pixel at ({sample_x}, {sample_y}) RGBA: {pixel}")
    
    # Let's count how many pixels inside the cup area are actually transparent (alpha < 100)
    # The cup area in start_keyed.png is roughly X: [470, 730], Y: [380, 750]
    sub_arr = arr[380:750, 470:730]
    total_pixels = sub_arr.shape[0] * sub_arr.shape[1]
    transparent_pixels = np.sum(sub_arr[:, :, 3] < 100)
    print(f"Total pixels in cup area box: {total_pixels}")
    print(f"Transparent pixels in cup area box: {transparent_pixels} ({transparent_pixels/total_pixels*100:.2f}%)")

if __name__ == "__main__":
    check_alpha()
