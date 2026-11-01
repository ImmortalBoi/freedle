from enum import Enum
import json
import random

from pydantic import BaseModel, Field

def get_random_word() -> str:
    with open('app/wordles.json', 'r', encoding='utf-8') as file:
        wordles = json.load(file)
    return wordles[random.randrange(len(wordles))].upper()

class WordleToday(BaseModel):
    word: str = Field(default_factory=get_random_word, validate_default= True)

class WordleGuess(BaseModel):
    guess: str
    
class GuessCharResult(str,Enum):
    WRONG = "wrong"
    CORRECT = "correct"
    IMPROPER = "improper" # Wrongly placed
    
class GuessWordResult(BaseModel):
    guess_result: list[GuessCharResult] = Field(
        default_factory=lambda: [GuessCharResult.WRONG] * 5
    )