from fastapi import FastAPI, Path
from app.models import WordleToday, GuessCharResult, GuessWordResult

app = FastAPI()

today_wordle: WordleToday = WordleToday()

@app.get("/")
def read_root():
    return {"SelectedWord": today_wordle.word}

@app.get("/api/guess/{guess}")
def validate_guess(
    guess: str = Path(..., min_length=5, max_length=5, description="Must be exactly 5 letters")
):
    # Optional: Convert to uppercase to handle lowercase guesses cleanly
    guess = guess.upper()
    print(f"Today's Wordle: {today_wordle.word}, Guess: {guess}")
    result : GuessWordResult = GuessWordResult()
    
    occurence_dict : dict[str, int] = {}
    for letter in today_wordle.word:
        occurence_dict[letter] = occurence_dict.get(letter, 0) + 1
        
    # print(f"Occurence Dict Pre-First Pass: {occurence_dict}")
    # print(f"Guess Results: {result.guess_result}")
        
    # First Pass - To check improper placement you need to know where all the correct letters are first
    for result_idx, (guess_char, wordle_char) in enumerate(zip(guess, today_wordle.word)):
        if guess_char == wordle_char:
            result.guess_result[result_idx] = GuessCharResult.CORRECT
            occurence_dict[guess_char] -= 1
    
    # print(f"Occurence Dict Pre-Second Pass: {occurence_dict}")
    # print(f"Guess Results: {result.guess_result}")
    
    # Second Pass - Now every letter that exists in both the guess and the occurence index must be improper
    for idx, guess_char in enumerate(guess):
        if result.guess_result[idx] == GuessCharResult.CORRECT:
            continue
        
        if occurence_dict.get(guess_char, 0) > 0:
            occurence_dict[guess_char] -= 1
            result.guess_result[idx] = GuessCharResult.IMPROPER
    
    # print(f"Occurence Dict Post-Second Pass: {occurence_dict}")
    # print(f"Guess Results: {result.guess_result}")
            
    return result

