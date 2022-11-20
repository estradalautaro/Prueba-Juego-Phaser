import Phaser from "phaser";
import { useState, useEffect } from "react";
import Escena from "./components/Escena";

function App() {
  // Uso para inicializar un estado local asignando un objeto
  const [listo, setListo] = useState(false);
  // Usamos el hook para que renderice acciones que react no hace
  useEffect(() =>{
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 100 },
          debug: false
        }
      },
      scene:[Escena]
    };
    const game = new Phaser.Game(config);
    // Verifica cuando el juego de prueba esta listo 
    game.events.on("LISTO", setListo)
    return () => {
      setListo(false);
      game.destroy(true);
    }
  }, [listo]);
}

export default App;