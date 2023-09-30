import { GameData } from "./GameData";
import { Instructions } from "./enum/Instructions";

export class C {
    static currentLevel:string = 'Level_1';
    static previouslevel:string = 'start';
    static waypoint:string = '';

    static TILE_SIZE_X:number = 60;
    static TILE_SIZE_Y:number = 46;
    static GRAVITY:number = 1000;
    // static GRAVITY:number = 1000;
    static MAX_Y_SPEED:number = 500;
    static PLAYER_GROUND_SPEED:number = 100;
    static PLAYER_SLIDE_DRAG:number = 700;
    static PLAYER_SLIDE_SPEED:number = 300;
    static PLAYER_CLIMB_SPEED:number = 50;
    static PLAYER_AIR_SPEED:number = 100;
    static PLAYER_GROUND_ACCEL:number = 800;
    static PLAYER_AIR_ACCEL:number = 400;
    static PLAYER_GROUND_DRAG:number = 400;
    static PLAYER_AIR_DRAG:number = 400;
    static PLAYER_JUMP_STR:number = 200;
    static PLAYER_JUMP_TIME:number = 300;
    static PLAYER_ATTACK_TIME:number = 250;

    static MOUSE_SENSITIVITY:number = .8;

    static FLAG_COUNT:number = 100;
    static gd:GameData;

    static GAME_NAME = 'LimitedMemory';

    static RoundToTile(x:number, y:number):{x:number, y:number} {
        let newX = 0;
        let newY = 0;
        newX = Math.floor(x/C.TILE_SIZE_X) * C.TILE_SIZE_Y;
        newY = Math.floor(y/C.TILE_SIZE_X) * C.TILE_SIZE_Y;
        return {x:newX, y:newY};
    }

    static checkFlag(flag:string):boolean {
        //@ts-ignore
        return this.gd.flags[flag];
    }
    static setFlag(flag:string, value:boolean) {
        //@ts-ignore
        this.gd.flags[flag] = value;
    }

    static InstructionToString(i:Instructions):string {
        switch (i) {
            case Instructions.Right:
                return 'Instructions_Right_0';
            case Instructions.Left:
                return 'Instructions_Left_0';
            case Instructions.Forward:
                return 'Instructions_Forward_0';
            case 0:
                return 'CyberTile_4';
            default:
                break;
        }

    }
}