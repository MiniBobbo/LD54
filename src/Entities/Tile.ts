export class Tile {
    scene:Phaser.Scene;
    s:Phaser.GameObjects.Sprite;
    x:number;
    y:number;
    type:TileType;

    constructor(scene:Phaser.Scene) {
        this.scene = scene;
        this.s = scene.add.sprite(0,0, 'atlas', 'CyberTile_0');
        // this.s.postFX.addBloom(0xffffff,1,1,1,3);
        this.type = TileType.Tile;
    }

    SetTileType(type:TileType) {
        this.type = type;
        switch (type) {
            case TileType.End:
                this.s.setFrame('CyberTile_2');
                break;
        
            default:
                break;
        }
    }

}

export enum TileType {
    Tile = 1,
    End = 2,
}