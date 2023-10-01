import { C } from "../C";
import { EffectTypes } from "../enum/EffectTypes";
import { EntityStatus } from "../enum/EntityStatus";
import { Instructions } from "../enum/Instructions";
import { MapDataStatus } from "../enum/MapDataStatus";
import { SceneEvents } from "../events/SceneEvents";
import { Layer } from "../map/LDtkReader";
import { EntityModel } from "../models/EntityModel";
import { GoBotModel } from "../models/GoBotModel";
import { ZoomBotModel } from "../models/ZoomBotModel";

export class MapData {
    name:string= '';
    complete:boolean = false;
    tiles:Phaser.Tilemaps.TilemapLayer;
    AllBots:EntityModel[] = [];
    GoBots:GoBotModel[] = [];
    ZoomBots:ZoomBotModel[] = [];
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
    ZoomBotInstructionsAllowed:number = 0;
    ZoomBotInstructions:Instructions[] = [];
    private fullZoomBotInstructions:Instructions[] = [];
    private currentZoomBotStep:number = 0;
    Sub1InstructionsAllowed:number = 0;
    Sub1Instructions:Instructions[] = [];
    private fullSub1Instructions:Instructions[] = [];
    private currentSub1Step:number = 0;

    ElapsedSteps = 0;
    Status:MapDataStatus = MapDataStatus.INITIAL;


    emitter:Phaser.Events.EventEmitter;

    private TempID:number = 0;


    GoBotStep:number = 0;

    Prepare() {
        this.fullGoBotInstructions = this.GenerateFullInstructionSet(this.GoBotInstructions);
        this.fullZoomBotInstructions = this.GenerateFullInstructionSet(this.ZoomBotInstructions);
        this.currentGoBotStep = 0;
        this.ElapsedSteps = 0;
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

        //Check GoBots
        if(this.fullGoBotInstructions.length > 0)
            this.GoBotStepInstruction();
        
        //Check ZoomBots
        if(this.fullZoomBotInstructions.length > 0)
            this.ZoomBotStepInstruction();
        

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

    GoBotStepInstruction() {
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

    }
    ZoomBotStepInstruction() {
        let nextZoomBotInstruction:Instructions = this.fullZoomBotInstructions[this.currentZoomBotStep];
        this.currentZoomBotStep++;
        //If this is the end of the instructions loop back around to the beginning.
        if(this.currentZoomBotStep >= this.fullZoomBotInstructions.length)
            this.currentZoomBotStep = 0;

        //Run the ZoomBot instructions an all the ZoomBots.
        this.ZoomBots.forEach(gb => {
            gb.Step(nextZoomBotInstruction);
        });

        //Run the ZoomBot post checks.  Check for overlaps, stepping on teleporters, etc.
        this.ZoomBots.forEach(gb => {
            if(gb.x == this.end.x && gb.y == this.end.y)
                gb.Success();
        });

    }

    SetEmitter(emitter:Phaser.Events.EventEmitter) {
        this.emitter = emitter;
    }

    Reset() {
        this.AllBots.forEach(element => {
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
    private GenerateFullInstructionSet(partial?:Instructions[]):Instructions[] {

        if(partial == null)
        partial = [];
        //TODO: Subroutines.



        return [...partial];
    }


}
