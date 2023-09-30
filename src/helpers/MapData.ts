import { Instructions } from "../enum/Instructions";
import { Layer } from "../map/LDtkReader";
import { EntityModel } from "../models/EntityModel";

export class MapData {
    name:string= '';
    complete:boolean = false;
    tiles:Phaser.Tilemaps.TilemapLayer;
    GoBots:EntityModel[] = [];
    end:EntityModel;
    MemCount:number = 3;
    Sub1:number = 0;
    Sub2:number = 0;
    Commands:Instructions[] = [];
    InputsAllowed:string[] = [];
    GoBotInstructionsAllowed:number = 0;
    ElapsedSteps = 0;

    private TempID:number = 0;


    GoBotStep:number = 0;

    /**
     * This function advances the game one step.  It will update the model and send out scene messages for
     * all the movement and whatever.
     */
    Step() {

        // this.player.Step(i);
        // if(this.player.x == this.end.x && this.player.y == this.end.y)
            // this.complete = true;
    }

    Reset() {
        this.GoBots.forEach(element => {
            element.Reset();
        });
        this.complete = false;
        this.ElapsedSteps = 0;
    }

    /**
     * Gets the next ID from this map data.  This should uniquely identify each EntityModel  
     * @returns ID
     */
    GetID():number {
        return this.TempID++;
    }


}