import { ethers } from "ethers";

import { useContext, useState } from "react"
import { userContext, agentContext } from "../lib/context"

import GameAbi from "../lib/contracts/Game.json"
import { CONTRACT_ADDRESS_GAME } from "../lib/constants";

import Game from "./game/Game"


const Battle = () => {
  const { agent, setAgent } = useContext(agentContext)
  const { account, setAccount } = useContext(userContext)
  const [start, setStart] = useState(false)

  const init = async() => {
    const { ethereum } = window

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS_GAME, GameAbi.abi, signer);
    // await contract.initGame("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    const game = await contract.getGame(1)
    console.log(game)
  }

  const verify = async() => {
    const { ethereum } = window

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS_GAME, GameAbi.abi, signer);
    
    const lol = await contract.verifyGame(0)
    console.log(lol)
  }

  const move = async() => {
    const { ethereum } = window

    // [0, 4, 8],

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS_GAME, GameAbi.abi, signer);
    
    const lol = await contract.makeMove(8, 0)
    console.log(lol)
  }

  const checkWinner = async() => {
    const { ethereum } = window

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS_GAME, GameAbi.abi, signer);
    
    const lol = await contract.getMyChallenges()
    console.log(lol)
  }


  return(
      <div className="w-3/4 ml-[calc(25%)] h-full flex flex-col justify-center items-center">
        <div className="flex w-full my-24 items-center justify-center">
          <h1 className="text-4xl font-bold">BATTLE</h1>
        </div>

        {agent &&
        <div className="flex w-full justify-center space-x-5">
          {/* <Game start={start} setStart={setStart} currentModel={agent.model}/> */}
          <div className="flex flex-col w-1/3 items-center justify-around">

              <div className="flex flex-col items-center"> 
                <h2 className="text-xl font-semibold">GAME stats</h2>
                <p>Your are Battling with: {agent.name}</p>
              </div>

              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold">How to play?</h2>
                <p>It&apos;s Tic Tac Toe not rocket science 🚀</p>
                <p>Hit the button below and start playing!</p>  
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

        <button onClick={init}>init</button>
        <button onClick={verify}> verify</button>
        <button onClick={checkWinner}> move</button>

      </div>

      
    )
}

export default Battle