import Link from "next/link"

import MarketNav from "../components/MarketNav"
import { useEffect, useState, useContext } from "react"
import { userContext, agentContext } from "../lib/context"


const MainMarket = () => {
  const [nonis, setNonis] = useState([])
  
  useEffect(() => {
    const getNonis = async () => {
        
        const noni = {
          tokenId: 0,
          name: "0xNoni0",
          elo : 400,
          image: "imageURI",
          contentID: "contentID",
        }
        const noniArray = [noni, noni, noni, noni, noni]
        setNonis(noniArray)
      }
  
      getNonis()
  
  },[])

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
                {/* <img src={noni.image} alt={noni.name} /> */}
              </div>

              <div className="flex flex-col mb-5">
                <p className="text-center font-medium">{noni.name}</p>
                <p>Price: 10ETH </p>
                <p>ELO score: {noni.elo}</p>
              </div>

              <div className="flex justify-between">
                <button className="border border-black-2 hover:opacity-60">
                  Buy
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


