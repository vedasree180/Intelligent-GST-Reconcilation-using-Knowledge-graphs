import requests
import json

payload = [
    {
        "invoice_id": "INV-001", 
        "buyer_gstin": "29ABCDE1234F1Z5", 
        "supplier_gstin": "27XYZAB5678C1Z2", 
        "amount": 100000, 
        "gst_amount": 18000
    }, 
    {
        "invoice_id": "INV-002", 
        "buyer_gstin": "27XYZAB5678C1Z2", 
        "supplier_gstin": "07DEFGH9012I3K4", 
        "amount": 50000, 
        "gst_amount": 9000
    },
    {
        "invoice_id": "INV-003", 
        "buyer_gstin": "07DEFGH9012I3K4", 
        "supplier_gstin": "29ABCDE1234F1Z5", 
        "amount": 200000, 
        "gst_amount": 36000
    }
]

try:
    print("Uploading dummy invoices to graph...")
    res = requests.post('http://localhost:8002/api/v1/auth/data', files={'file': ('test.json', json.dumps(payload))})
    print(res.json())
    
    print("\nFetching vendor analysis from graph...")
    res2 = requests.get('http://localhost:8002/api/v1/auth/vendors')
    print(json.dumps(res2.json(), indent=2))
    
    print("\nTrigger AI agent on 07DEFGH9012I3K4...")
    res3 = requests.get('http://localhost:8002/api/v1/auth/agent/investigate/07DEFGH9012I3K4')
    print(json.dumps(res3.json(), indent=2))
except Exception as e:
    print(f"Failed: {e}")
