---
description: How to install Stable Diffusion Forge on AMD GPU (Windows)
---
# Stable Diffusion Forge Installation Guide (AMD GPU)

Since you have an AMD Radeon GPU, **Stable Diffusion Forge** is the best choice because it uses **DirectML** to run AI models on your card.

### 1. Prerequisite: Python & Git
If you don't have these installed, please download them:
- **Python 3.10.11**: [Download here](https://www.python.org/ftp/python/3.10.11/python-3.10.11-amd64.exe) (Mark "Add Python to PATH" during install).
- **Git**: [Download here](https://git-scm.com/download/win).

### 2. Clone Forge
Open a folder where you want to install it (e.g., `E:\AI`), right-click, select "Open in Terminal", and run:
```bash
git clone https://github.com/lllyasviel/stable-diffusion-webui-forge.git
```

### 3. Setup Virtual Environment (.venv)
To keep your system clean, we will create an isolated environment. Inside the `stable-diffusion-webui-forge` folder, run:
```powershell
# Create the environment
python -m venv .venv

# Activate it
.\.venv\Scripts\activate

# Update pip
python -m pip install --upgrade pip
```

### 4. First Launch (AMD Optimization)
1. Find the file `webui-user.bat` in the folder.
2. Right-click it -> Edit.
3. Update the `set PYTHON=` line to point to your new environment (optional but recommended):
```batch
set PYTHON=.venv\Scripts\python.exe
```
4. Add these flags to the `set COMMANDLINE_ARGS=` line:
```batch
set COMMANDLINE_ARGS=--listen --api --precision full --no-half --use-directml
```
5. Save and Close.
6. Double-click `webui-user.bat` to start the installation.

### 4. Integration
Once it shows `Running on local URL:  http://0.0.0.0:7860`, let me know! I will then connect **AutoGrowth Engine** to this local server so it can generate images directly on your machine.
