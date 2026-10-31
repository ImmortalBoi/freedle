import type { InputTileData } from "./types"

export function InputTile({ tileData }: { tileData: InputTileData }) {

    const guessColors = {
        'correct': "bg-green-200",
        'wrong': "bg-gray-200",
        'improperPlace': "bg-yellow-200",
        'notSet': "bg-white"
    }

    return (
        <div className={`flex justify-center items-center border-2 p-4 w-20 h-20 text-4xl border-black ${guessColors[tileData.guess] || 'bg-white'}`} >
            {tileData.innerText}
        </div>
    )
}

export default InputTile