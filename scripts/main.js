const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

const width = 432;
const height = 768;
const global_scale = 3;

declareAssets([
	"sprites/background.png",
	"sprites/ground.png",
	"sprites/bird.png",
	"sprites/tube_top.png",
	"sprites/tube_bottom.png"
	]);

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	gameEngine.init(ctx);

	gameEngine.start();
});

const bird = new Bird();
gameEngine.addEntity(bird, Layers.BIRD);



function declareAssets(paths) {
	for(let path of paths) {
		ASSET_MANAGER.queueDownload(path);
	}
}

function sprite(name) {
	return ASSET_MANAGER.getAsset("sprites/" + name);
}