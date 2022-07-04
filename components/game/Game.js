import { useState, useEffect } from "react"

import Square from "./Square"
import { Patterns } from "./Patterns"

import toast from "react-hot-toast"

import { tensor } from "@tensorflow/tfjs"

const Game = ({ start, setStart, currentModel }) => {

  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""])
  const [player, setPlayer] = useState("O")
  const [result, setResult] = useState({winner : "none", state: "none"})
  
  const getBoardAsTensor = () => {
    let inputArray = []
    board.forEach((value) => {
        if (value === "X") {
            inputArray.push(1)
        }
        else if (value === "O") {
          inputArray.push(-1) 
        }
        else {
            inputArray.push(0)
        }
    })
    let inputTensor = tensor(inputArray)
    inputTensor = inputTensor.reshape([3, 3])
    inputTensor = inputTensor.expandDims(0)
    inputTensor = inputTensor.reshape([-1, 3, 3, 1])

    return inputTensor
  }

  const checkIfLegal = ( move ) => {
    if ( board[move] !== "") {
      return false
    }
    else {
      return true
    }
  }

  const argSort = ( value ) => {
    let decor = (v, i) => [v, i];          // set index to value
    let undecor = a => a[1];               // leave only index
    let argsort = arr => arr.map(decor).sort().map(undecor);

    const index = [0,1,2,3,4,5,6,7,8]

    const order = argsort(value);
    const newArray = order.map(i => index[i])
    newArray.reverse()

    return newArray
  }

  const checkWinner = () => {
    Patterns.forEach((currentPattern) => {
        const firstPlayer = board[currentPattern[0]]
        if (firstPlayer === "") return;
        let foundWinningPattern = true

        currentPattern.forEach((index) => {
            if (board[index] !== firstPlayer) {
                foundWinningPattern = false
            }
        })
        if (foundWinningPattern) {
            setResult({winner: player, state: "won"})
        }
    })
  }

  const checkTie = () => {
    let filled = true
    board.forEach((square) => {
        if (square === "") {
            filled = false
        }
    })

    if (filled) {
        setResult({winner: "no one", state: "tie"})
    }
  }

  const chooseSquare = (square) => {
    setBoard(
        board.map((value, index) => {
            if (index === square && value === "") {
              return player
            }
            return value
        })
    )
  }

  const restartGame = () => {
    setBoard(["", "", "", "", "", "", "", "", ""])
    setPlayer("O")
    setStart(false)
  }

  useEffect(() => {

    if (player === "X" && currentModel) {
    const inputTensor = getBoardAsTensor()
    let preds = currentModel.predict(inputTensor);
    preds = preds.reshape([-1])

    const argPreds = argSort(preds.arraySync())

    let choice
    for (let i = 0; i < argPreds.length; i++) {
      choice = argPreds[i]
      const legal = checkIfLegal(choice)
      
      if (legal === true) {
        break
      }
    }
    chooseSquare(choice)
    }
  
  },[player])

  useEffect(() => {
    if (start === true) {

    checkTie()
    checkWinner()

    if (player === "X") {
      setPlayer("O")
    } else {
      setPlayer("X")
    }
  }
  }, [board, start])

  useEffect(() => {

  if (result.state !== 'none') {
    if (result.state === 'tie') {
      toast(`The game is a tie!`, {
        icon: '🧐',
      });
    }
    else {
      toast(`Player ${result.winner} is the Winner!`, {
        icon: '👏',
      });
    }

    restartGame();
  }
  }, [result])
  
  return(
    <div className="flex flex-col w-96 h-96 space-y-2">
        <div className="flex h-1/3 space-x-2">
          <Square value={board[0]} chooseSquare={() => chooseSquare(0)} start={start}/>
          <Square value={board[1]} chooseSquare={() => chooseSquare(1)} start={start}/>
          <Square value={board[2]} chooseSquare={() => chooseSquare(2)} start={start}/>
        </div>

        <div className="flex h-1/3 space-x-2">
          <Square value={board[3]} chooseSquare={() => chooseSquare(3)} start={start}/>
          <Square value={board[4]} chooseSquare={() => chooseSquare(4)} start={start}/>
          <Square value={board[5]} chooseSquare={() => chooseSquare(5)} start={start}/>    
        </div>

        <div className="flex h-1/3 space-x-2">
          <Square value={board[6]} chooseSquare={() => chooseSquare(6)} start={start}/>
          <Square value={board[7]} chooseSquare={() => chooseSquare(7)} start={start}/>
          <Square value={board[8]} chooseSquare={() => chooseSquare(8)} start={start}/>
        </div>

        {/* <button onClick={predict}>LOL</button> */}
    </div>

  )
}

export default Game