
import { useContext, useState } from "react"
import { userContext, agentContext } from "../lib/context"

import Game from "./game/Game"

import * as tf from "@tensorflow/tfjs" 

const Train = () => {
  const { agent, setAgent } = useContext(agentContext)
  const { account, setAccount } = useContext(userContext)
  const [start, setStart] = useState(false)

  return(
      <div className="w-3/4 ml-[calc(25%)] h-full flex flex-col justify-center items-center">
        <div className="flex w-full my-24 items-center justify-center">
          <h1 className="text-4xl font-bold">TRAIN</h1>
        </div>

        {agent &&
        <div className="flex w-full justify-center space-x-5">
          <Game start={start} setStart={setStart} currentModel={agent.model}/>
          <div className="flex flex-col w-1/3 items-center justify-around">

              <div className="flex flex-col items-center"> 
                <h2 className="text-xl font-semibold">GAME stats</h2>
                <p>Your (not yet) are playing with: {agent.name}</p>
              </div>

              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold">How to play?</h2>
                <p>Click the squares to play Tic Tac Toe.</p>
                <p>Currently you play against yourself 😆 BUT</p>  
                <p>in the future you&apos;ll play against your Noni!</p>  
              </div>
            
            <button onClick={() => setStart(true)} className="border-2 border-black w-2/3 text-lg font-medium py-2 bg-noni-lb hover:bg-noni-pink">START GAME</button>
            
            </div>
        </div>
        }
        
        {!agent &&
        <div className="flex flex-col w-full items-center"> 
          <h2 className="text-4xl font-semibold">Activate Noni from My Nonis</h2>
          <p className="text-4xl">👈</p>
        </div>
        }

      </div>

      
    )
}

export default Train