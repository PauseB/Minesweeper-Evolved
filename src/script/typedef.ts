import {Tile, GameState, CellState} from "./enumdef";

type Minesweeper = {
  state: GameState,
  board: Tile[],
  revealed: CellState[],
  xSize: number,
  ySize: number,
  mineCount: number,
}

export type {
  Minesweeper,
}