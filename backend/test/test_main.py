from fastapi.testclient import TestClient
# Import your FastAPI app instance from your main file (e.g., main.py)
from app.main import app, today_wordle 

client = TestClient(app)

def test_validate_guess_all_correct():
    # Force a known target word for testing
    today_wordle.word = "APPLE"
    
    response = client.get("/guess-validation/APPLE")
    
    assert response.status_code == 200
    data = response.json()
    
    # Expecting all 5 to be correct
    assert data["guess_result"] == ["correct", "correct", "correct", "correct", "correct"]

def test_validate_guess_mixed_and_duplicates():
    # Target word has only ONE 'E'
    today_wordle.word = "APPLE"
    
    # User guesses "PEEKS" (contains two 'E's)
    # P = improper (exists in apple)
    # E = improper (exists in apple)
    # E = wrong (second 'E' exceeds target count of 1)
    # K = wrong
    # S = wrong
    response = client.get("/guess-validation/PEEKS")
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["guess_result"] == [
        "improper", 
        "improper", 
        "wrong", 
        "wrong", 
        "wrong"
    ]

def test_validate_guess_all_wrong():
    today_wordle.word = "APPLE"
    
    response = client.get("/guess-validation/ZZZZZ")
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["guess_result"] == ["wrong", "wrong", "wrong", "wrong", "wrong"]