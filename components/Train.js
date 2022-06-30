
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

        <Game/>

        <div className="flex flex-col mt-10">
          {/* If agent is choses */}
          {agent &&
          <>
            <p>You are training with {agent.name}</p>
            <button onClick={getNeuralNetwork}>
              View encrypted message
            </button>
          </>
          }

          {/* If agent object is empty */}
          {!agent && 
          <p>Activate agent from My Nonis</p>
          }
        </div>
      </div>

      
    )
}

export default Train