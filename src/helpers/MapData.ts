import { Instructions } from "../enum/Instructions";
import { Layer } from "../map/LDtkReader";
import { EntityModel } from "../models/EntityModel";

export class MapData {
    name:string= '';
    complete:boolean = false;
    tiles:Phaser.Tilemaps.TilemapLayer;
    player:EntityModel;
    end:EntityModel;
    MemCount:number = 3;
    Sub1:number = 0;
    Sub2:number = 0;


    Step(i:Instructions) {
        this.player.Step(i);
        if(this.player.x == this.end.x && this.player.y == this.end.y)
            this.complete = true;
    }


}