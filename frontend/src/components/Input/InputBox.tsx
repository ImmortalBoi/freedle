import InputTile from "./InputTile"
import type { InputBoxData } from "./types"

function InputBox({ boxData } : {boxData : InputBoxData}) {

    return (
        <div className="flex flex-row gap-2">
            {boxData.inputTileArray.map((tileData, idx) => {
                return <InputTile key={idx} tileData={tileData} />
            })}
        </div>
    )
}

export default InputBox