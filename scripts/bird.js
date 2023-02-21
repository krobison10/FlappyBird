

class Bird extends Entity {
    static jumpVel = -580;
    static gravity = 2000;
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

        this.keyPressed = false;
        this.score = 0;
        this.startTime = Date.now();
    }

    update() {
        if(!this.gameStarted) {
            if(gameEngine.keys[' '] || gameEngine.keys['w'] || gameEngine.keys['W'] || gameEngine.tap) {
                this.startGame();
            }
        }
        else {
            if(gameEngine.keys[' '] || gameEngine.keys['w'] || gameEngine.keys['W'] || gameEngine.tap) {
                if(!this.dead && !this.keyPressed) {
                    this.velocity.y = Bird.jumpVel;
                    playSound("wing");
                    this.keyPressed = true;
                }
            } else {
                this.keyPressed = false;
            }

            if(!this.dead && (this.checkCollide() || this.pos.y < 0)) {
                this.die(false);
            }
            if(this.pos.y + this.size.h > 600) {
                if(!this.dead) {
                    this.die(true);
                }
                this.velocity.y = 0;
            }
            else {
                this.velocity.y += Bird.gravity * gameEngine.clockTick;
            }
            this.pos.y += this.velocity.y * gameEngine.clockTick;

            this.pipes.update();
            this.ground.update();
            if(Pipe.curSpeed < Pipe.maxSpeed && !this.dead) Pipe.curSpeed += Pipe.speedChange * gameEngine.clockTick;
        }
    }

    die(ground) {
        this.dead = true;
        Pipe.curSpeed = 0;
        playSound("hit");

        if(!ground) {
            this.velocity.y = 25;
            setTimeout(() => playSound("die"), 250);
        }
    }

    addPoint() {
        this.score++;
        playSound("point");
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