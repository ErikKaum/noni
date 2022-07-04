
const Square = ({value, chooseSquare, start}) => {
    return(
        <div className="cursor-pointer border-2 border-black bg-slate-100 hover:bg-noni-lb flex w-1/3 items-center justify-center">
            <button disabled={value !== "" || start === false} onClick={chooseSquare} className="cursor-pointer w-full h-full">
                <p className="text-xl font-bold text-black">{value}</p>
            </button>
        </div>
    )
}

export default Square