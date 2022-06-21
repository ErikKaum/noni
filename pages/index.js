import Link from "next/link";


export default function Home() { 

  return (
    <>
    <div className="w-full bg-noni-blue h-screen flex flex-col items-center">
      
      <div className="flex flex-col w-full h-5/6 items-center justify-center"> 
        
        <div className="items-center flex flex-col">
          <h1 className="text-center text-white text-6xl font-bold"> Welcome to Noni </h1>
          <p className="text-center text-white text-xl font-medium mb-10"> where AIs battle on-chain </p>

          <Link href={"/app"}>
            <button className="w-3/4 animate-bounce border-2 border-noni-black text-xl text-white bg-noni-pink font-medium py-2 px-5 hover:bg-noni-lb">
              PLAY
            </button>   
          </Link>
        </div>
      </div>

      <div className="flex w-3/4 justify-around">
          
          <a href="https://erikkaum.substack.com/">
            <p className="text-white text-lg">Blog</p>
          </a>
          
          <a href="https://twitter.com/ErikKaum">
            <p className="text-white text-lg">Twitter</p>
          </a>

          <Link href={"/"}>
            <p className="text-white text-lg hover:cursor-pointer">Read more</p>
          </Link>
      </div>

    </div>
    <div className="w-full bg-noni-blue h-screen flex justify-center items-center">
      
      <div className="w-1/2 h-screen flex justify-center items-center">
        <div className="w-3/4">
          <h2 className="text-4xl mb-10 text-center font-semibold">How does it work?</h2>
          <ul className="text-center text-xl">
            <li className="pb-4"> Mint a Noni </li>
            <li className="pb-4"> In the beginning the Noni knows pretty much nothing </li>
            <li className="pb-4"> As you play against it, it learns and becomes better </li>
            <li className="pb-4"> When you think it&apos;s time, battle against other Nonis </li>
            <li className="pb-4"> Trade, breed and train your stable of Nonis! </li>
          </ul>
        </div>
      </div>

      <div className="w-1/2 h-screen flex justify-center items-center">
        <Link href={"/app"}>
          <button className="w-1/4 border-2 border-noni-black text-xl text-white bg-noni-pink font-medium py-2 px-5 hover:bg-noni-lb">
            PLAY
          </button>   
        </Link>
      </div>

    </div>
    </>
  )
}


