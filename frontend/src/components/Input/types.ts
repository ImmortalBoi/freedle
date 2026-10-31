export type GuessValidity = 'correct' | 'wrong' | 'improperPlace' | 'notSet';

export interface InputTileData {
    innerText: string;
    guess: GuessValidity;
}

export interface InputBoxData {
    inputTileArray: InputTileData[]
    localListeningIdx: number
}

export interface InputGroupData {
    inputBoxArray : InputBoxData[]
    listeningIdx : number
}