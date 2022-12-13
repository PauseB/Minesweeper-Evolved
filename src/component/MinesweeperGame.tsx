import React, {useState} from "react";
import {
  buildBoard,
  copyGame,
  difficultySetting,
  GameState,
  isWin,
  revealTileRecursive,
  Tile
} from "../script/minesweeper";
import {Minesweeper} from "../script/typedef";
import {CellState, GameDifficulty} from "../script/enumdef";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fa0, fa1, fa2, fa3, fa4, fa5, fa6, fa7, fa8, faBomb, faFlag} from "@fortawesome/free-solid-svg-icons"

const MinesweeperGame = () => {
  const [difficulty, setDifficulty] = useState<GameDifficulty>(GameDifficulty.Easy)
  const [game, setGame] = useState<Minesweeper>(difficultySetting(difficulty))
  
  const restartGame = () => {
    setGame(difficultySetting(difficulty))
  }
  
  const onTileClick = (index: number) => {
    if (game.revealed[index] === CellState.Revealed) return
    if (game.revealed[index] === CellState.Flag) return
    if (game.board[index] === Tile.Mine){
      onMineExplode()
      return
    }
    const nextGame = copyGame(game)
    revealTileRecursive(nextGame, index)
    setGame(nextGame)
  }
  
  const onTileRightClick = (index:number) => {
    if (game.revealed[index] === CellState.Revealed){
      // do nothing
    }
    else if (game.revealed[index] === CellState.Hidden){
      const nextGame = copyGame(game)
      nextGame.revealed[index] = CellState.Flag
      setGame(nextGame)
    }
    else if (game.revealed[index] === CellState.Flag){
      const nextGame = copyGame(game)
      nextGame.revealed[index] = CellState.Hidden
      setGame(nextGame)
    }
  }

  
  const onMineExplode = () => {
    const nextState = copyGame(game)
    nextState.revealed = new Array<CellState>(game.xSize * game.ySize).fill(CellState.Revealed)
    setGame(nextState)
  }
  
  const calcBoardSizeClass = () => {
    const baseWidth = 800
    if (game == null || game.xSize == null || game.ySize == null)
      return `w-[${baseWidth}px]`
    const x = game.xSize
    const y = game.ySize
    if (x > y) return `w-[${baseWidth}px]`
    else return `w-[${Math.floor(800 * x / y)}px]`
  }
  
  const GameBoard = () => {
    switch (game.state) {
      case GameState.Ongoing:
        return (
          <div className="grid gap-1 bg-slate-800 relative" style={{gridTemplateColumns: `repeat(${game.xSize}, 1fr)`}}>
            {game.board.map((tile, index) => (
              <div onClick={() => onTileClick(index)} onContextMenu={(e) => {e.preventDefault(); onTileRightClick(index);}} key={index}>
                <Cell index={index} tile={tile} revealed={game.revealed[index]}/>
              </div>
            ))}
            {
              isWin(game) && <div className="absolute w-full h-full bg-white/50 flex justify-center items-center">
                <span className="text-5xl font-bold">
                  Board Completed!
                </span>
              </div>
            }
          </div>
        )
      case GameState.NotStarted:
        return (
          <div className="grid gap-1 bg-slate-800" style={{gridTemplateColumns: `repeat(${game.xSize}, 1fr)`}}>
            {game.board.map((tile, index) => (
              <div onClick={() => setGame(buildBoard(game, index))} key={index}>
                <Cell index={index} tile={tile} revealed={CellState.Hidden}/>
              </div>
            ))}
          </div>
        )
      default:
        return (
          <div>
          
          </div>
        )
    }
  }
  
  return (
    <div className={calcBoardSizeClass()}>
      <div className="flex text-4xl mb-3 justify-between">
        <div className="flex text-2xl ">
          <div>Easy</div>
          <div>Normal</div>
          <div>Hard</div>
        </div>
        <span className="text-white">
          {game.mineCount - game.revealed.filter(e => e === CellState.Flag).length}
          {" "}
          <FontAwesomeIcon icon={faBomb}/>
        </span>
      </div>
      <GameBoard/>
      <button onClick={() => restartGame()}>
        Restart
      </button>
    </div>
  )
}

const Cell = (props:{index:number, tile:Tile, revealed:CellState}) => {
  const numberToIcon = [fa0, fa1, fa2, fa3, fa4, fa5, fa6, fa7, fa8]
  
  if (props.revealed === CellState.Hidden)
    return <div className="aspect-square bg-gray-500">
    
    </div>
  else if (props.revealed === CellState.Flag)
    return <div className="aspect-square bg-red-500 flex-center">
      <FontAwesomeIcon className="block w-[70%] h-[70%]" icon={faFlag}/>
    </div>
  switch (props.tile) {
    case Tile.Blank:
      return <div className="aspect-square bg-blue-500">
      </div>
    case Tile.Mine:
      return <div className="aspect-square bg-red-500 flex-center">
        <FontAwesomeIcon className="block w-[80%] h-[80%]" icon={faBomb}/>
      </div>
    default:
      return <div className="aspect-square bg-blue-500 flex-center">
        <FontAwesomeIcon className="block w-[80%] h-[80%]" icon={numberToIcon[props.tile]}/>
      </div>
  }
}

export default MinesweeperGame