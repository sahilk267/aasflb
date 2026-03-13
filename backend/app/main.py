from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AutoGrowth Engine API",
    description="Multi-tenant AI-powered marketing & lead automation dashboard",
    version="1.0.0"
)

from app.routes import auth, business, ai, campaign, analytics

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for local AI images
import os
static_path = os.path.join(os.path.dirname(__file__), "static", "generated")
os.makedirs(static_path, exist_ok=True)
app.mount("/static/generated", StaticFiles(directory=static_path), name="generated")

app.include_router(auth.router, prefix="/api")
app.include_router(business.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(campaign.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")




@app.get("/")
async def root():
    return {"message": "Welcome to AutoGrowth Engine API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
