import { useState, useEffect } from "react"

import Square from "./Square"
import { Patterns } from "./Patterns"

import toast from "react-hot-toast"

const Game = () => {
  
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""])
  const [player, setPlayer] = useState("O")
  const [result, setResult] = useState({winner : "none", state: "none"})
  
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
}

  useEffect(() => {
    checkTie()
    checkWinner()

    if (player === "X") {
      setPlayer("O")
    } else {
      setPlayer("X")
    }

  }, [board])

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
          <Square value={board[0]} chooseSquare={() => chooseSquare(0)}/>
          <Square value={board[1]} chooseSquare={() => chooseSquare(1)}/>
          <Square value={board[2]} chooseSquare={() => chooseSquare(2)}/>
        </div>

        <div className="flex h-1/3 space-x-2">
          <Square value={board[3]} chooseSquare={() => chooseSquare(3)}/>
          <Square value={board[4]} chooseSquare={() => chooseSquare(4)}/>
          <Square value={board[5]} chooseSquare={() => chooseSquare(5)}/>    
        </div>

        <div className="flex h-1/3 space-x-2">
          <Square value={board[6]} chooseSquare={() => chooseSquare(6)}/>
          <Square value={board[7]} chooseSquare={() => chooseSquare(7)}/>
          <Square value={board[8]} chooseSquare={() => chooseSquare(8)}/>
        </div>
    </div>

  )
}

export default Game