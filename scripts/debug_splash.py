from PIL import Image
import numpy as np
from test_render_frame import get_affine_matrix

def debug():
    bg_size = (1024, 1024)
    splash = Image.open("public/coffee/splash_only_color.png").convert("RGBA")
    temp_splash = Image.new("RGBA", bg_size, (0,0,0,0))
    temp_splash.paste(splash, (220, 200))
    
    alpha = 0.5
    cx_start, cy_start = 610, 585
    cx_end, cy_end = 550, 660
    cx = cx_start * (1 - alpha) + cx_end * alpha
    cy = cy_start * (1 - alpha) + cy_end * alpha
    angle = -20 * (1 - alpha) - 25 * alpha
    
    s = max(0.0, min(1.0, (alpha - 0.1) / 0.8))
    scale_splash = s ** 1.3
    
    print(f"alpha={alpha}, s={s}, scale_splash={scale_splash}")
    print(f"cx={cx}, cy={cy}, angle={angle}")
    
    matrix_splash = get_affine_matrix(
        pivot=(550, 660),
        scale=(scale_splash, scale_splash),
        angle_deg=angle - (-25),
        translation=(cx, cy)
    )
    
    transformed_splash = temp_splash.transform(bg_size, Image.Transform.AFFINE, matrix_splash, resample=Image.Resampling.BICUBIC)
    
    arr = np.array(transformed_splash)
    max_alpha = np.max(arr[:, :, 3])
    print(f"Max alpha in transformed splash: {max_alpha}")
    
    # Check if we have non-transparent pixels and where they are
    non_transparent = np.where(arr[:, :, 3] > 0)
    if len(non_transparent[0]) > 0:
        min_y = np.min(non_transparent[0])
        max_y = np.max(non_transparent[0])
        min_x = np.min(non_transparent[1])
        max_x = np.max(non_transparent[1])
        print(f"Splash bounds in output: X: [{min_x}, {max_x}], Y: [{min_y}, {max_y}]")
    else:
        print("No non-transparent pixels in output!")

if __name__ == "__main__":
    debug()
