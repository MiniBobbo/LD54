import { C } from "./C";

export class GameData {
    results:LevelResultsData[];

    constructor() {
        this.results = [];
    }
}

export class LevelResultsData {
    Name:string;
    ID:string;
    Complete:boolean = false;
    Moves:number = 999;
}