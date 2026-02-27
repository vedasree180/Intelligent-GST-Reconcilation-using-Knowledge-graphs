from pydantic import BaseModel
from typing import Optional, List

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    username: str
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class InvoiceModel(BaseModel):
    invoice_id: str
    supplier_gstin: str
    buyer_gstin: str
    amount: float
    tax_amount: float
    return_type: str
