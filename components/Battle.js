import { ethers } from "ethers";

import { useContext, useEffect, useState } from "react"
import { userContext, agentContext } from "../lib/context"

import GameAbi from "../lib/contracts/Game.json"
import { CONTRACT_ADDRESS_GAME } from "../lib/constants";

import BattleGame from "./game/BattleGame"
import toast from "react-hot-toast";


const Battle = () => {
  const { agent, setAgent } = useContext(agentContext)
  const { account, setAccount } = useContext(userContext)
  const [start, setStart] = useState(false)
  const [allGames, setAllGames] = useState([])
  const [activeGame, setActiveGame] = useState()
  const [player2, setPlayer2] = useState(null)
  const [currentOponent, setCurrentOponent] = useState("Not decided yet")
  const [knob, setKnob] = useState(false)

  useEffect(() => {
    const getChallenges = async() => {
      const { ethereum } = window

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS_GAME, GameAbi.abi, signer);
      const incomingChallenges =  await contract.getMyChallenges()
      const createdChallenges = await contract.getMyGames()
    
      const currentGames = incomingChallenges.concat(createdChallenges) 
      let tempGames = [] 

      for (const gameId of currentGames) {
        const game = await contract.getGame(gameId)

        let verified 
        game.players.forEach((item, idx) => {
          if (item === account) {
            if (game.verification[idx] === true) {
             verified = true 
            } else {
              verified = false
            }
          }
        })
        // there must be a better way of doing this
        let writtenState
        if (game.state === 3) {
          writtenState = 'still going'
        } else if (game.state === 2) {
          writtenState = 'tie'
        } else if (game.state === 0 && game.players[0] === account) {
          writtenState = 'won' 
        } else if (game.state === 0 && game.players[1] === account) {
          writtenState = 'lost' 
        } else if (game.state === 1 && game.players[1] === account) {
          writtenState = 'won' 
        } else if (game.state === 1 && game.players[0] === account) {
          writtenState = 'lost' 
        }

        const tempGame = {
          gameId: gameId.toNumber(),
          game : game.game,
          players : game.players,
          nonis : game.nonis,
          state : game.state,
          turn : game.turn,
          verification : game.verification,
          userVerified : verified,
          writtenState : writtenState
        }
        tempGames.push(tempGame)
      }
      setAllGames(tempGames)
    }
    getChallenges()
  },[])

  const activateGame = async (gameId) => {
    allGames.forEach((game) => {
      let opponent 
      if (gameId == game.gameId) {
        if (game.players[0] !== account) {
          opponent = game.nonis[0]
        }
        else {
          opponent = game.nonis[1]
        } 
        setActiveGame(game)
        setCurrentOponent('0xNoni'+opponent)
      }
    })
  }

  const challenge = async() => {
    const address = ethers.utils.isAddress(player2)
    if (address === true) {
      const { ethereum } = window
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS_GAME, GameAbi.abi, signer);
      await contract.initGame(player2)
    } else {
      toast('Not vaild address', {
        icon: '🤔',
      });
    }
  }

  const verify = async(gameId) => {
    const { ethereum } = window

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS_GAME, GameAbi.abi, signer);

    await contract.verifyGame(gameId, agent.tokenId)

  }

  const move = async() => {
    const { ethereum } = window

    // [0, 4, 8],

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS_GAME, GameAbi.abi, signer);
    
    const lol = await contract.makeMove(8, 0)
  }

  const checkWinner = async() => {
    const { ethereum } = window

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS_GAME, GameAbi.abi, signer);
    
    const lol = await contract.getMyChallenges()
  }


  return(
      <div className="w-3/4 ml-[calc(25%)] h-full flex flex-col justify-center items-center">
        <div className="flex w-full my-24 items-center justify-center">
          <h1 className="text-4xl font-bold">BATTLE</h1>
        </div>

        {agent &&
        <div className="flex w-full justify-center space-x-10">

          <div className="flex flex-col space-y-5"> 
            <div className="flex flex-col items-center">
              
              {activeGame &&  
              <>
                <h2 className="text-xl font-semibold">GAME {activeGame.gameId}</h2>
                <p>Your are Battling with: {agent.name}</p>
                <p>against: {currentOponent}</p>
                <p>Game is: {activeGame.writtenState}</p>
              </>
              }
              
              {!activeGame &&  
              <>
                <h2 className="text-xl font-semibold">No game activated</h2>
              </>
              } 
            
            </div>

            <BattleGame activeGame={activeGame} start={start} setStart={setStart} />
          </div>

          <div className="flex flex-col w-1/3 items-center justify-around">

              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold">How to play?</h2>
                <p>It&apos;s Tic Tac Toe not rocket science 🚀</p>
                <p>Either challenge someone from the button below</p>
                <p className="mb-5">or accept a challenge from the list</p>
                
                <button onClick={challenge} className="border-2 border-black w-2/3 text-lg font-medium py-2 mb-2 bg-noni-lb hover:bg-noni-pink">
                  CREATE CHALLENGE
                </button>
                <input onChange={e => setPlayer2(e.target.value)} type="text" placeholder="Your friends wallet address" className="text-black p-1 w-2/3"></input>

              </div>

              <div className="flex flex-col w-full items-center py-4">
                {allGames && allGames.length > 0 && 
                <h2 className="text-xl font-semibold mb-2">Your current games!</h2>
                }
                {allGames && allGames.length === 0 &&
                <h2 className="text-xl font-semibold mb-2">You have no active games, go challenge someone!</h2>
                }
                {allGames && allGames.map((game) => {
                  return(
                    <div key={game.gameId} className="flex w-full items-center justify-between">
                      <p>Game {game.gameId}</p>
                      <div className="flex w-1/2 items-center justify-between">
                        <button onClick={() => activateGame(game.gameId)} className="border border-white mr-2 mb-2 p-1">Activate</button>

                        <div className="flex w-full items-center justify-center">
                        {!game.userVerified && 
                          <button onClick={() => verify(game.gameId)} className="border border-white p-1 mb-2">Accept challenge</button>
                        }

                        {game.userVerified && 
                          <p className="border border-white p-1 text-center mb-2">Challenge accepted</p>
                        }
                        </div>
                        </div>
                    </div>
                  )
                })}
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

export default Battle