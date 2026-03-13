import random
import hashlib
from typing import Optional

def generate_content_hash(text: str) -> str:
    """Generate a unique MD5 hash for the content text."""
    return hashlib.md5(text.encode('utf-8')).hexdigest()

def generate_campaign_content(
    business_name: str, 
    niche: str, 
    audience: str, 
    tone: str, 
    platform: str,
    category: Optional[str] = None,
    website_url: Optional[str] = None,
    specific_page_url: Optional[str] = None
):
    """
    Generates high-accuracy marketing content using local Ollama LLM.
    Falls back to templates if Ollama is unreachable.
    """
    import requests
    import json

    niche = niche or "our boutique services"
    audience = audience or "valued customers"
    tone = tone or "Professional"
    
    prompt = f"""
    Create a highly engaging {platform} marketing post for a business named "{business_name}".
    Business Niche: {niche}
    Target Audience: {audience}
    Tone of Voice: {tone}
    {"Website: " + website_url if website_url else ""}
    {"Resource Link: " + specific_page_url if specific_page_url else ""}

    REQUIREMENTS:
    - Focus on conversion and brand loyalty.
    - Match the exact tone specified.
    - Include 2-3 relevant hashtags.
    - Use emojis if appropriate for the platform.
    - Keep it concise and impactful for {platform}.
    - Do NOT include any preamble or "Here is your post" - just the content.
    """

    try:
        # Try local Ollama via host bridge
        response = requests.post(
            "http://host.docker.internal:11434/api/generate",
            json={
                "model": "mistral:latest",
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "top_p": 0.9
                }
            },
            timeout=120
        )
        if response.status_code == 200:
            result = response.json()
            return result.get("response", "").strip()
    except Exception as e:
        print(f"Ollama Error: {e}. Falling back to templates.")

    # FALLBACK: Original template logic
    context_suffix = ""
    if website_url:
        context_suffix = f" Visit us at {website_url}!"
    if specific_page_url:
        context_suffix = f" Check this out: {specific_page_url}"

    templates = {
        "Twitter": [
            f"🚀 Big things coming to {business_name}! We're revolutionizing {niche} for all {audience}. Stay tuned! #AI #Growth",
            f"Why settle for average? {business_name} brings premium {niche} solutions to {audience}. {context_suffix} 🔗",
            f"Transforming {niche} one day at a time. Proudly serving {audience} at {business_name}. ✨ {context_suffix}"
        ],
        "LinkedIn": [
            f"At {business_name}, we're committed to excellence in {niche}. Our latest strategy for {audience} is now live. Let's scale together! {context_suffix} #BusinessGrowth",
            f"The future of {niche} is here. {business_name} is leading the way in providing tailored solutions for {audience}. {context_suffix}",
            f"Insights from the {niche} frontlines: How {business_name} helps {audience} achieve sustainable results. {context_suffix}"
        ],
        "Instagram": [
            f"Aesthetic meets efficiency at {business_name}. ✨ Perfecting {niche} for our favorite {audience}. {context_suffix} ❤️",
            f"Vibe check: {business_name} is the secret sauce for {niche} success. 🥂 Tag a friend who needs this for their {audience}! {context_suffix}",
            f"Behind the scenes at {business_name}. 🎬 Creating the best {niche} experience for {audience} everywhere. {context_suffix}"
        ]
    }
    
    suffix = ""
    if tone.lower() == "witty":
        suffix = " (And yes, we're that good! 😉)"
    elif tone.lower() == "casual":
        suffix = " Cheers! ✌️"
    elif tone.lower() == "aggressive":
        suffix = " Don't wait. Act NOW! ⚡"

    options = templates.get(platform, templates["Twitter"])
    return random.choice(options) + suffix

def generate_image_prompt(post_text: str) -> str:
    """
    Uses the local LLM to generate a high-quality visual prompt for the image engine.
    """
    import requests
    
    prompt = f"""
    Based on this marketing post, generate a concise, professional photography prompt for an image generation tool.
    Focus on lighting, style, and subject. Keep the prompt under 50 words.
    
    Post: {post_text}
    
    Image Prompt:
    """

    try:
        response = requests.post(
            "http://host.docker.internal:11434/api/generate",
            json={
                "model": "mistral:latest",
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.5}
            },
            timeout=30
        )
        if response.status_code == 200:
            return response.json().get("response", "").strip()
    except Exception as e:
        print(f"Ollama Prompt Error: {e}")

    # Fallback to keyword extraction
    clean_text = post_text.split('#')[0].replace("🚀", "").replace("✨", "").strip()
    words = clean_text.split()[:10]
    keywords = " ".join(words)
    return f"Professional marketing photography for {keywords}, high resolution, commercial style"

def get_image_url(prompt: str) -> str:
    """
    Constructs a visual URL. 
    Attempts to use local Stable Diffusion Forge API.
    Falls back to LoremFlickr if Forge is unreachable.
    """
    import requests
    import json
    import base64
    import uuid
    import os

    # 1. Attempt Local Stable Diffusion Forge
    try:
        # Forge API running on host reachable via host.docker.internal
        sd_url = "http://host.docker.internal:7860/sdapi/v1/txt2img"
        payload = {
            "prompt": prompt,
            "steps": 20,
            "width": 1024,
            "height": 1024,
            "sampler_name": "Euler a",
            "cfg_scale": 7
        }
        
        response = requests.post(sd_url, json=payload, timeout=120)
        if response.status_code == 200:
            r = response.json()
            # Forge returns images as a list of base64 strings
            image_b64 = r['images'][0]
            
            # Generate local filename
            filename = f"gen_{uuid.uuid4().hex}.png"
            # Path relative to app/main.py configuration
            static_dir = os.path.join(os.path.dirname(__file__), "..", "static", "generated")
            os.makedirs(static_dir, exist_ok=True)
            file_path = os.path.join(static_dir, filename)
            
            # Decode and save
            with open(file_path, "wb") as f:
                f.write(base64.b64decode(image_b64))
            
            # Return URL reachable by frontend
            # Note: We use relative path because frontend calls backend on same host usually
            # or we might need the full backend URL if running in complex env.
            # For now, /static/generated/... works because of app.mount in main.py
            return f"/static/generated/{filename}"

    except Exception as e:
        print(f"Stable Diffusion Error: {e}. Falling back to LoremFlickr.")

    # 2. FALLBACK: LoremFlickr 
    import urllib.parse
    # Extract keywords for LoremFlickr (limit to 3 main concepts)
    keywords = prompt.replace("Professional marketing photography for ", "").split(",")[0].strip()
    tag_list = ",".join(keywords.split()[:3])
    
    # Fallback to general business if no keywords
    tags = tag_list if tag_list else "business,marketing"
    
    seed = random.randint(1, 1000)
    # Using LoremFlickr for faster, guaranteed loads
    return f"https://loremflickr.com/1024/1024/{tags}/all?lock={seed}"
