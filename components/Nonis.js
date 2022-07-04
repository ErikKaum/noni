import Link from "next/link"

import { useEffect, useState, useContext } from "react"
import { userContext, agentContext } from "../lib/context"

import { ethers } from "ethers";

import { CONTRACT_ADDRESS_NONI } from "../lib/constants";
import Noni from "../lib/contracts/Noni.json"

import { bufferToHex } from 'ethereumjs-util'
import { encrypt } from '@metamask/eth-sig-util';
import { create } from 'ipfs-http-client'

import { loadLayersModel, io } from "@tensorflow/tfjs";

import toast from "react-hot-toast";

const Nonis = () => {

  const [nonis, setNonis] = useState([])
  const [nonisForSale, setNonisForSale] = useState([])
  const { account, setAccount } = useContext(userContext)
  const { agent, setAgent} = useContext(agentContext)

  const base64ToArrayBuffer = (base64) => {
    const len = base64.length;
    const bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = base64.charCodeAt(i);
    }
    return bytes.buffer;
  }

  const makeNoniActive = async(noni) => {
    toast('Wait a minute for activating the Noni', {
      icon: '⌛',
    }); 

    const resModel = await fetch(`https://gateway.pinata.cloud/ipfs/${noni.modelID}`) 
    const dataModel = await resModel.json()

    const resWeights = await fetch(`https://gateway.pinata.cloud/ipfs/${noni.weightsID}`) 
    const dataWeights = await resWeights.json()

    let decryptedModel  = await ethereum.request({method: 'eth_decrypt', params: [dataModel, account]})

    let decryptedWeights  = await ethereum.request({method: 'eth_decrypt', params: [dataWeights, account]})
    decryptedWeights = base64ToArrayBuffer(decryptedWeights)

    const modelFile = new File([decryptedModel], "model.json")
    const weightFile = new File([decryptedWeights], "weights.bin")

    const model = await loadLayersModel(io.browserFiles(
      [modelFile, weightFile]));

    noni.model = model
    setAgent(noni)
     
    toast(`${noni.name} Activated!`, {
      icon: '⚔️',
    }); 
  }

  const changeSaleState = async (tokenId, state) => {
    const { ethereum } = window

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS_NONI, Noni.abi, signer);

    contract.setSaleState(tokenId, state)
  }

  const arrayBufferToBase64 = (buffer) => {
    const binary = '';
    const bytes = new Uint8Array( buffer );
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }

  const encryptForBuyer = async (to, modelID, weightsID) => {

    const resModel = await fetch(`https://gateway.pinata.cloud/ipfs/${modelID}`) 
    const dataModel = await resModel.json()

    const resWeights = await fetch(`https://gateway.pinata.cloud/ipfs/${weightsID}`) 
    const dataWeights = await resWeights.json()

    let decryptedModel  = await ethereum.request({method: 'eth_decrypt', params: [dataModel, account]})
    let decryptedWeights  = await ethereum.request({method: 'eth_decrypt', params: [dataWeights, account]})

    const buffer = ethers.utils.arrayify(to)
    const pubKey = arrayBufferToBase64(buffer)

    const encryptedModel = bufferToHex(
      Buffer.from(
        JSON.stringify(
          encrypt({
            publicKey: pubKey,
            data: decryptedModel,
            version: 'x25519-xsalsa20-poly1305',
          })
        ),
        'utf8'
      )
    );

    const encryptedWeights = bufferToHex(
      Buffer.from(
        JSON.stringify(
          encrypt({
            publicKey: pubKey,
            data: decryptedWeights,
            version: 'x25519-xsalsa20-poly1305',
          })
        ),
        'utf8'
      )
    );

    const client = create('https://ipfs.infura.io:5001/api/v0')
    const addedModel = await client.add(JSON.stringify(encryptedModel))
    const newModelID = addedModel.path
    
    const addedWeights = await client.add(JSON.stringify(encryptedWeights))
    const newWeightsID = addedWeights.path 
    
    return { newModelID, newWeightsID }
  }

  const acceptBid = async (to, pubKey, tokenId, modelID, weightsID) => {
    const { ethereum } = window

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS_NONI, Noni.abi, signer);

    const { newModelID, newWeightsID } = await encryptForBuyer(pubKey, modelID, weightsID)

    contract.transfer(account, to, tokenId, newModelID, newWeightsID)
  }

  useEffect(() => {
    
    const getNonis = async () => {
      const { ethereum } = window

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS_NONI, Noni.abi, signer);
      
      const noniArray = []
      const nonisForSaleArray = []

      const balance = await contract.balanceOf(account)
      for (let i = 0; i < balance; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(account, i);
        const uri = await contract.tokenURI(tokenId.toNumber())
        
        const json = window.atob(uri.substring(29));
        const result = JSON.parse(json);
        
        const bidArray = []
        const bids = await contract.getBids(tokenId)

        // probably also want to extract the wallet key of the bidder
        for (let j= 0; j < bids.length ; j++) {
          const bid = bids[j].bid.toNumber()
          const bidder = bids[j].bidder
          const pubKey = bids[j].pubkey
          bidArray.push({
            bid : bid,
            bidder : bidder,
            pubKey : pubKey 
          })
        }
        
        const noni = {
          tokenId: tokenId.toNumber(),
          name: result.name,
          elo : result.elo,
          image: result.imageURI,
          modelID: result.modelID,
          weightsID: result.weightsID,
          forSale: result.forSale,
          bids : bidArray,
          model : null
        }
        if (noni.forSale == 0) {
          noniArray.push(noni)
        }
        else {
          nonisForSaleArray.push(noni)
        }
      }
      setNonis(noniArray)
      setNonisForSale(nonisForSaleArray)
    }

    getNonis()
  },[account])


  return(
    <div className="w-3/4 ml-[calc(25%)] h-full flex flex-col justify-start items-center">
      
      <div className="flex w-full my-24 items-center justify-center">
        <h1 className="text-4xl font-bold">MY NONIS</h1>
      </div>
      
      <div className="flex flex-col">

      {/* If there are no nonis in wallet */}
      {nonis.length === 0 && nonisForSale.length === 0 &&
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
      {(nonis.length + nonisForSale.length) > 0 &&
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

      <div className="flex w-full h-6/5 justify-center mb-10">
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
                <button onClick={() => changeSaleState(noni.tokenId, true)} className="p-1 border border-black-2 hover:opacity-60">
                  List for sale
                </button>

                <button onClick={() => makeNoniActive(noni)} className="p-1 border border-black-2 hover:opacity-60">
                  Activate
                </button>
 
              </div> 
  
            </div>
            )
          })}

        </div>
      </div>

      <div className="flex w-full items-center justify-center mb-5">
        <h2 className="text-2xl font-semibold">The Nonis you listed for sale</h2>
      </div>

      <div className="flex w-full h-6/5 justify-center">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
          
          {nonisForSale.map((noni) => {

            return(
            <div key={noni.name} className="flex flex-col">
              <div className="flex w-56 h-56 border-2 border-black p-2 mb-2 bg-slate-100">
                <img src={noni.image} alt={noni.name} />              
              </div>

              <div className="flex flex-col mb-5">
                <p className="text-center font-medium">{noni.name}</p>
                <p>ELO score: {noni.elo}</p>
              </div>

              <div className="flex justify-between mb-5">
                <button onClick={() => changeSaleState(noni.tokenId, false)} className="p-1 border border-black-2 hover:opacity-60">
                  Delist from sale
                </button>

                <button onClick={() => makeNoniActive(noni)} className="p-1 border border-black-2 hover:opacity-60">
                  Activate
                </button> 
              </div>

              <hr className="mb-5"/>

              <h3 className="text-center">Bids</h3>

              <div className="flex flex-col space-y-3">
                {noni.bids.map((bid) => {
                  return(
                  <div key={bid.bidder} className="flex justify-between">
                    <p>Bid: {bid.bid}</p>
                    <button onClick={() => acceptBid(bid.bidder, bid.pubKey, noni.tokenId, noni.modelID, noni.weightsID)} className="p-1 border border-black-2 hover:opacity-60">
                      Accept
                    </button>
                  </div>
                  )
                })}
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
