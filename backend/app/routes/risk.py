from fastapi import APIRouter
from app.services.reconciliation_engine import engine

router = APIRouter()

@router.get("/scores/{vendor_id}")
async def get_risk_score(vendor_id: str):
    return engine.analyze_node_risk(vendor_id)

@router.get("/vendors")
async def get_all_vendors():
    return engine.get_all_vendors_metrics()

@router.get("/agent/investigate/{vendor_id}")
async def investigate_vendor(vendor_id: str):
    risk_info = engine.analyze_node_risk(vendor_id)
    
    # Generate dynamic heuristic explanation
    actions = []
    trail = []
    
    if risk_info["category"] == "CRITICAL" or risk_info["category"] == "HIGH":
        actions.append("Suspend GSTIN registration immediately")
        actions.append("Trigger Physical Verification of Address")
        trail.append(f"Entity exhibited extreme tax exposure of ₹ {risk_info['exposure']:,.2f}")
        trail.append("Algorithm flagged network for high likelihood of Circular Trading based on edge centrality")
        explanation = f"AI Evaluation indicates {vendor_id} is exhibiting severe anomaly markers with an aggregated network exposure of ₹{risk_info['exposure']:,.2f}. The entity acts as a node funnel within the analyzed graph cluster."
    else:
        actions.append("Monitor invoice streams")
        trail.append("Node topology indicates standard supply chain behavior")
        explanation = f"Entity {vendor_id} appears nominal. The tax exposure is evaluated at ₹{risk_info['exposure']:,.2f} with regular graph degree metrics."
        
    return {
        "explanation": explanation,
        "recommended_actions": actions,
        "risk_score": int(risk_info["score"] * 100),
        "audit_trail": trail
    }
