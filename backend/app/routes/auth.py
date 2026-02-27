from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.models.schema import Token, User

router = APIRouter()

# Mock user DB
users_db = {
    "admin": {
        "username": "admin",
        "full_name": "Admin User",
        "hashed_password": "fakehashedpassword",
        "disabled": False,
    }
}

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user_dict = users_db.get(form_data.username)
    if not user_dict:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    # Bypass actual password check for mock
    return {"access_token": "mock_token", "token_type": "bearer"}
