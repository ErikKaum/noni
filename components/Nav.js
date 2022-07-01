import Link from "next/link"

import { ethers } from "ethers"
import { useContext } from "react"
import { Toaster, toast } from "react-hot-toast"

import { userContext } from "../lib/context"

const Nav = ({setPage}) => {

  const { account, setAccount } = useContext(userContext)

  const connectWallet = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0])
        console.log('connected to:', accounts[0])

        const chain = ethereum.chainId
        if (chain !== "0x4") {

          toast('and then reload the page!', {
            icon: '🔃',
          });

          toast('Looks like you are not on Rinkeby! Switch please.', {
            icon: '👀',
          });
          
        }
      }   

    } catch(e) {
      console.log(e)
      toast.error('No metamask found 🤷')
    }
  }

  
  const Text = () => {
    if (account) {
      return(
        <p> 🟢 Connect wallet</p>
      ) 
    } else {
    return(
      <p> 🔴 Connect wallet</p>
    )
    }
  }


  return(
    
    <div className="fixed flex flex-col w-1/4 h-screen border-r-2 border-black justify-around items-center">
    <Toaster/>
    
    <div className="flex flex-col space-y-10 w-3/5">
      <button onClick={() => setPage("dashboard")} className="border-2 border-black w-full text-lg font-medium py-2 bg-noni-pink hover:bg-noni-lb ">
        DASHBOARD 
      </button>
  
      <button onClick={() => setPage("train")} className="border-2 border-black w-full text-lg font-medium py-2 bg-noni-pink hover:bg-noni-lb ">
        TRAIN 🦾
      </button>

      <button onClick={() => setPage("battle")} className="border-2 border-black w-full text-lg font-medium py-2 bg-noni-pink hover:bg-noni-lb ">
        BATTLE ⚔️
      </button>

      <button onClick={() => setPage("nonis")} className="border-2 border-black w-full text-lg font-medium py-2 bg-noni-pink hover:bg-noni-lb ">
        MY NONIS
      </button>

      <Link href={"/market-place"} passHref>
        <button className="border-2 border-black w-full text-lg font-medium py-2 bg-noni-pink hover:bg-noni-lb ">
          MARKET PLACE
        </button>
      </Link>

    </div>

    <div className="flex w-3/5">
      <button onClick={connectWallet} className="border-2 border-black w-full text-lg font-medium py-2 bg-noni-lb hover:bg-noni-pink"><Text/></button>
    </div>
  </div>
  )
}

export default Nav