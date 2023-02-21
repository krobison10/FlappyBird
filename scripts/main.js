const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

const width = 432;
const height = 768;
const global_scale = 3;

declareAssets([
	"sprites/background.png",
	"sprites/ground.png",
	"sprites/bird.png",
	"sprites/pipe_upper.png",
	"sprites/pipe_lower.png",

	"sounds/die.wav",
	"sounds/hit.wav",
	"sounds/point.wav",
	"sounds/wing.wav"
	]);

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ASSET_MANAGER.setVolume(0.1);


	gameEngine.init(ctx);

	gameEngine.start();

});

const bird = new Bird();
gameEngine.addEntity(bird, Layers.BIRD);

const counter = new UIText(new Vec2(width/2, 20), "0", 50);
counter.updateFn = function() {
	this.content = bird.score;

	gameEngine.ctx.font = this.font;
	let textWidth = gameEngine.ctx.measureText(this.content).width;
	this.pos.x = width / 2 - textWidth / 2;
}
gameEngine.addEntity(counter, Layers.UI);



function declareAssets(paths) {
	for(let path of paths) {
		ASSET_MANAGER.queueDownload(path);
	}
}

function sprite(name) {
	return ASSET_MANAGER.getAsset("sprites/" + name);
}

function playSound(name) {
	ASSET_MANAGER.playAsset("sounds/" + name + ".wav");
}