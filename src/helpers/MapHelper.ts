import { LDtkMapPack } from "../map/LDtkReader";
import { Direction, EntityModel } from "../models/EntityModel";
import { MapData } from "./MapData";

export class MapHelper {
    static LoadMap(map:LDtkMapPack):MapData {
        let md = new MapData();
        md.tiles = map.collideLayer;
        let player = map.entityLayers.entityInstances.find(e=>e.__identifier == 'PlayerStart');
        let dir = player.fieldInstances[0].__value
        md.player = new EntityModel(player.__grid[0], player.__grid[1], Direction[dir], md);
        let end = map.entityLayers.entityInstances.find(e=>e.__identifier == 'End');
        md.end = new EntityModel(end.__grid[0], end.__grid[1], Direction[end.fieldInstances[0].__value], md);
        md.name = map.level.fieldInstances[0].__value;
        md.MemCount = map.level.fieldInstances[1].__value;
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