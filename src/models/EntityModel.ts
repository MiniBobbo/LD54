import { EntityEvents } from "../enum/EntityEvents";
import { EntityStatus } from "../enum/EntityStatus";
import { Instructions } from "../enum/Instructions";
import { MapData } from "../helpers/MapData";
import { LDtkMapPack } from "../map/LDtkReader";

export class EntityModel {
    ID:number;
    x:number;
    y:number;
    d:Direction = Direction.North;
    map:MapData;
    status:EntityStatus = EntityStatus.NORMAL;


    private startX:number;
    private startY:number;
    startDir:Direction;

    constructor(x:number, y:number, dir:Direction, map:MapData) {
        this.x = x;
        this.y = y;
        this.map = map;
        this.d = dir;
        this.startX = x;
        this.startY = y;
        this.startDir = dir;
        this.ID = map.GetID();
    }

    Step(instruction:Instructions) {
        if(this.status == EntityStatus.COMPLETE || this.status == EntityStatus.DESTROYED)
        return;
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
            case Instructions.Jump:
                this.Jump();
                break;
            default:
                break;
        }
    }

    Destroy() {
        this.status = EntityStatus.DESTROYED;
        this.map.emitter.emit(EntityEvents.DESTROYED, this.ID);
        
    }

    Right() {
        this.d +=1;
        if(this.d > 3)
            this.d = 0;
        this.map.emitter.emit(EntityEvents.MOVE, this.ID, this.x, this.y, this.d);
    }

    Left() {
        this.d -=1;
        if(this.d < 0)
            this.d = 3;
        this.map.emitter.emit(EntityEvents.MOVE, this.ID, this.x, this.y, this.d);
    }

    Jump() {
        let c = this.map.tiles;
        switch (this.d) {
            case Direction.North:
                if(this.GetTileIndex(c, this.x, this.y-2) == 1) {
                    this.y-=2;
                    this.map.emitter.emit(EntityEvents.JUMP, this.ID, this.x, this.y, this.d);
                }
                break;
            case Direction.South:
                if(this.GetTileIndex(c, this.x, this.y+2) == 1) {
                    this.y+=2;
                    this.map.emitter.emit(EntityEvents.JUMP, this.ID, this.x, this.y, this.d);
                }
                break;
            case Direction.East:
                if(this.GetTileIndex(c, this.x+2, this.y) == 1) {
                    this.x+=2;
                    this.map.emitter.emit(EntityEvents.JUMP, this.ID, this.x, this.y, this.d);
                }
                break;
            case Direction.West:
                if(this.GetTileIndex(c, this.x-2, this.y) == 1) {
                    this.x-=2;
                    this.map.emitter.emit(EntityEvents.JUMP, this.ID, this.x, this.y, this.d);
                }
                break;
        
            default:
                break;
        }

    }

    GetTileIndex(c:Phaser.Tilemaps.TilemapLayer, x:number,y:number):number {
        if(x < 0 || x >= c.layer.width || y < 0 || y >= c.layer.height)
            return -1;
        return c.getTileAt(x, y , true).index;
    }

    Forward() {
        let c = this.map.tiles;
        switch (this.d) {
            case Direction.North:
                if(this.GetTileIndex(c, this.x, this.y-1) == 1) {
                    this.y--;
                    this.map.emitter.emit(EntityEvents.MOVE, this.ID, this.x, this.y, this.d);
                }
                break;
            case Direction.East:
                if(this.GetTileIndex(c, this.x+1, this.y) == 1) {
                    this.x++;
                    this.map.emitter.emit(EntityEvents.MOVE, this.ID, this.x, this.y, this.d);
                }
                break;
            case Direction.South:
                if(this.GetTileIndex(c, this.x, this.y+1) == 1) {
                    this.y++;
                    this.map.emitter.emit(EntityEvents.MOVE, this.ID, this.x, this.y, this.d);
                }
                break;
            case Direction.West:
                if(this.GetTileIndex(c, this.x-1, this.y) == 1) {
                    this.x--;
                    this.map.emitter.emit(EntityEvents.MOVE, this.ID, this.x, this.y, this.d);
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
        this.status = EntityStatus.NORMAL;
    }

    Success() {
        this.status = EntityStatus.COMPLETE;
        this.map.emitter.emit(EntityEvents.TELEPORT, this.ID);
        // this.x = 1000;
        // this.y = 1000;
    }
}

export enum Direction {
    North = 0,
    East = 1, 
    South = 2, 
    West = 3
}