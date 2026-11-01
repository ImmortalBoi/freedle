import { useEffect, useRef, useState } from "react";
import type { GuessValidity, InputBoxData, InputGroupData, InputTileData } from "./types";
import InputBox from "./InputBox";
import { api } from "../../services/api";

function InputGroup() {
    const [inputGroupData, setInputGroupData] = useState<InputGroupData>({
        listeningIdx: 0,
        inputBoxArray: Array.from({ length: 6 }, (): InputBoxData => ({
            localListeningIdx: 0,
            inputTileArray: Array.from({ length: 5 }, (): InputTileData => ({
                innerText: '',
                guess: 'notSet'
            })),
        }))
    });

    const stateRef = useRef(inputGroupData)

    stateRef.current = inputGroupData;

    useEffect(() => {
        function handleKeyPress(e: KeyboardEvent) {
            if (!e.code) return;

            const currentState = stateRef.current;

            if (e.code == "Backspace") {
                // console.log("Backspace Entered")

                setInputGroupData((prevData) => {
                    const newInputGroupData: InputGroupData = {
                        listeningIdx: prevData.listeningIdx,
                        inputBoxArray: prevData.inputBoxArray.map((box, bIdx) => {
                            if (bIdx !== prevData.listeningIdx) return box;
                            return {
                                ...box,
                                localListeningIdx: Math.max(0, box.localListeningIdx - 1),
                                inputTileArray: box.inputTileArray.map((tile, tIdx) => {
                                    if (tIdx !== box.localListeningIdx - 1) return tile;
                                    return {
                                        ...tile,
                                        innerText: ''
                                    }
                                })
                            }
                        })
                    }
                    return newInputGroupData
                })
            }

            // Check if enter is pressed
            else if (e.code == "Enter") {
                // Check if the last input has been entered
                if (currentState.inputBoxArray[currentState.listeningIdx].localListeningIdx == 5) {
                    // console.log("Enter accepted")
                    const currentBox = currentState.inputBoxArray[currentState.listeningIdx];

                    const guessedWord = currentBox.inputTileArray
                        .map((tile) => tile.innerText)
                        .join('');

                    console.log("Submitted Word:", guessedWord);
                    api.get(`/guess/${guessedWord}`).then((response) => {
                        console.log(response.data)
                        // Verify the guess
                        setInputGroupData((prevData) => {
                            // Clone the old the data
                            const newInputGroupData: InputGroupData = {
                                listeningIdx: prevData.listeningIdx + 1,
                                inputBoxArray: prevData.inputBoxArray.map((box, bIdx) => {
                                    if (bIdx !== prevData.listeningIdx) return box;
                                    return {
                                        ...box,
                                        inputTileArray: box.inputTileArray.map((tile, tIdx) => {
                                            // TODO: when using the api this logic should not be here, and the api will decide if it's true or not
                                            if (response.data["guess_result"][tIdx] == "correct") {
                                                return {
                                                    ...tile,
                                                    guess: 'correct'
                                                };
                                            }
                                            else if (response.data["guess_result"][tIdx] == "improper") {
                                                return {
                                                    ...tile,
                                                    guess: 'improperPlace'
                                                };
                                            }
                                            else {

                                                return {
                                                    ...tile,
                                                    guess: 'wrong'
                                                };
                                            }

                                        })
                                    };
                                })
                            };

                            return newInputGroupData;
                        });
                    }).catch((error) => {
                        console.error("Error submitting guess:", error);
                    });

                }
                else {
                    // TODO: do a little animation shake
                    // console.log("Enter denied")

                }

            }

            // Check if a keyboard alphabet key is pressed
            else if (e.code.includes("Key")) {
                // Check if all letters are pressed
                if (currentState.inputBoxArray[currentState.listeningIdx].localListeningIdx >= 5) {
                    return;
                }

                const keyPressed = e.code[e.code.length - 1].toUpperCase();

                setInputGroupData((prevData) => {
                    const newInputGroupData: InputGroupData = {
                        listeningIdx: prevData.listeningIdx,
                        inputBoxArray: prevData.inputBoxArray.map((box, bIdx) => {
                            if (bIdx !== prevData.listeningIdx) return box;
                            return {
                                ...box,
                                inputTileArray: box.inputTileArray.map((tile, tIdx) => {
                                    if (tIdx !== box.localListeningIdx) return tile;
                                    return {
                                        ...tile,
                                        innerText: keyPressed
                                    };
                                })
                            };
                        })
                    };

                    // 2. Get current active box in the new copy
                    const activeBox = newInputGroupData.inputBoxArray[newInputGroupData.listeningIdx];

                    // 3. Increment indices safely
                    activeBox.localListeningIdx += 1;

                    return newInputGroupData;
                });
            }

        }

        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    return (

        <div className="flex flex-col gap-4 justify-center items-center">
            <div
                className="flex flex-col gap-4"
            >
                {inputGroupData.inputBoxArray.map((inputBoxData, idx) => {
                    return (
                        <InputBox boxData={inputBoxData} key={idx} />
                    )
                })}
            </div>
        </div>
    )


}

export default InputGroup