from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, ingestion, graph, risk

app = FastAPI(
    title="GST AI Auditor",
    description="Enterprise API for intelligent tax reconciliation and fraud detection",
    version="1.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {"status": "GST AI Auditor API is running gracefully."}

# Mount sub-routers for endpoints
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(ingestion.router, prefix="/api/v1/auth", tags=["Ingestion"])
app.include_router(graph.router, prefix="/api/v1/auth", tags=["Graph Analytics"])
app.include_router(risk.router, prefix="/api/v1/auth", tags=["Risk Engine"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
