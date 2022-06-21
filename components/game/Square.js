
const Square = ({value, chooseSquare}) => {
    return(
        <div 
          onClick={chooseSquare}
          className="cursor-pointer border-2 border-black bg-slate-100 hover:bg-noni-lb flex w-1/3 items-center justify-center">
            <p className="text-xl font-bold">{value}</p>
        </div>
    )
}

export default Square