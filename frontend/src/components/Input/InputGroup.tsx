import { useEffect, useRef, useState } from "react";
import type { GuessValidity, InputBoxData, InputGroupData, InputTileData } from "./types";
import InputBox from "./InputBox";

function InputGroup({SelectedWord} : {SelectedWord : string}) {
    const [inputGroupData, setInputGroupData] = useState<InputGroupData>({
        listeningIdx: 0,
        inputBoxArray: Array.from({ length: 5 }, (): InputBoxData => ({
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
                if (currentState.inputBoxArray[inputGroupData.listeningIdx].localListeningIdx == 5) {
                    // console.log("Enter accepted")

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
                                        var guessValidity: GuessValidity = 'notSet'
                                        if (tile.innerText == SelectedWord[tIdx]) {
                                            guessValidity = 'correct'
                                        }
                                        else if (SelectedWord.includes(tile.innerText)) {
                                            guessValidity = 'improperPlace'
                                        }
                                        else {
                                            guessValidity = "wrong"
                                        }

                                        return {
                                            ...tile,
                                            guess: guessValidity
                                        };
                                    })
                                };
                            })
                        };

                        return newInputGroupData;
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
                if (currentState.inputBoxArray[inputGroupData.listeningIdx].localListeningIdx >= 5){
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
            <div>
                Selected Word: {SelectedWord}
            </div>
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