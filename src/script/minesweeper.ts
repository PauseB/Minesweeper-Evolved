import {Minesweeper} from "./typedef";
import {CellState, GameDifficulty, GameState, Tile} from "./enumdef";


const buildNewGame = (xSize: number, ySize: number, mineCount: number) => {
  if (mineCount >= xSize * ySize)
    throw new Error("Invalid mine count")
  
  const board:Tile[] = new Array<Tile>(xSize * ySize).fill(Tile.Blank)
  const revealed:CellState[] = new Array<CellState>(xSize * ySize).fill(CellState.Hidden)
  
  const game:Minesweeper = {
    board,
    xSize,
    ySize,
    mineCount,
    revealed,
    state: GameState.NotStarted,
  }
  return game
}

const buildBoard = (sourceGame:Minesweeper, startIndex: number) => {
  const game = copyGame(sourceGame)
  const indexes = new Array(game.xSize * game.ySize)
    .fill(0)
    .map((_,index) => index)
  indexes.splice(startIndex, 1)
  
  const mineIndexes: number[] = []
  for (let i = 0; i < game.mineCount; i++){
    mineIndexes.push(indexes.splice(Math.random() * (indexes.length), 1).pop() as number)
  }

  const isMine: boolean[] = new Array<boolean>(game.xSize * game.ySize).fill(false)
  mineIndexes.forEach(mineIndex => {
    isMine[mineIndex] = true
  })
  game.board = bakeBoardNumber(isMine, game.xSize, game.ySize)
  
  game.state = GameState.Ongoing
  
  revealTileRecursive(game, startIndex)

  return game
}

const bakeBoardNumber = (isMine:boolean[], xSize:number, ySize:number) => {
  const mineCount: number[] = new Array<number>(xSize * ySize).fill(0)
  const leftDirection = [-xSize-1, -1, xSize-1]
  const rightDirection = [-xSize+1, +1, xSize+1]
  const centerDirection = [-xSize, xSize]
  
  isMine.forEach((b, index) => {
    if (b){
      centerDirection.forEach(dirOffset => {
        try{
          mineCount[index + dirOffset]++
        }catch (e){}
      })
      if (index % xSize !== 0)
        leftDirection.forEach(dirOffset => {
          try{
            mineCount[index + dirOffset]++
          }catch (e){}
        })
      if (index % xSize !== xSize-1)
        rightDirection.forEach(dirOffset => {
          try{
            mineCount[index + dirOffset]++
          }catch (e){}
        })
    }
  })
  isMine.forEach((b, index) => {
    if (b)
      mineCount[index] = -1
  })
  
  const board:Tile[] = []
  for (let i = 0; i < xSize*ySize; i++){
    const count = mineCount[i]
    if (count > 8) throw "Invalid nearby mine count"
    if (count === -1) board.push(Tile.Mine)
    else board.push(count)
  }
  
  return board
}


const revealTileRecursive = (game:Minesweeper, index:number) => {
  if (index < 0 || index >= game.xSize*game.ySize || game.revealed[index] === CellState.Revealed) return
  game.revealed[index] = CellState.Revealed
  if (game.board[index] === Tile.Blank){
    const column = index % game.xSize
    revealTileRecursive(game, index - game.xSize)
    revealTileRecursive(game, index + game.xSize)
    if (column !== 0) {
      revealTileRecursive(game, index - game.xSize - 1)
      revealTileRecursive(game, index - 1)
      revealTileRecursive(game, index + game.xSize - 1)
    }
    if (column !== game.xSize - 1){
      revealTileRecursive(game, index - game.xSize + 1)
      revealTileRecursive(game, index + 1)
      revealTileRecursive(game, index + game.xSize + 1)
    }
  }
}

const isWin = (game:Minesweeper) => {
  const cellCount = game.xSize * game.ySize
  const revealedCount = game.revealed.filter(e => e === CellState.Revealed).length
  return revealedCount + game.mineCount === cellCount
}

const copyGame = (source:Minesweeper) => {
  const copiedGame:Minesweeper = {
    board: cloneArray<Tile>(source.board),
    revealed: cloneArray<CellState>(source.revealed),
    xSize: source.xSize,
    ySize: source.ySize,
    mineCount: source.mineCount,
    state: source.state
  }
console.log(copiedGame)
  return copiedGame
}

function cloneArray<T>(arr: Array<T>) {
  return JSON.parse(JSON.stringify(arr)) as Array<T>
}

const difficultySetting = (dif:GameDifficulty) => {
  switch (dif) {
    case GameDifficulty.Easy:
      return buildNewGame(10, 10, 10) // 10%
    case GameDifficulty.Normal:
      return buildNewGame(15, 20, 45) // 15%
    case GameDifficulty.Hard:
      return buildNewGame(25, 20, 100) // 20%
    default:
      return buildNewGame(10, 10, 9)
  }
}

export {
  Tile,
  GameState,
  buildNewGame,
  copyGame,
  buildBoard,
  revealTileRecursive,
  isWin,
  difficultySetting,
}