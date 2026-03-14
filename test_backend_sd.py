import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.services import ai_service

prompt = "A high-tech marketing dashboard, neon colors, digital art style"
print(f"Testing get_image_url with prompt: {prompt}")

try:
    import requests as host_requests
    def patched_post(url, *args, **kwargs):
        return host_requests.post(url.replace("host.docker.internal", "127.0.0.1"), *args, **kwargs)
    
    # Import the service function
    from app.services.ai_service import get_image_url
    
    # We need to monkeypatch requests inside the function's scope if it's imported there
    # But wait, ai_service.py imports it locally inside the function.
    # So we'll patch the built-in import or just let it fail and assume host.docker.internal works in Docker.
    # Actually, a better way is to check if we can just use 127.0.0.1 in the service itself if it's more reliable.
    
    print("Running generated image test...")
    url = get_image_url(prompt)
    print(f"SUCCESS! URL: {url}")
    if url.startswith("/static/generated/"):
        full_path = os.path.join(os.getcwd(), 'backend', 'app', url.lstrip('/'))
        if os.path.exists(full_path):
            print(f"Verified: File exists at {full_path}")
        else:
            print(f"Error: File NOT found at {full_path}")
except Exception as e:
    print(f"Exception: {e}")
