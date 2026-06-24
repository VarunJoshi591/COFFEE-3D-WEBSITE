import os
from PIL import Image
import numpy as np
from test_render_frame import get_affine_matrix

def render_frame_under(alpha, output_path):
    bg = Image.open("public/coffee/generated_bg.png").convert("RGBA")
    
    # Draw Brown Cup (static)
    brown_cup = Image.open("public/coffee/crop_brown_cup.png").convert("RGBA")
    bg.alpha_composite(brown_cup, (650, 200))
    
    # 1. Cream Cup Body
    cup_body = Image.open("public/coffee/crop_cream_cup_body.png").convert("RGBA")
    temp_cup = Image.new("RGBA", bg.size, (0,0,0,0))
    temp_cup.paste(cup_body, (460, 390))
    
    cx_start, cy_start = 610, 585
    cx_end, cy_end = 550, 660
    cx = cx_start * (1 - alpha) + cx_end * alpha
    cy = cy_start * (1 - alpha) + cy_end * alpha
    angle = -20 * (1 - alpha) - 25 * alpha
    
    matrix_cup = get_affine_matrix(
        pivot=(610, 585),
        scale=(1.0, 1.0),
        angle_deg=angle - (-20),
        translation=(cx, cy)
    )
    transformed_cup = temp_cup.transform(bg.size, Image.Transform.AFFINE, matrix_cup, resample=Image.Resampling.BICUBIC)
    
    # 2. Coffee Splash
    splash = Image.open("public/coffee/splash_only_color.png").convert("RGBA")
    temp_splash = Image.new("RGBA", bg.size, (0,0,0,0))
    temp_splash.paste(splash, (220, 200))
    
    s = max(0.0, min(1.0, (alpha - 0.1) / 0.8))
    scale_splash = s ** 1.3
    
    if scale_splash > 0:
        matrix_splash = get_affine_matrix(
            pivot=(550, 660),
            scale=(scale_splash, scale_splash),
            angle_deg=angle - (-25),
            translation=(cx, cy)
        )
        transformed_splash = temp_splash.transform(bg.size, Image.Transform.AFFINE, matrix_splash, resample=Image.Resampling.BICUBIC)
        
        arr = np.array(transformed_splash)
        arr[:, :, 3] = (arr[:, :, 3] * s).astype(np.uint8)
        transformed_splash = Image.fromarray(arr)
        
        # Draw splash first
        bg.alpha_composite(transformed_splash)
        
    # Draw cup body on top of splash
    bg.alpha_composite(transformed_cup)
    
    # 3. Black Lid
    lid = Image.open("public/coffee/crop_lid.png").convert("RGBA")
    temp_lid = Image.new("RGBA", bg.size, (0,0,0,0))
    temp_lid.paste(lid, (440, 360))
    
    cx_lid_start, cy_lid_start = 575, 420
    cx_lid_end, cy_lid_end = 430, 290
    cx_lid = cx_lid_start * (1 - alpha) + cx_lid_end * alpha
    cy_lid = cy_lid_start * (1 - alpha) + cy_lid_end * alpha
    angle_lid = -20 * (1 - alpha) - 30 * alpha
    
    matrix_lid = get_affine_matrix(
        pivot=(575, 420),
        scale=(1.0, 1.0),
        angle_deg=angle_lid - (-20),
        translation=(cx_lid, cy_lid)
    )
    transformed_lid = temp_lid.transform(bg.size, Image.Transform.AFFINE, matrix_lid, resample=Image.Resampling.BICUBIC)
    bg.alpha_composite(transformed_lid)
    
    bg.save(output_path)
    print(f"Saved rendered frame at alpha={alpha:.2f} to {output_path} (cup on top)")

if __name__ == "__main__":
    render_frame_under(0.8, "public/coffee/rendered_frame_80_under.png")
