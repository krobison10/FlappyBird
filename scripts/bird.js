

class Bird extends Entity {
    constructor() {
        super(new Vec2(100, 298), new Dimension(17, 12));
        this.spritesheet = sprite("bird.png");

        this.aliveAnimation = new Animator(this.spritesheet, 0, 0,
            this.size.w, this.size.h,
            4, .1, 0, false, true);
        this.deadAnimation = new Animator(this.spritesheet, 17, 0,
            this.size.w, this.size.h,
            1, .1, 0, false, true);

        this.velocity = new Vec2(0, 0);

        this.dead = false;
        this.gameStarted = false;

        this.boundingBox =
            new BoundingBox(this.pos, new Dimension(this.size.w * global_scale, this.size.h * global_scale));
        this.pipes = new PipeManager();
        this.ground = new GroundScroll();
    }

    update() {
        if(!this.gameStarted) {
            if(gameEngine.keys['w'] || gameEngine.keys['W']) {
                this.startGame();
            }
        }
        else {
            if((gameEngine.keys['w'] || gameEngine.keys['W']) && !this.dead) {
                this.velocity.y = -500;
            }
            if(!this.dead && (this.checkCollide() || this.pos.y < 0)) {
                this.dead = true;
                Pipe.curSpeed = 0;
                this.velocity.y = 20;
            }
            if(this.pos.y + this.size.h > 600) {
                this.dead = true;
                Pipe.curSpeed = 0;

                this.velocity.y = 0;
            }
            else {
                this.velocity.y += 2000 * gameEngine.clockTick;
            }
            this.pos.y += this.velocity.y * gameEngine.clockTick;

            this.pipes.update();
            this.ground.update();
        }
    }

    checkCollide() {
        this.boundingBox =
            new BoundingBox(this.pos, new Dimension(this.size.w * global_scale, this.size.h * global_scale));
        for(let pipe of gameEngine.entities[Layers.PIPES]) {
            if(this.boundingBox.collide(pipe.boundingBox)) {
                return true;
            }
        }
    }

    startGame() {
        this.gameStarted = true;
        Pipe.curSpeed = Pipe.startSpeed;
    }

    draw(ctx) {
        if(!this.dead) {
            this.aliveAnimation.drawFrame(gameEngine.clockTick, ctx, this.pos.x, this.pos.y, global_scale);
        } else {
            this.deadAnimation.drawFrame(gameEngine.clockTick, ctx, this.pos.x, this.pos.y, global_scale);
        }
        this.boundingBox.draw(ctx);
    }
}