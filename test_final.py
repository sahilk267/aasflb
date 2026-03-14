import requests
import json
import base64
import time

url = "http://127.0.0.1:7860/sdapi/v1/txt2img"
payload = {
    "prompt": "a professional high-quality product photo of a luxury watch, studio lighting, macro photography",
    "steps": 10,
    "width": 512,
    "height": 512
}

print(f"Sending FINAL request to {url} (Intel GPU Mode)...")
start_time = time.time()
try:
    response = requests.post(url, json=payload, timeout=600)
    if response.status_code == 200:
        elapsed = time.time() - start_time
        r = response.json()
        print(f"SUCCESS! Image generated in {elapsed:.2f} seconds.")
        with open("test_intel_final.png", 'wb') as f:
            f.write(base64.b64decode(r['images'][0]))
        print("Saved test_intel_final.png")
    else:
        print(f"Error: {response.status_code}")
        print(response.text[:1000])
except Exception as e:
    print(f"Exception: {e}")
