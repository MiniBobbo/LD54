import { Instructions } from "../enum/Instructions";
import { LDtkMapPack } from "../map/LDtkReader";
import { Direction, EntityModel } from "../models/EntityModel";
import { GoBotModel } from "../models/GoBotModel";
import { ZoomBotModel } from "../models/ZoomBotModel";
import { MapData } from "./MapData";

export class MapHelper {
    static LoadMap(map:LDtkMapPack):MapData {
        let md = new MapData();
        md.tiles = map.collideLayer;
        let goBots = map.entityLayers.entityInstances.filter(e=>e.__identifier == 'GoBot');
        goBots.forEach(element => {
            let dir = element.fieldInstances[0].__value;
            let gb = new GoBotModel(element.__grid[0], element.__grid[1], Direction[dir], md);
            md.GoBots.push(gb);
            md.AllBots.push(gb);
        });
        let zoomBots = map.entityLayers.entityInstances.filter(e=>e.__identifier == 'ZoomBot');
        zoomBots.forEach(element => {
            let dir = element.fieldInstances[0].__value;
            let zb = new ZoomBotModel(element.__grid[0], element.__grid[1], Direction[dir], md);
            md.ZoomBots.push(zb);
            md.AllBots.push(zb);
        });
        // md.player = new EntityModel(player.__grid[0], player.__grid[1], Direction[dir], md);
        let end = map.entityLayers.entityInstances.find(e=>e.__identifier == 'End');
        md.end = new EntityModel(end.__grid[0], end.__grid[1], Direction[end.fieldInstances[0].__value], md);
        md.name = map.level.fieldInstances[0].__value;
        let i = map.level.fieldInstances[1].__value;
        i.forEach(element => {
            let i:Instructions = Instructions[element as string];
            md.Commands.push(i);
        });
        map.level.fieldInstances[2].__value.forEach(element => {
            md.InputsAllowed.push(element);
        });
        md.GoBotInstructionsAllowed = map.level.fieldInstances[3].__value;
        md.ZoomBotInstructionsAllowed = map.level.fieldInstances[5].__value;

        return md;
    }

    /**
     * This is a brute force puzzle solver so I can build and test levels automatically.
     * 
     * @param md - Level to develop 
     */
    static TestMap(md:MapData) {
        let allinst = [];
        
        for(let i = 0; i < md.MemCount; i++) {
            allinst.push(0);
        }

        

    }
}