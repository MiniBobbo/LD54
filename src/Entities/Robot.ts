import { C } from "../C";
import { Direction } from "../models/EntityModel";

export class Robot {
    scene:Phaser.Scene;
    s:Phaser.GameObjects.Sprite;
    startX:number;
    startY:number;
    startD:Direction;

    constructor(scene:Phaser.Scene) {
        this.scene = scene;
        this.s = scene.add.sprite(0,0,'atlas', 'Robot2_North_0').setOrigin(.5,1);
    }

    SetStartPosition(x:number, y:number, d:Direction) {
        this.startD = d;
        this.SetDirection(d);
        this.startX = x;
        this.startY = y;
        this.s.setPosition(x * C.TILE_SIZE_X, y * C.TILE_SIZE_Y);
    }

    SetDirection(d:Direction) {
        switch (d) {
            case Direction.North:
                this.s.setFrame('Robot2_North_0');
                break;
            case Direction.East:
                this.s.setFrame('Robot2_East_0');
                break;
            case Direction.South:
                this.s.setFrame('Robot2_South_0');
                break;
            case Direction.West:
                this.s.setFrame('Robot2_West_0');
                break;
            default:
                break;
        }
    }
}