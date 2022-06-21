
import Game from "./game/Game"

const Battle = () => {

  return(
      <div className="w-3/4 ml-[calc(25%)] h-full flex flex-col justify-center items-center">
        <div className="flex w-full my-24 items-center justify-center">
          <h1 className="text-4xl font-bold">BATTLE</h1>
        </div>

        <Game/>
      </div>
    )
}

export default Battle