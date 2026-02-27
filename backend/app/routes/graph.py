from fastapi import APIRouter, HTTPException
from app.services.reconciliation_engine import engine

router = APIRouter()

@router.get("/cluster/{vendor_id}")
async def get_vendor_cluster(vendor_id: str):
    try:
        data = engine.get_ego_graph(vendor_id)
        if not data["nodes"]:
            return {"nodes": [], "links": []}
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/network")
async def get_full_network():
    return engine.get_full_graph()
