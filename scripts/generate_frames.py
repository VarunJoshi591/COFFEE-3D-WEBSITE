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

def generate_all_frames(output_dir, total_frames=120):
    os.makedirs(output_dir, exist_ok=True)
    
    bg_path = "public/coffee/generated_bg.png"
    brown_path = "public/coffee/crop_brown_cup.png"
    cup_body_path = "public/coffee/crop_cream_cup_body.png"
    lid_path = "public/coffee/crop_lid.png"
    splash_path = "public/coffee/splash_only_color.png"
    
    # Check if all cropped assets exist. If not, raise error.
    for path in [bg_path, brown_path, cup_body_path, lid_path, splash_path]:
        if not os.path.exists(path):
            print(f"Error: Required asset {path} is missing. Please run preprocessing scripts first.")
            return False
            
    bg_template = Image.open(bg_path).convert("RGBA")
    brown_cup = Image.open(brown_path).convert("RGBA")
    cup_body = Image.open(cup_body_path).convert("RGBA")
    lid = Image.open(lid_path).convert("RGBA")
    splash = Image.open(splash_path).convert("RGBA")
    
    print(f"Generating {total_frames} frames into {output_dir}...")
    
    for i in range(total_frames):
        alpha = i / (total_frames - 1)
        
        # 1. Create a copy of the clean background
        frame = bg_template.copy()
        
        # 2. Paste the static brown cup (with its shadow/background)
        frame.alpha_composite(brown_cup, (650, 200))
        
        # 3. Calculate interpolation parameters for cream cup body
        cx_start, cy_start = 610, 585
        cx_end, cy_end = 550, 660
        cx = cx_start * (1 - alpha) + cx_end * alpha
        cy = cy_start * (1 - alpha) + cy_end * alpha
        angle = -20 * (1 - alpha) - 25 * alpha
        
        # Draw cup body first (so splash sits on top of the rim)
        temp_cup = Image.new("RGBA", frame.size, (0,0,0,0))
        temp_cup.paste(cup_body, (460, 390))
        matrix_cup = get_affine_matrix(
            pivot=(610, 585),
            scale=(1.0, 1.0),
            angle_deg=angle - (-20),
            translation=(cx, cy)
        )
        transformed_cup = temp_cup.transform(frame.size, Image.Transform.AFFINE, matrix_cup, resample=Image.Resampling.BICUBIC)
        frame.alpha_composite(transformed_cup)
        
        # 4. Draw Coffee Splash (on top of the cup rim)
        # Splash starts at alpha = 0.1 and grows to 1.0 at alpha = 0.9
        s = max(0.0, min(1.0, (alpha - 0.1) / 0.8))
        scale_splash = s ** 1.3
        
        if scale_splash > 0:
            temp_splash = Image.new("RGBA", frame.size, (0,0,0,0))
            temp_splash.paste(splash, (220, 200))
            matrix_splash = get_affine_matrix(
                pivot=(550, 660), # final cup center as pivot
                scale=(scale_splash, scale_splash),
                angle_deg=angle - (-25), # rotates along with cup
                translation=(cx, cy)
            )
            transformed_splash = temp_splash.transform(frame.size, Image.Transform.AFFINE, matrix_splash, resample=Image.Resampling.BICUBIC)
            
            # Apply alpha/opacity fade-in matching the scale progress
            arr = np.array(transformed_splash)
            arr[:, :, 3] = (arr[:, :, 3] * s).astype(np.uint8)
            transformed_splash = Image.fromarray(arr)
            
            frame.alpha_composite(transformed_splash)
            
        # 5. Draw Black Lid (on top of everything)
        # Lid lifts in a smooth arch:
        # Starting center: (575, 420), angle: -20
        # Ending center: (430, 290), angle: -30
        cx_lid_start, cy_lid_start = 575, 420
        cx_lid_end, cy_lid_end = 430, 290
        
        # Let's add a curved arch offset to the lid's vertical trajectory
        # It rises slightly higher in the middle to simulate a floating arc
        arch_offset = -60 * np.sin(alpha * np.pi)
        
        cx_lid = cx_lid_start * (1 - alpha) + cx_lid_end * alpha
        cy_lid = cy_lid_start * (1 - alpha) + cy_lid_end * alpha + arch_offset
        angle_lid = -20 * (1 - alpha) - 30 * alpha
        
        temp_lid = Image.new("RGBA", frame.size, (0,0,0,0))
        temp_lid.paste(lid, (440, 360))
        matrix_lid = get_affine_matrix(
            pivot=(575, 420),
            scale=(1.0, 1.0),
            angle_deg=angle_lid - (-20),
            translation=(cx_lid, cy_lid)
        )
        transformed_lid = temp_lid.transform(frame.size, Image.Transform.AFFINE, matrix_lid, resample=Image.Resampling.BICUBIC)
        frame.alpha_composite(transformed_lid)
        
        # 6. Save as WebP with optimized compression quality
        frame_name = f"frame_{i}.webp"
        frame_path = os.path.join(output_dir, frame_name)
        
        # Convert to RGB before saving WebP to optimize file size (since it's a solid background anyway)
        final_rgb = frame.convert("RGB")
        final_rgb.save(frame_path, "WEBP", quality=82)
        
        if i % 20 == 0 or i == total_frames - 1:
            print(f"Rendered frame {i}/{total_frames - 1}")
            
    print(f"Successfully rendered all {total_frames} frames in {output_dir}!")
    return True

if __name__ == "__main__":
    output_dir = os.path.join("public", "frames")
    generate_all_frames(output_dir)
