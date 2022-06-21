import { useState } from "react"
import { ethers } from "ethers"

import Nav from "../../components/Nav";

import DashBoard from "../../components/DashBoard"
import Nonis from "../../components/Nonis";
import Battle from "../../components/Battle";
import Train from "../../components/Train";
import Etc from "../../components/Etc";

import { useContext } from "react";
import { userContext } from "../../lib/context";

export default function Home() {
  
  const { account, setAccount } = useContext(userContext)
  const [page, setPage] = useState("dashboard")


  const RenderMode = () => {
    if (page === "dashboard") {
      return <DashBoard />
    } else if (page == "nonis") {
      return <Nonis />
    } else if (page == "battle") {
      return <Battle />
    } else if (page == "train") {
      return <Train />
    } else {
      return <Etc />
    }
  }

  return (
    <div className="w-full min-h-screen h-full bg-noni-blue">
      <Nav setPage={setPage}/>
      {account && <RenderMode/>}
      {!account &&
      <div className="w-3/4 ml-[calc(25%)] h-screen flex justify-center items-center">
        <h1 className="text-4xl font-bold">Wallet is not connected 🤷</h1>
      </div>} 
    </div>
  )
}





