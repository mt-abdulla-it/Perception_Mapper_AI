from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from engine import analyze_perception
from rephraser import generate_alternatives


app = FastAPI(
  title="Perception Mapper NLP Engine",
  description="Python FastAPI NLP engine analyzing sentiment, tone, and cognitive biases in English, Tamil, and Sinhala.",
  version="1.0.0"
)

# Enable CORS for internal microservice or local host request piping
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
  text: str

@app.get("/health")
def health_check():
  return {
    "status": "healthy",
    "service": "Python FastAPI NLP sidecar process",
    "supported_locales": ["en", "ta", "si"]
  }

@app.post("/analyze")
def analyze_full_perception(payload: AnalysisRequest):
  if not payload.text.strip():
    raise HTTPException(status_code=400, detail="Text content must not be empty")
  return analyze_perception(payload.text)

@app.post("/analyze/tone")
def analyze_tone(payload: AnalysisRequest):
  if not payload.text.strip():
    raise HTTPException(status_code=400, detail="Text content must not be empty")
  res = analyze_perception(payload.text)
  return {"tones": res["tones"], "language": res["language"]}

@app.post("/analyze/bias")
def analyze_bias(payload: AnalysisRequest):
  if not payload.text.strip():
    raise HTTPException(status_code=400, detail="Text content must not be empty")
  res = analyze_perception(payload.text)
  return {
    "biases": res["biases"],
    "biasIndex": res["scores"]["biasIndex"],
    "objectivity": res["scores"]["objectivity"],
    "language": res["language"]
  }

class RephraseRequest(BaseModel):
  text: str
  language: str = "en"
  api_key: str = None

@app.post("/analyze/rephrase")
def analyze_rephrase(payload: RephraseRequest):
  if not payload.text.strip():
    raise HTTPException(status_code=400, detail="Text content must not be empty")
  try:
    alternatives = generate_alternatives(payload.text, payload.language, payload.api_key)
    return {"success": True, "alternatives": alternatives}
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

