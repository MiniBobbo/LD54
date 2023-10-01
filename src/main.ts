import * as Phaser from "phaser";
import { Preload } from "./scenes/Preload";
import { GameScene } from "./scenes/GameScene";
import { C } from "./C";
import { GameData } from "./GameData";
import { MainMenuScene } from "./scenes/MainMenuScene";
import { TestHelper } from "./helpers/TestHelper";
import { TestScene } from "./scenes/TestScene";
import { StandAloneScene } from "./scenes/StandAloneScene";


class Main extends Phaser.Game {
  constructor() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      width: 1000,
      height: 700,
      zoom:1,
      physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
      },
      // scene:{
      //   // preload:preload,
      //   // game:Game
      // },
      render: {
        pixelArt:true,
      },
    };
    super(config);

    // this.scene.add("boot", Boot, false);
    this.scene.add("stand", StandAloneScene, false);
    this.scene.add("menu", MainMenuScene, false);
    this.scene.add("test", TestScene, false);
    this.scene.add("preload", Preload, false);
    // this.scene.add("game", GameScene, false);
    this.scene.start("preload");
    C.gd = new GameData();
    // C.setFlag('5', true);
    }

}

window.onload = () => {
  const GameApp: Phaser.Game = new Main();
};