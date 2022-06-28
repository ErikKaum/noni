import Link from "next/link"

import MarketNav from "../components/MarketNav"
import { useEffect, useState, useContext } from "react"
import { userContext, agentContext } from "../lib/context"

import { ethers } from "ethers";
import { CONTRACT_ADDRESS_NONI } from "../lib/constants";
import Noni from "../lib/contracts/Noni.json"

import toast from "react-hot-toast";

const MainMarket = () => {
  const [nonis, setNonis] = useState([])
  const { account, setAccount } = useContext(userContext)
  const [bidAmount, setBidAmount] = useState(null)

  const bid = async (tokenId) => {
    // Have to implement real user input checking later
    let amount
    try {
      amount = parseInt(bidAmount, 10)
    } catch {
      toast.error("Bid has to be an integer")
      return
    }
    const { ethereum } = window

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS_NONI, Noni.abi, signer);

    const encryptionPublicKey =  await ethereum.request({
      method: 'eth_getEncryptionPublicKey',
      params: [account], // you must have access to the specified account
    })
    const pubKey = Buffer.from(encryptionPublicKey, 'base64');

    contract.placeBid(tokenId, amount, pubKey)
  }
  
  useEffect(() => {
    
    const getNonis = async () => {
      const { ethereum } = window

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS_NONI, Noni.abi, signer);
      
      const noniArray = []

      // Here we get ALL nonis in existance. Not opitmal
      // Pagination sometime in the future
      const count = await contract.getNumberOfNonis()
      for (let i = 0; i < count; i++) {
        const uri = await contract.tokenURI(i)
        
        const json = window.atob(uri.substring(29));
        const result = JSON.parse(json);
        
        const noni = {
          tokenId: i,
          name: result.name,
          elo : result.elo,
          image: result.imageURI,
          contentID: result.contentID,
          forSale: result.forSale,
        }
        if (noni.forSale == 1) {
          noniArray.push(noni)
        }
      }
      setNonis(noniArray)
    }
    getNonis()
  },[account])

  return(
    <div className="w-3/4 ml-[calc(25%)] h-full flex flex-col justify-center items-center">
      
      <div className="flex w-full my-24 items-center justify-center">
        <h1 className="text-4xl font-bold">MARKET PLACE</h1>
      </div>
      
      <div className="flex mb-10">
        <p className="text-xl font-medium">The place to buy and sell Nonis</p>
      </div>

      <div className="flex flex-col">

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
                <input onChange={e => setBidAmount(e.target.value)} type="text" placeholder="write bid amount here" className="text-black p-1"></input>
                <button onClick={() => bid(noni.tokenId, 10)} className="p-1 border border-black-2 hover:opacity-60">
                  Bid
                </button>

              </div> 
  
            </div>
            )
          })}

        </div>
      </div>

    </div>
    </div>

    )
}

const MarketPlace = () => {
    const { account, setAccount } = useContext(userContext)

    return (
        <div className="w-full min-h-screen h-full bg-noni-blue">
          <MarketNav />
          {account && <MainMarket/>}
          {!account &&
          <div className="w-3/4 ml-[calc(25%)] h-screen flex justify-center items-center">
            <h1 className="text-4xl font-bold">Wallet is not connected 🤷</h1>
          </div>} 
        </div>
      )}

export default MarketPlace


