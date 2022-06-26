
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import Feedback from "../lib/contracts/Feedback.json"
import { CONTRACT_ADDRESS_FEEDBACK } from "../lib/constants"
import toast from "react-hot-toast"
const DashBoard = () => {

    const [contract, setContract] = useState(null)
    const [feedback, setFeedback] = useState([])

    useEffect(() => {
       const getContract = async() => {

            const { ethereum } = window

            const chain = ethereum.chainId
            if (chain == "0x4") {              
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS_FEEDBACK, Feedback.abi, signer);
                
                console.log(contract)
                const feedback = await contract.getFeedBack()

                setFeedback([feedback[0].toNumber(),feedback[1].toNumber()])
                setContract(contract)
                }
            else {
                return
            }
        }
        getContract()
    },[])

    const incrementLike = async () => {
        await contract.like()
        toast('Thank you!', {
            icon: '👏',
          });
    }

    const incrementDislike = async () => {
        await contract.dislike()
        toast('Thank you! Please give more feedback on Twitter', {
            icon: '👏',
          });
    }


    return(
        // check later if h-screen causes problems  
        <div className="w-3/4 ml-[calc(25%)] h-screen flex flex-col justify-center items-center">
            <div className="flex w-full my-24 items-center justify-center">
                <h1 className="text-4xl font-bold">DASHBOARD</h1>
            </div>

            <div className="flex flex-col w-full h-full justify-center items-center">

                <div className="flex flex-col items-center mb-10">
                    <h2 className="text-2xl font-medium">Connect your wallet on tell me what you think!</h2>
                    <p>on-chain of course 😉</p>
                </div>

                <div className="flex w-3/4 justify-between ">
                    <button onClick={incrementLike} className="border-2 border-black text-lg font-medium px-10 py-2 bg-noni-pink hover:bg-noni-lb ">
                        I LIKE 
                    </button>

                    <button onClick={incrementDislike} className="border-2 border-black text-lg font-medium px-10 py-2 bg-noni-pink hover:bg-noni-lb ">
                        I DO NOT LIKE 
                    </button>
                </div>

                <div className="flex w-3/4 justify-between">
                    <p>Like counter: {feedback[0]}</p>

                    <p>Dislike counter: {feedback[1]}</p>
                </div>

            </div>
        </div>
        
    )
}

export default DashBoard
