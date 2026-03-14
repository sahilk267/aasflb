import requests
import json
import base64
import time

url = "http://127.0.0.1:7860/sdapi/v1/txt2img"
payload = {
    "prompt": "a dot",
    "steps": 1,
    "width": 64,
    "height": 64
}

print(f"Sending FAST request to {url}...")
try:
    response = requests.post(url, json=payload, timeout=60)
    if response.status_code == 200:
        r = response.json()
        print(f"SUCCESS! API returned image.")
        with open("test_fast_dml.png", 'wb') as f:
            f.write(base64.b64decode(r['images'][0]))
        print("Saved test_fast_dml.png")
    else:
        print(f"Error: {response.status_code}")
        print(response.text[:1000])
except Exception as e:
    print(f"Exception: {e}")
