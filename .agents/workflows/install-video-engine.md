---
description: How to install and configure the AnimateDiff video engine for Intel GPU
---

# Video Engine Installation Guide

To enable 3-5s marketing clips in the AutoGrowth Engine using your Intel UHD 620, follow these steps:

### 1. Install Extension
The extension has been cloned to:
`E:\AASFLB\sd-webui-directml\extensions\sd-webui-animatediff`

### 2. Download Motion Module
You need the **AnimateDiff V2 Motion Module** (`mm_sd_v15_v2.ckpt`).
- **Download Link**: [HuggingFace](https://huggingface.co/guoyww/animatediff/resolve/main/mm_sd_v15_v2.ckpt)
- **Place File Here**:
  `E:\AASFLB\sd-webui-directml\extensions\sd-webui-animatediff\model\mm_sd_v15_v2.ckpt`

### 3. Restart Stable Diffusion
After placing the model, restart your `webui-user.bat`. The engine will detect the extension and model.

### 4. Hardware Optimization
The backend is already configured to use:
- **Resolution**: 320x320 (Stability for iGPU)
- **Length**: 16 Frames (~2 seconds)
- **Precision**: Full VAE (Prevents black videos)
