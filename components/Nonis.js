import Link from "next/link"

import { useEffect, useState, useContext } from "react"
import { userContext, agentContext } from "../lib/context"

import { ethers } from "ethers";

import { CONTRACT_ADDRESS_NONI } from "../lib/constants";
import Noni from "../lib/contracts/Noni.json"


const Nonis = () => {

  const [nonis, setNonis] = useState([])
  const { account, setAccount } = useContext(userContext)
  const { agent, setAgent} = useContext(agentContext)

  useEffect(() => {
    
    const getNonis = async () => {
      const { ethereum } = window

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS_NONI, Noni.abi, signer);
      
      const noniArray = []

      const balance = await contract.balanceOf(account)
      for (let i = 0; i < balance; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(account, i);
        const uri = await contract.tokenURI(tokenId.toNumber())
        
        const json = window.atob(uri.substring(29));
        const result = JSON.parse(json);
        
        const noni = {
          tokenId: tokenId.toNumber(),
          name: result.name,
          elo : result.elo,
          image: result.imageURI,
          contentID: result.contentID,
        } 
        noniArray.push(noni)
      }

      setNonis(noniArray)
    }

    getNonis()
  },[account])


  console.log(nonis)

  return(
    <div className="w-3/4 ml-[calc(25%)] h-full flex flex-col justify-start items-center">
      
      <div className="flex w-full my-24 items-center justify-center">
        <h1 className="text-4xl font-bold">MY NONIS</h1>
      </div>
      
      <div className="flex flex-col">

      {/* If there are no nonis in wallet */}
      {nonis.length === 0 &&
      <div className="flex flex-col items-center justify-center">
        
        <h2 className="text-3xl font-semibold mb-10">You don&apos;t have nonis, go to the market place to get some!</h2>
        
        <Link href={"/market-place"} passHref>
          <button className="border-2 border-black text-xl font-medium py-2 px-5 bg-noni-lb animate-bounce">
            Market place
          </button>   
        </Link>
      </div>
      }

      {/* If there are nonis in wallet */}
      {nonis.length > 0 &&
      <>
      <div className="flex w-full items-center justify-between mb-5">
        <Link href={"/market-place"} passHref>
          <button className="border-2 border-black text-xl font-medium py-2 px-5 bg-noni-lb hover:animate-pulse">
            Market place
          </button>   
        </Link>

        <Link href={"/app/breed"} passHref>
          <button className="border-2 border-black text-xl font-medium py-2 px-5 bg-noni-lb hover:animate-pulse">
            Breed
          </button>   
        </Link>
      </div>

      <div className="flex w-full h-6/5 justify-center">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
          
          {nonis.map((noni) => {

            return(
            <div key={noni.name} className="flex flex-col">
              <div className="flex w-56 h-56 border-2 border-black p-2 mb-2 bg-slate-100">
                <img src={noni.image} alt={noni.name} />              
              </div>

              <div className="flex flex-col mb-5">
                <p className="text-center font-medium">{noni.name}</p>
                <p>ELO score: {noni.elo}</p>
              </div>

              <div className="flex justify-between">
                <button className="border border-black-2 hover:opacity-60">
                  List for sale
                </button>

                <button onClick={() => setAgent(noni)} className="border border-black-2 hover:opacity-60">
                  Activate
                </button>
 
              </div> 
  
            </div>
            )
          })}

        </div>
      </div>
      </>}

      </div>
    </div>
  )
}

export default Nonis
