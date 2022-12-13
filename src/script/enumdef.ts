enum Tile {
  Blank,
  One,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Mine
}
enum GameState {
  NotStarted,
  Ongoing,
  Win,
  Lose,
}
enum CellState {
  Hidden,
  Revealed,
  Flag,
}

enum GameDifficulty {
  Easy,
  Normal,
  Hard,
}

export {
  Tile,
  GameState,
  CellState,
  GameDifficulty,
}