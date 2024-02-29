#!/usr/bin/python3

import base64
import io
import json
import os
import requests
import subprocess
import sys
import threading
import tkinter as tk

from copy import deepcopy
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from PIL import Image, ImageTk
from typing import List

bird_image_prompt_template = None
sd_payload = None
image_count = 3
IMAGE_PREVIEW_SIZE = 800
IMAGE_CONVERSION_COMMAND = [
    "convert",
    "background_color_f5f6f1.png",
    "(",
    "INPUT_PATH",
    "-bordercolor", "#f5f6f1",
    "-alpha", "set",
    "-virtual-pixel", "transparent",
    "-channel", "A",
    "-blur", "0x50",
    "-level", "50%,100%",
    "+channel",
    "-gravity", "Center",
    "-geometry", "607x500+10-80",
    ")",
    "-composite",
    "WINGSEARCH_BIRD_IMAGE_PATH"
]
IMAGE_WATERMARK_COMMAND = [
    "convert",
    "INPUT_PATH",
    "(", "-size", "450x70", "xc:rgba(255,255,255,0.5)", ")",
    "-gravity", "center",
    "-geometry", "-100+10",
    "-composite",
    "-pointsize", "50",
    "-fill", "rgba(55,55,55,0.9)",
    "-gravity", "center",
    "-annotate", "-100+10", "WATERMARK_TEXT",
    "OUTPUT_PATH"
]


def generate_stable_diffusion_image(prompt: str, file_path: str):
    payload = deepcopy(sd_payload)
    payload["prompt"] = prompt
    response = requests.post(url=f'{os.environ["SD_URL"]}/sdapi/v1/txt2img', json=payload).json()
    image = Image.open(io.BytesIO(base64.b64decode(response['images'][0])))
    image.save(file_path)


def generate_bird_image(bird_name: str, image_count: int) -> List[str]:
    output_directory = "images"
    if not os.path.isdir(output_directory):
        os.makedirs(output_directory, exist_ok=True)
    file_path_list = []
    for i in range(image_count):
        file_path = f"{output_directory}/{bird_name.replace(' ', '-')}-{i}.png"
        file_path_list.append(file_path)
        if not os.path.isfile(file_path):
            prompt = PromptTemplate.from_template(template=bird_image_prompt_template).format(name=bird_name)
            generate_stable_diffusion_image(prompt, file_path)
    return file_path_list


def watermark_image(bird_id: int, input_path: str, output_path: str):
    image_watermark_command = deepcopy(IMAGE_WATERMARK_COMMAND)
    image_watermark_command[1] = input_path
    image_watermark_command[-1] = output_path
    subprocess.run(image_watermark_command)


def generate_wingsearch_image(bird_id: int, file_path: str):
    output_directory = "images/"
    if not os.path.isfile(file_path):
        print(f"Image ({file_path}) not found")
        return
    watermarked_image_path = f"{output_directory}/{bird_id}-watermarked.png"
    watermark_image(bird_id, file_path, watermarked_image_path)
    image_conversion_command = deepcopy(IMAGE_CONVERSION_COMMAND)
    image_conversion_command[3] = watermarked_image_path
    image_conversion_command[-1] = f"{output_directory}/{bird_id}.webp"
    subprocess.run(image_conversion_command)


def init():
    global bird_image_prompt_template
    global sd_payload
    global master_json_path
    load_dotenv()
    master_json_path = os.environ["MASTER_JSON_PATH"]
    with open(os.environ["BIRD_IMAGE_PROMPT_TEMPLATE_PATH"], 'r', encoding='utf-8') as f:
        bird_image_prompt_template = f.read()
    with open(os.environ["SD_PAYLOAD_PATH"], 'r', encoding='utf-8') as f:
        sd_payload = json.load(f)
    IMAGE_WATERMARK_COMMAND[-2] = os.environ["WATERMARK_TEXT"]


def read_wingsearch_json(file_path: str) -> dict:
    bird_dict = {}
    with open(file_path, 'r', encoding='utf-8') as f:
        wingsearch_bird_data = json.load(f)
    for bird in wingsearch_bird_data:
        bird_dict[bird["id"]] = bird["Common name"]
    return bird_dict


def select_image(file_path_list: List[str], bird_name: str):
    def on_image_click(event, path):
        global selected_image_path
        selected_image_path = path
        root.destroy()

    global selected_image_path
    selected_image_path = None
    root = tk.Tk()
    root.title(f"Select an Image for {bird_name}")

    for path in file_path_list:
        img = Image.open(path)
        img.thumbnail((IMAGE_PREVIEW_SIZE, IMAGE_PREVIEW_SIZE))
        imgtk = ImageTk.PhotoImage(image=img)

        lbl = tk.Label(root, image=imgtk)
        lbl.image = imgtk
        lbl.pack(side="left", padx=10, pady=10)
        lbl.bind("<Button-1>", lambda event, path=path: on_image_click(event, path))
    root.mainloop()
    return selected_image_path


def main() -> int:
    init()
    bird_name_dict = read_wingsearch_json(master_json_path)
    sorted_bird_keys = sorted(bird_name_dict.keys())
    bird_image_dict = {}

    # Image generation loop
    for key in sorted_bird_keys:
        bird_name = bird_name_dict[key]
        print(f"{key}: {bird_name}")
        bird_image_dict[key] = generate_bird_image(bird_name, image_count)

    # Image selection and post processing
    for key in sorted_bird_keys:
        bird_name = bird_name_dict[key]
        selected_image_path = select_image(bird_image_dict[key], bird_name)
        threading.Thread(
            target=generate_wingsearch_image,
            kwargs={"bird_id": key, "file_path": selected_image_path}
        ).start()
    return 0


if __name__ == '__main__':
    sys.exit(main())
