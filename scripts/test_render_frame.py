import os
from PIL import Image
import numpy as np

def get_affine_matrix(pivot, scale, angle_deg, translation):
    px, py = pivot
    sx, sy = scale
    theta = np.radians(angle_deg)
    tx, ty = translation
    
    cos_t = np.cos(theta)
    sin_t = np.sin(theta)
    
    a = cos_t / sx
    b = sin_t / sx
    c = px - (tx * cos_t + ty * sin_t) / sx
    
    d = -sin_t / sy
    e = cos_t / sy
    f = py + (tx * sin_t - ty * cos_t) / sy
    
    return (a, b, c, d, e, f)

def render_frame(alpha, output_path):
    bg = Image.open("public/coffee/generated_bg.png").convert("RGBA")
    
    # Draw Brown Cup (static)
    brown_cup = Image.open("public/coffee/crop_brown_cup.png").convert("RGBA")
    bg.alpha_composite(brown_cup, (650, 200))
    
    # 1. Cream Cup Body
    # Original position: (460, 390)
    cup_body = Image.open("public/coffee/crop_cream_cup_body.png").convert("RGBA")
    temp_cup = Image.new("RGBA", bg.size, (0,0,0,0))
    temp_cup.paste(cup_body, (460, 390))
    
    cx_start, cy_start = 610, 585
    cx_end, cy_end = 550, 660
    cx = cx_start * (1 - alpha) + cx_end * alpha
    cy = cy_start * (1 - alpha) + cy_end * alpha
    angle = -20 * (1 - alpha) - 25 * alpha
    
    # Affine transform for cup
    # Pivot is global center of cup body at start: (610, 585)
    # Rotation: angle - (-20)
    # Translation: (cx, cy)
    matrix_cup = get_affine_matrix(
        pivot=(610, 585),
        scale=(1.0, 1.0),
        angle_deg=angle - (-20),
        translation=(cx, cy)
    )
    transformed_cup = temp_cup.transform(bg.size, Image.Transform.AFFINE, matrix_cup, resample=Image.Resampling.BICUBIC)
    
    # Draw cup body first
    bg.alpha_composite(transformed_cup)
    
    # 2. Coffee Splash
    # Original position: (220, 200)
    splash = Image.open("public/coffee/splash_only_color.png").convert("RGBA")
    temp_splash = Image.new("RGBA", bg.size, (0,0,0,0))
    temp_splash.paste(splash, (220, 200))
    
    # Splash animation curve
    s = max(0.0, min(1.0, (alpha - 0.1) / 0.8))
    # Make scale non-linear for better eruption feel
    scale_splash = s ** 1.3
    
    if scale_splash > 0:
        # Scale and rotate splash relative to the cup rim center in final pose
        # Cup rim center in final pose is approx (550, 660)
        # Translation of splash matches the cup's translation from its final pose:
        # Final cup position: (550, 660), Final angle: -25
        # Current cup position: (cx, cy), Current angle: angle
        matrix_splash = get_affine_matrix(
            pivot=(550, 660),
            scale=(scale_splash, scale_splash),
            angle_deg=angle - (-25),
            translation=(cx, cy)
        )
        transformed_splash = temp_splash.transform(bg.size, Image.Transform.AFFINE, matrix_splash, resample=Image.Resampling.BICUBIC)
        
        # Apply alpha/opacity to splash layer
        arr = np.array(transformed_splash)
        arr[:, :, 3] = (arr[:, :, 3] * s).astype(np.uint8)
        transformed_splash = Image.fromarray(arr)
        
        # Draw splash on top of cup body
        bg.alpha_composite(transformed_splash)
    
    # 3. Black Lid
    # Original position: (440, 360)
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
    print(f"Saved rendered frame at alpha={alpha:.2f} to {output_path}")

if __name__ == "__main__":
    os.makedirs("public/coffee", exist_ok=True)
    render_frame(0.8, "public/coffee/rendered_frame_80.png")
