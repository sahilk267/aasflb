import requests
import json
import base64
import time
import os

url = "http://127.0.0.1:7860/sdapi/v1/txt2img"
payload = {
    "prompt": "a professional high-quality product photo of a luxury watch, studio lighting, macro photography",
    "steps": 10,
    "width": 256,
    "height": 256,
    "sampler_name": "Euler a",
    "alwayson_scripts": {
        "AnimateDiff": {
            "args": [
                {
                    "model": "mm_sd_v15_v2.ckpt",
                    "enable": True,
                    "video_length": 4, # 4 frames for stability
                    "fps": 8,
                    "loop_number": 0
                }
            ]
        }
    }
}

print(f"Sending VIDEO request to {url} (Intel GPU Mode)...")
print("Note: This may take several minutes on integrated graphics.")
start_time = time.time()
try:
    response = requests.post(url, json=payload, timeout=1200) # 20 minute timeout
    if response.status_code == 200:
        elapsed = time.time() - start_time
        r = response.json()
        print(f"SUCCESS! Video generated in {elapsed:.2f} seconds.")
        # The first image in the list should be the GIF
        with open("test_video_result.gif", 'wb') as f:
            f.write(base64.b64decode(r['images'][0]))
        print("Saved test_video_result.gif")
    else:
        print(f"Error: {response.status_code}")
        print(response.text[:1000])
except Exception as e:
    print(f"Exception: {e}")
