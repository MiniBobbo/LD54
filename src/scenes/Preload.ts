import { C } from "../C";
import { SFX } from "../helpers/SoundManager";
import { LdtkReader } from "../map/LDtkReader";

export class Preload extends Phaser.Scene {
    preload() {
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);
        
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
            }
        });

        assetText.setOrigin(0.5, 0.5);
        
        
        
        this.load.on('progress', function (value:any) {
            //@ts-ignore
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
        
        this.load.on('fileprogress', function (file:any) {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
            //@ts-ignore
            this.scene.start('menu');
        }, this);
    
        this.load.setBaseURL('./assets/')
        this.load.image('tiles', 'CyberTile.png');
        this.load.image('logo', 'LoopBots.png');
        this.load.json('levels', 'AllLevels.ldtk');
        this.load.bitmapFont('5px', '5px_0.png', '5px.fnt');
        this.load.multiatlas('atlas', 'atlas.json');

        this.load.audio(SFX.Explode, 'SFX/Explode.wav');
        this.load.audio(SFX.Jump, 'SFX/Jumping.wav');
        this.load.audio(SFX.Move, 'SFX/Move.wav');
        this.load.audio(SFX.Teleport_Down, 'SFX/Teleport_Down.wav');
        this.load.audio(SFX.Teleport_up, 'SFX/Teleport.wav');
        this.load.audio(SFX.TilesAppear, 'SFX/TilesAppear.wav');
        this.load.audio(SFX.Click, 'SFX/Click.wav');
        this.load.audio('mainmusic', 'LD54.ogg');
    }


    create() {
        this.anims.create({ key: 'explode', frameRate: 60, frames: this.anims.generateFrameNames('atlas', { prefix: 'explode_', end: 29}), repeat: 0 });
        let r = new LdtkReader(this, this.cache.json.get('levels'));
        C.reader = r;
        r.ldtk.levels.forEach(l=>{
            C.LevelList.push(l.identifier);
        });
        let list = C.LevelList;
        this.sound.play('mainmusic', {loop:true, volume:.3});

    }
}