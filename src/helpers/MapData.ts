import { C } from "../C";
import { EffectTypes } from "../enum/EffectTypes";
import { EntityStatus } from "../enum/EntityStatus";
import { Instructions } from "../enum/Instructions";
import { MapDataStatus } from "../enum/MapDataStatus";
import { SceneEvents } from "../events/SceneEvents";
import { Layer } from "../map/LDtkReader";
import { EntityModel } from "../models/EntityModel";
import { GoBotModel } from "../models/GoBotModel";

export class MapData {
    name:string= '';
    complete:boolean = false;
    tiles:Phaser.Tilemaps.TilemapLayer;
    AllBots:EntityModel[] = [];
    GoBots:GoBotModel[] = [];
    end:EntityModel;
    MemCount:number = 3;
    Sub1:number = 0;
    Sub2:number = 0;
    Commands:Instructions[] = [];
    InputsAllowed:string[] = [];
    GoBotInstructionsAllowed:number = 0;
    GoBotInstructions:Instructions[] = [];
    private fullGoBotInstructions:Instructions[] = [];
    private currentGoBotStep:number = 0;
    ElapsedSteps = 0;
    Status:MapDataStatus = MapDataStatus.INITIAL;


    emitter:Phaser.Events.EventEmitter;

    private TempID:number = 0;


    GoBotStep:number = 0;

    Prepare() {
        this.fullGoBotInstructions = this.GenerateFullInstructionSet(this.GoBotInstructions);
        this.currentGoBotStep = 0;
        this.ElapsedSteps = 0;
        this.AllBots.forEach(element => {
            element.Reset();
        });

        this.Status = MapDataStatus.READY;
        this.Reset();
    }

    /**
     * This function advances the game one step.  It will update the model and send out scene messages for
     * all the movement and whatever.
     */
    Step() {
        this.ElapsedSteps++;
        this.Status = MapDataStatus.RUNNING;
        //The basic process is a PreStep check, a Step, and then a PostStep check.  
        //Not sure I need a prestep...
        let nextGoBotInstruction:Instructions = this.fullGoBotInstructions[this.currentGoBotStep];
        this.currentGoBotStep++;
        //If this is the end of the instructions loop back around to the beginning.
        if(this.currentGoBotStep >= this.fullGoBotInstructions.length)
            this.currentGoBotStep = 0;

        //Run the GoBot instructions an all the GoBots.
        this.GoBots.forEach(gb => {
            gb.Step(nextGoBotInstruction);
        });

        //Run the GoBot post checks.  Check for overlaps, stepping on teleporters, etc.
        this.GoBots.forEach(gb => {
            if(gb.x == this.end.x && gb.y == this.end.y)
                gb.Success();
        });

        //Check for collisions between all the bots.  
        for (let first = 0; first < this.AllBots.length-1; first++) {
            for (let second = first+1; second < this.AllBots.length; second++) {
                let firstBot = this.AllBots[first];
                let secondBot = this.AllBots[second];
                if(firstBot.status == EntityStatus.NORMAL && secondBot.status == EntityStatus.NORMAL && firstBot.x == secondBot.x && firstBot.y == secondBot.y   ) {
                    firstBot.Destroy();
                    secondBot.Destroy();
                    this.emitter.emit(SceneEvents.EFFECT, firstBot.x * C.TILE_SIZE_X, firstBot.y * C.TILE_SIZE_Y, EffectTypes.Explode);
                }
            }
        }

        //Check for wins and losses.  
        if(this.AllBots.filter(b=>b.status == EntityStatus.DESTROYED).length > 0)
            this.Status = MapDataStatus.FAILED;
        else if(this.AllBots.filter(b=>b.status != EntityStatus.COMPLETE).length == 0)
            this.Status = MapDataStatus.COMPLETE;


    }

    SetEmitter(emitter:Phaser.Events.EventEmitter) {
        this.emitter = emitter;
    }

    Reset() {
        this.GoBots.forEach(element => {
            element.Reset();
            
        });
        this.complete = false;
        this.ElapsedSteps = 0;
        this.Status = MapDataStatus.INITIAL;
    }

    /**
     * Gets the next ID from this map data.  This should uniquely identify each EntityModel  
     * @returns ID
     */
    GetID():number {
        return this.TempID++;
    }

    LoadGoBotInstructions(i:Instructions[]) {
        this.GoBotInstructions = i;
    }

    /**
     * Builds an instruction list.  Includes subroutines.  
     * @returns Full instruction list.
     */
    private GenerateFullInstructionSet(partial:Instructions[]):Instructions[] {
        let full:Instructions[] = [];
        //TODO: Subroutines.

        return [...partial];
    }


}
