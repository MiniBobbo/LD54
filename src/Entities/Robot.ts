import { C } from "../C";
import { SceneEvents } from "../events/SceneEvents";
import { SFX } from "../helpers/SoundManager";
import { Direction } from "../models/EntityModel";

export class Robot {
    scene:Phaser.Scene;
    s:Phaser.GameObjects.Sprite;
    startX:number;
    startY:number;
    startD:Direction;
    ID:number = 0;
    prefix:string = 'Robot2';

    constructor(scene:Phaser.Scene, ID:number) {
        this.scene = scene;
        this.s = scene.add.sprite(0,0,'atlas', `${this.prefix}_North_0`).setOrigin(.5,1).setVisible(false).setScale(0,3);
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
        this.Twitch();
        let newX = x * C.TILE_SIZE_X;
        if(this.s.x != newX)
            this.Dash();
        else
            this.Twitch();
        this.scene.tweens.add({
            targets:[this.s],
            x:x * C.TILE_SIZE_X, 
            y:y * C.TILE_SIZE_Y,
            duration:100,
        });
        this.SetDirection(d);
    }
    JumpTo(x:number, y:number, d:Direction) {
        this.scene.events.emit(SceneEvents.SOUND, SFX.Jump);
        this.Twitch();
        this.scene.tweens.add({
            targets:[this.s],
            x:x * C.TILE_SIZE_X, 
            y:y * C.TILE_SIZE_Y,
            duration:100,
        });
        this.SetDirection(d);
    }

    Twitch() {
        this.scene.events.emit(SceneEvents.SOUND, SFX.Move);
        this.s.setScale(.2, 1.5);
        this.scene.tweens.add({
            targets:[this.s],
            scaleX:1, 
            scaleY:1,
            duration:100,
        });
    }
    Dash() {
        this.scene.events.emit(SceneEvents.SOUND, SFX.Move);
        this.s.setScale(2, .8);
        this.scene.tweens.add({
            targets:[this.s],
            scaleX:1, 
            scaleY:1,
            duration:100,
        });
    }

    Teleport() {
        this.scene.events.emit(SceneEvents.SOUND, SFX.Teleport_up);
        this.scene.tweens.add({
            targets:[this.s],
            delay:150,
            scaleX:0, 
            scaleY:5,
            duration:100,
            onComplete:()=>{this.s.setVisible(false);}
        });
    }
    Appear() {
        this.scene.events.emit(SceneEvents.SOUND, SFX.Teleport_Down);
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
                this.s.setFrame(`${this.prefix}_North_0`);
                break;
            case Direction.East:
                this.s.setFrame(`${this.prefix}_East_0`);
                break;
            case Direction.South:
                this.s.setFrame(`${this.prefix}_South_0`);
                break;
            case Direction.West:
                this.s.setFrame(`${this.prefix}_West_0`);
                break;
            default:
                break;
        }
        // this.Twitch();
    }
}