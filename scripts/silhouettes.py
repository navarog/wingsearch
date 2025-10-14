import cv2
import numpy as np
import os

input_folder = "input_images"
output_folder = "output_silhouettes"
os.makedirs(output_folder, exist_ok=True)

TARGET_CANVAS = (450, 685)  # width, height
PLACE_RECT = (50, 100, 440, 550)  # (x1, y1, x2, y2)
TARGET_COLOR = (161, 161, 161, 255)  # #a1a1a1 with full alpha

for fname in os.listdir(input_folder):
    if not fname.lower().endswith(".png"):
        continue

    path = os.path.join(input_folder, fname)
    img = cv2.imread(path, cv2.IMREAD_UNCHANGED)  # keep alpha channel
    if img is None or img.shape[2] < 4:
        continue

    # --- Step 1: recolor all non-transparent pixels to #a1a1a1 ---
    b, g, r, a = cv2.split(img)
    gray_img = np.zeros_like(img)
    gray_img[:, :, 0:3] = TARGET_COLOR[:3]
    gray_img[:, :, 3] = a  # preserve alpha

    # --- Step 2: resize proportionally (longer side = 300 px) ---
    h, w = gray_img.shape[:2]
    scale = 335.0 / max(w, h)
    new_w, new_h = int(w * scale), int(h * scale)
    resized = cv2.resize(gray_img, (new_w, new_h), interpolation=cv2.INTER_AREA)

    # --- Step 3: place resized image onto transparent canvas ---
    canvas = np.zeros((TARGET_CANVAS[1], TARGET_CANVAS[0], 4), dtype=np.uint8)
    x1, y1, x2, y2 = PLACE_RECT
    box_w, box_h = x2 - x1, y2 - y1
    offset_x = x1 + (box_w - new_w) // 2
    offset_y = y1 + (box_h - new_h) // 2

    y2p = offset_y + new_h
    x2p = offset_x + new_w

    # alpha blending
    alpha_r = resized[:, :, 3:] / 255.0
    alpha_bg = 1.0 - alpha_r
    canvas[offset_y:y2p, offset_x:x2p, :3] = (
        alpha_r * resized[:, :, :3] +
        alpha_bg * canvas[offset_y:y2p, offset_x:x2p, :3]
    )
    canvas[offset_y:y2p, offset_x:x2p, 3:] = (
        (alpha_r + alpha_bg * canvas[offset_y:y2p, offset_x:x2p, 3:] / 255.0) * 255
    )

    # --- Step 4: apply Gaussian blur (alpha-aware) ---
    rgb = canvas[:, :, :3].astype(np.float32)
    alpha = canvas[:, :, 3:].astype(np.float32) / 255.0  # shape (H, W, 1)

    # Blur both color and alpha separately
    blurred_rgb = cv2.GaussianBlur(rgb * alpha, (31, 31), 20)
    blurred_alpha = cv2.GaussianBlur(alpha, (31, 31), 20)

    # Ensure blurred_alpha has 3D shape for broadcasting
    if blurred_alpha.ndim == 2:
        blurred_alpha = blurred_alpha[:, :, np.newaxis]

    # Avoid division by zero
    blurred_alpha_3 = np.clip(blurred_alpha, 1e-5, 1.0)

    # Divide color by alpha to normalize
    normalized = blurred_rgb / blurred_alpha_3

    # Recombine RGB + alpha
    blurred = np.dstack([normalized, blurred_alpha * 255]).astype(np.uint8)

    # --- Step 5: save result ---
    out_path = os.path.join(output_folder, fname)
    cv2.imwrite(out_path, blurred)

print("✅ Done! Blurred silhouettes saved to", output_folder)
