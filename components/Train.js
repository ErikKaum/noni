
import { useContext } from "react"
import { userContext, agentContext } from "../lib/context"

import Game from "./game/Game"

const Train = () => {
  const { agent, setAgent } = useContext(agentContext)
  const { account, setAccount } = useContext(userContext)

  const getNeuralNetwork = async () => {
    // fetch the json AI that is in the ipfs CID of the NFT
    console.log(agent.contentID)
    // const res = await fetch(`https://gateway.pinata.cloud/ipfs/${agent.contentID}`)
    const res = await fetch(`https://ipfs.io/ipfs/${agent.contentID}`)
    const data = await res.json()

    // Decrypt with wallet
    const message = await ethereum.request({method: 'eth_decrypt', params: [data, account]})
    console.log(JSON.parse(message))
  }

  return(
      <div className="w-3/4 ml-[calc(25%)] h-full flex flex-col justify-center items-center">
        <div className="flex w-full my-24 items-center justify-center">
          <h1 className="text-4xl font-bold">TRAIN</h1>
        </div>

        {agent &&
        <div className="flex w-full justify-center space-x-5">
          <Game/>
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