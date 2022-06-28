import Link from "next/link"

import { ethers } from "ethers"
import { useContext, useEffect, useState } from "react"
import { Toaster, toast } from "react-hot-toast"

import { bufferToHex } from 'ethereumjs-util'
import { encrypt } from '@metamask/eth-sig-util';

import { create } from 'ipfs-http-client'

import { userContext } from "../lib/context"

import { CONTRACT_ADDRESS_NONI } from "../lib/constants";
import Noni from "../lib/contracts/Noni.json"

const Nav = () => {

  const [noniCount, setNoniCount] = useState(0)
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

  // This WILL need refactoring some day
  const encryptNoni = async() => {
    // fetch the json from the default AI
    const res = await fetch(`https://gateway.pinata.cloud/ipfs/QmNQ1ABiGJ9fv9wzxf1k1eKbc8nvXBQw7VnQSNedeRwwfo`)
    const data = await res.json()
    
    // encyrpt the data with the metamask key
    const encryptionPublicKey =  await ethereum.request({
      method: 'eth_getEncryptionPublicKey',
      params: [account], // you must have access to the specified account
    })

    const encryptedMessage = bufferToHex(
      Buffer.from(
        JSON.stringify(
          encrypt({
            publicKey: encryptionPublicKey,
            data: JSON.stringify(data),
            version: 'x25519-xsalsa20-poly1305',
          })
        ),
        'utf8'
      )
    );

    // load the encypted data to IPFS
    const client = create('https://ipfs.infura.io:5001/api/v0')
    const added = await client.add(JSON.stringify(encryptedMessage))
    const cid = added.path 

    return cid

  }

  const mintNoni = async() => {
    const { ethereum } = window

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS_NONI, Noni.abi, signer);
    
    const cid = await encryptNoni()
    console.log(cid)
    await contract.safeMint(cid)
  }

  useEffect(() => {
    const getNoniCount = async() => {
      const { ethereum } = window

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS_NONI, Noni.abi, signer);

      const noniCount = await contract.getNumberOfNonis()
      setNoniCount(noniCount.toNumber())
    }
    getNoniCount()
  },[])
  
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
    
    <div className="flex flex-col space-y-10 w-3/5 p-5 border border-white">

      <h2 className="text-center font-bold text-2xl">THE MINT MACHINE</h2>
      <div className="flex flex-col">
        <p className="text-center font-medium text-base">{noniCount} Nonis Minted</p>
        <p className="text-center font-medium text-base">Go get yours</p>
      </div>
      <button onClick={mintNoni} className="border-2 border-black w-full text-lg font-medium py-2 hover:bg-noni-lb bg-noni-pink ">
        MINT 
      </button>
  
    </div>

    <div className="flex flex-col w-3/5 space-y-5">
      <button onClick={connectWallet} className="border-2 border-black w-full text-lg font-medium py-2 bg-noni-lb hover:bg-noni-pink">
        <Text/>
      </button>
      <div>
        <Link href={"/app"} passHref>
          <button className="border-2 border-black w-full text-lg font-medium py-2 bg-noni-lb hover:bg-noni-pink">
            Back to App
          </button>   
        </Link> 
      </div>
    </div>

  </div>
  )
}

export default Nav