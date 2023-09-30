import { LDtkMapPack } from "../map/LDtkReader";
import { Direction, EntityModel } from "../models/EntityModel";
import { MapData } from "./MapData";

export class MapHelper {
    static LoadMap(map:LDtkMapPack):MapData {
        let md = new MapData();
        md.tiles = map.collideLayer;
        let ee = map.entityLayers.entityInstances.find(e=>e.__identifier == 'PlayerStart');
        let dir = ee.fieldInstances[0].__value
        let pd = new EntityModel(ee.__grid[0], ee.__grid[1], Direction[dir], md);
        return md;
    }
}