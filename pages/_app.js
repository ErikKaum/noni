import { userContext, agentContext } from '../lib/context';
import { useUserData, useAgentData } from '../lib/hooks';
import '../styles/globals.css'


function MyApp({ Component, pageProps }) {
  const { userValue } = useUserData();
  const { agentValue } =  useAgentData(userValue);

  return(
    <userContext.Provider value={userValue} >
      <agentContext.Provider value={agentValue}>
        <Component {...pageProps} />
      </agentContext.Provider>
    </userContext.Provider>
  )
}

export default MyApp
