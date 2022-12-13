import React from 'react';
import logo from './logo.svg';
import './App.css';
import MinesweeperGame from "./component/MinesweeperGame";

function App() {
  return (
    <div className="w-screen h-screen bg-slate-700 flex justify-center items-center">
      <div>
        <MinesweeperGame/>
      </div>
    </div>
  );
}

export default App;
