import { GameData, LevelResultsData } from "./GameData";
import { Instructions } from "./enum/Instructions";
import { LdtkReader } from "./map/LDtkReader";

export class C {
    static currentLevel:string = 'Level_4';
    static previouslevel:string = 'start';
    static waypoint:string = '';

    static TILE_SIZE_X:number = 60;
    static TILE_SIZE_Y:number = 46;
    static MAX_STEPS_ALLOWED = 500;

    static MOUSE_SENSITIVITY:number = .8;

    static FLAG_COUNT:number = 100;
    static gd:GameData;

    static GAME_NAME = 'LimitedMemory';

    static reader:LdtkReader;


    //This is the list of all the levels.  It is build from the LDTK file on startup.
    static LevelList:string[] = [];

    static RoundToTile(x:number, y:number):{x:number, y:number} {
        let newX = 0;
        let newY = 0;
        newX = Math.floor(x/C.TILE_SIZE_X) * C.TILE_SIZE_Y;
        newY = Math.floor(y/C.TILE_SIZE_X) * C.TILE_SIZE_Y;
        return {x:newX, y:newY};
    }

    static CompletedLevel(levelName:string, moves:number) {
        let r = C.gd.results.find(r=>r.Name == levelName);
        if(r == null) {
            r = new LevelResultsData();
            r.Name = levelName;
            r.Complete = true;
            r.Moves = moves;
        } else {
            r.Moves = moves;
            r.Complete = true;

        }
    }

    static LoadLocalGameData() {
        if(C.gd == null) {
            let gd:string;
            try {
                gd = localStorage.getItem(C.GAME_NAME);
            } catch {}
            if(gd == null)
                C.EraseSaves();
            else
                C.gd = JSON.parse(gd);
        }
    }

    static SaveLocalGameData() {
        try {
            localStorage.setItem(C.GAME_NAME, JSON.stringify(C.gd));

        }catch {}
    }

    static EraseSaves() {
        let gd = new GameData();
        C.reader.ldtk.levels.forEach(l=>{
            let d:LevelResultsData = new LevelResultsData();
            d.Complete = false;
            d.ID = l.identifier;
            d.Moves = 999;
            d.Name = l.fieldInstances[0].__value;
            gd.results.push(d);
        });
        C.gd = gd;
        this.SaveLocalGameData();
    }


    static GetLevelResultsData(levelName:string):LevelResultsData {
        return C.gd.results.find(r=>r.Name == levelName);
    }

    static InstructionToString(i:Instructions):string {
        switch (i) {
            case Instructions.Right:
                return 'Instructions_Right_0';
            case Instructions.Left:
                return 'Instructions_Left_0';
            case Instructions.Forward:
                return 'Instructions_Forward_0';
            case Instructions.Wait:
                return 'Instructions_Wait_0';
            case Instructions.Jump:
                return 'Instructions_Jump_0';
            case Instructions.Sub1:
                return 'Instructions_Sub_0';
            case 0:
                return 'CyberTile_4';
            default:
                break;
        }

    }
}