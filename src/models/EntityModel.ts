import { Instructions } from "../enum/Instructions";
import { MapData } from "../helpers/MapData";
import { LDtkMapPack } from "../map/LDtkReader";

export class EntityModel {
    x:number;
    y:number;
    d:Direction = Direction.North;
    map:MapData;

    private startX:number;
    private startY:number;
    private startDir:Direction;

    constructor(x:number, y:number, dir:Direction, map:MapData) {
        this.x = x;
        this.y = y;
        this.map = map;
        this.d = dir;
        this.startX = x;
        this.startY = y;
        this.startDir = dir;
    }

    Step(instruction:Instructions) {
        switch (instruction) {
            case Instructions.Forward:
                this.Forward();
                break;
            case Instructions.Left:
                this.Left();
                break;
            case Instructions.Right:
                this.Right();
                break;
            default:
                break;
        }
    }

    Right() {
        this.d +=1;
        if(this.d > 3)
            this.d = 0;
    }

    Left() {
        this.d -=1;
        if(this.d < 0)
            this.d = 3;
    }

    Forward() {
        let c = this.map.tiles;
        switch (this.d) {
            case Direction.North:
                if(c.getTileAt(this.x, this.y-1, true).index == 1) {
                    this.y--;
                }
                break;
            case Direction.East:
                if(c.getTileAt(this.x + 1, this.y, true).index == 1) {
                    this.x++;
                }
                break;
            case Direction.South:
                if(c.getTileAt(this.x, this.y + 1, true).index == 1) {
                    this.y++;
                }
                break;
            case Direction.West:
                if(c.getTileAt(this.x-1, this.y , true).index == 1) {
                    this.x--;
                }
                break;
        
            default:
                break;
        }
    }

    Reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.d = this.startDir;
    }
}

export enum Direction {
    North = 0,
    East = 1, 
    South = 2, 
    West = 3
}