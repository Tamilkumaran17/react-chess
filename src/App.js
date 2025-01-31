import './App.css';
import { useEffect, useState } from 'react';
import {Chessboard} from 'react-chessboard'
import {Chess} from 'chess.js'
              

function App() {
  const [game, setGame] = useState(new Chess());     
  const [winner, setWinner] = useState(null);        
  const [username , setUsername] = useState('');     
  const [showChessboard, setShowChessboard] = useState(false);    

 


function safeGameMutate(modify){
  setGame((g)=>{
    const update = {...g};
    modify(update)
    return update;
  })
}

const handleResetGame = () => {
  setGame(new Chess());  // Resetting the game state
  setWinner(null);       // Clear the winner state
};




function makeRandomMove(){
  const possibleMove = game.moves ();

  if(game.game_over() || game.in_draw() || possibleMove.length === 0) return;

  const randomIndex = Math.floor(Math.random() * possibleMove.length);

 safeGameMutate((game)=>{
  game.move(possibleMove[randomIndex]);
 })
}


function onDrop(source,target){
  let move = null;
  safeGameMutate((game)=>{
    move = game.move({
      from:source,
      to: target,
      promotion:'q'
    })
})
 
 if(move== null) return false
 
 setTimeout(makeRandomMove, 200);
 return true;
}

useEffect (()=>{
  if(game.game_over()){
    if(game.in_checkmate()){
      setWinner(game.turn()=== 'w'?'Black' : 'White');
    }
    else if(game.in_draw()){
      setWinner('Draw');
    }
  }
},[game]);

const handleStartGame = () => {
  setGame(new Chess());
  setShowChessboard(true);
};

  return (
    <>
     {/* <center><h1 className='heading' style={''}>Welcome to the chess game</h1></center> */}
    <div className="app">
        {!showChessboard && (
          
          <div>
           
            <input className='text-field' type="text"  value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username"/>
            <button onClick={handleStartGame} disabled={!username} className='startbutton'>
              Start Game
            </button>
          </div>
        )}
        
        {showChessboard && (
          <>
            <p className="user">Welcome: {username}</p>
            <div className="board-container">
              <Chessboard
                position={game.fen()}
                onPieceDrop={onDrop}
                className="chessboard"
                orientation="white" 
                lightSquareStyle={{ backgroundColor: '#ffff' }} 
                darkSquareStyle={{ backgroundColor: '#000000' }} 
                dropSquareStyle={{ boxShadow: 'inset 0 0 1px 4px #63b88f' }} 
                spareSquareStyle={{ backgroundColor: 'transparent' }} 
                animationDuration={200} 
                boardWidth={Math.min(window.innerWidth * .9, 400)}
                />
              {winner && (
                <div className="winner">
                  {winner === 'Draw' ? (
                    <p>It's a draw!</p>
                  ) : (
                    <p>{winner === 'White' ? 'White' : 'Black'} Wins!</p>
                  )}
                </div>
              )}
            </div>
            <button className="startbutton" onClick={handleResetGame}>Reset Game</button>
          </>
        )}
      </div>
  </>
  );
}



export default App;