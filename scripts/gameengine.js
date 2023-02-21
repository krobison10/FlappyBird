// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [[], [], [], [], []];

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};

        this.camera = new SceneManager(this);
        this.addEntity(this.camera, Layers.UI);

        // Options and the Details
        this.options = options || {
            debugging: false,
        }
    }

    init(ctx) {
        this.ctx = ctx;
        this.ctx.imageSmoothingEnabled = false;
        this.startInput();
        this.timer = new Timer();
    }

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    }

    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });
        
        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
        });

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });

        this.ctx.canvas.addEventListener("keydown", event => this.keys[event.key] = true);
        this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key] = false);
    }

    addEntity(entity, layer) {
        this.entities[layer].push(entity);
    }

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        let i = Layers.BACKGROUND;
        this.ctx.drawImage(sprite("background.png"), 0, 0, 144, 256, 0, 0, 144 * 3, 256 * 3);

        i = Layers.PIPES;
        for (let j = this.entities[i].length - 1; j >= 0; j--) {
            this.entities[i][j].draw(this.ctx);
        }
        i = Layers.GROUND;
        for (let j = this.entities[i].length - 1; j >= 0; j--) {
            this.entities[i][j].draw(this.ctx);
        }
        i = Layers.BIRD;
        for (let j = this.entities[i].length - 1; j >= 0; j--) {
            this.entities[i][j].draw(this.ctx);
        }
        i = Layers.UI;
        for (let j = this.entities[i].length - 1; j >= 0; j--) {
            this.entities[i][j].draw(this.ctx);
        }
    }

    update() {
        let layer = this.entities[Layers.BACKGROUND];
        let entitiesCount = layer.length;

        layer = this.entities[Layers.PIPES];
        entitiesCount = layer.length;
        for (let i = 0; i < entitiesCount; i++) {
            let entity = layer[i];
            if (!entity.removeFromWorld) {
                entity.update();
            }
        }
        layer = this.entities[Layers.GROUND];
        entitiesCount = layer.length;
        for (let i = 0; i < entitiesCount; i++) {
            let entity = layer[i];
            if (!entity.removeFromWorld) {
                entity.update();
            }
        }
        layer = this.entities[Layers.BIRD];
        entitiesCount = layer.length;
        for (let i = 0; i < entitiesCount; i++) {
            let entity = layer[i];
            if (!entity.removeFromWorld) {
                entity.update();
            }
        }
        layer = this.entities[Layers.UI];
        entitiesCount = layer.length;
        for (let i = 0; i < entitiesCount; i++) {
            let entity = layer[i];
            if (!entity.removeFromWorld) {
                entity.update();
            }
        }


        //Delete eligible entities
        for(let layer of this.entities) {
            for (let i = layer.length - 1; i >= 0; --i) {
                if (layer[i].removeFromWorld) {
                    layer.splice(i, 1); // Delete element at i
                }
            }
        }
    }

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    }
}

