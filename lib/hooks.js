import { useEffect, useState, useMemo } from "react"
import { ethers } from "ethers"

export const useUserData = () => {
    const [account, setAccount] = useState("")   

    useEffect(() => {
        const checkConnection = async() => {
            try {
              const { ethereum } = window
              if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const addresses = await provider.listAccounts(); 
                if (addresses) {
                setAccount(addresses[0])
                }
              }
            } catch(e) {
              console.log(e)
            }
          }
        checkConnection();
    },[account])

    const userValue = useMemo(
        () => ({ account, setAccount }), 
        [account]
    );

    return { userValue }
}

export const useAgentData = () => {
    const [agent, setAgent] = useState(null)

    const agentValue = useMemo(
        () => ({ agent, setAgent }), 
        [agent]
    );

    return { agentValue }
}