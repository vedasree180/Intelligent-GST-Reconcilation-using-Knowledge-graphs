import json
import csv
import io
from app.models.schema import InvoiceModel
from app.services.reconciliation_engine import engine

def process_upload(content: bytes, filename: str, doc_type: str = None):
    try:
        if filename.endswith(".json"):
            data = json.loads(content.decode("utf-8"))
        elif filename.endswith(".csv"):
            data = []
            f = io.StringIO(content.decode("utf-8"))
            reader = csv.DictReader(f)
            for row in reader:
                data.append(row)
        else:
            raise ValueError("Unsupported file format")

        if not isinstance(data, list):
            data = [data]
            
        success_count = 0
        for item in data:
            # Map flexible headers
            inv_id = item.get("invoice_id") or item.get("id") or item.get("irn")
            buyer = item.get("buyer_gstin") or item.get("buyer")
            supplier = item.get("supplier_gstin") or item.get("seller_gstin") or "UNKNOWN_SUPPLIER"
            amt = float(item.get("total_value") or item.get("amount") or 0.0)
            tax = float(item.get("gst_amount") or item.get("tax_amount") or item.get("tax") or 0.0)
            
            if inv_id and buyer:
                engine.add_invoice(
                    invoice_id=str(inv_id),
                    supplier_gstin=str(supplier),
                    buyer_gstin=str(buyer),
                    amount=amt,
                    tax_amount=tax,
                    return_type=str(item.get("type") or item.get("return_type") or doc_type or "GSTR1")
                )
                success_count += 1
                
        return {"status": "success", "processed": success_count, "total_records": len(data)}
    except Exception as e:
        raise ValueError(f"Error processing upload: {str(e)}")
