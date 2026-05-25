# Production Dockerfile for Python FastAPI NLP service

FROM python:3.10-slim

WORKDIR /app

# Install essential compilation dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy dependencies first (layer cache optimization)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy NLP rule files and main entry points
COPY . .

EXPOSE 8000

ENV PORT=8000

# Execute FastAPI via Uvicorn hosting on all network interfaces
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
