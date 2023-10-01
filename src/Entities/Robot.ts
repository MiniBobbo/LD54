import { C } from "../C";
import { Direction } from "../models/EntityModel";

export class Robot {
    scene:Phaser.Scene;
    s:Phaser.GameObjects.Sprite;
    startX:number;
    startY:number;
    startD:Direction;
    ID:number = 0;

    constructor(scene:Phaser.Scene, ID:number) {
        this.scene = scene;
        this.s = scene.add.sprite(0,0,'atlas', 'Robot2_North_0').setOrigin(.5,1).setVisible(false).setScale(0,3);
        this.scene.time.addEvent({
            delay:5000,
            callback:this.Appear,
            callbackScope:this,
        });
        this.ID = ID;
    }

    SetStartPosition(x:number, y:number, d:Direction) {
        this.startD = d;
        this.startX = x;
        this.startY = y;
        this.SetPosition(this.startX, this.startY, this.startD);
    }

    SetPosition(x:number, y:number, d:Direction) {
        this.s.setPosition(x * C.TILE_SIZE_X, y * C.TILE_SIZE_Y);
        this.s.setVisible(true).setScale(1,1);
        this.SetDirection(d);
        this.Twitch();
    }

    /**
     * Move to a new position and set the direction when you get there.
     * @param x 
     * @param y 
     * @param d 
     */
    MoveTo(x:number, y:number, d:Direction) {

    }

    Twitch() {
        this.s.setScale(.2, 1.5);
        this.scene.tweens.add({
            targets:[this.s],
            scaleX:1, 
            scaleY:1,
            duration:100,
        });
    }

    Teleport() {
        this.scene.tweens.add({
            targets:[this.s],
            scaleX:0, 
            scaleY:3,
            duration:100,
            onComplete:()=>{this.s.setVisible(false);}
        });
    }
    Appear() {
        this.s.setVisible(true);
        this.scene.tweens.add({
            targets:[this.s],
            scaleX:1, 
            scaleY:1,
            duration:100,
        });
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
        this.Twitch();
    }
}