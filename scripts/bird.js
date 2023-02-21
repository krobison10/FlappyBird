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

        this.keyPressedPreviously = false;
        this.score = 0;

        this.deathTime = null;
    }

    update() {
        if(!this.gameStarted) { // game not started yet
            if(playerInteract()) {
                if(!this.keyPressedPreviously) {
                    this.startGame();
                }
            }
            else {
                this.keyPressedPreviously = false;
            }
        }
        else { //Game is going
            if(playerInteract()) { //Key input received
                if(!this.keyPressedPreviously) {
                    //If this is a new press
                    if(this.dead) {
                       if(timeInSecondsBetween(this.deathTime, Date.now()) > 1.1) {
                           return this.restartGame();
                       }
                    }
                    else {
                        this.velocity.y = Bird.jumpVel;
                        playSound("wing");
                    }
                    this.keyPressedPreviously = true;
                }
            } else {
                this.keyPressedPreviously = false; //Ket wasn't pressed so reset
            }

            //If not yet dead and collide with pipe or hit ceiling: die not by ground
            if(!this.dead && (this.checkCollide() || this.pos.y < 0)) {
                this.die(false);
            }

            //If hitting ground
            if(this.pos.y + this.size.h > 600) {
                //If not already dead, die
                if(!this.dead) {
                    this.die(true);
                }
                //Regardless, stop when hitting ground
                this.velocity.y = 0;
            }
            else {
                //Ground not hit so apply gravity to bird
                this.velocity.y += Bird.gravity * gameEngine.clockTick;
            }
            //Apply changes to position
            this.pos.y += this.velocity.y * gameEngine.clockTick;

            //Apply updates to other world objects
            this.pipes.update();
            this.ground.update();
            if(Pipe.curSpeed < Pipe.maxSpeed && !this.dead) Pipe.curSpeed += Pipe.speedChange * gameEngine.clockTick;

        }
    }



    die(ground) {
        this.dead = true;
        this.deathTime = Date.now()
        Pipe.curSpeed = 0;
        playSound("hit");

        //If not dying by ground, play falling noise
        if(!ground) {
            this.velocity.y = 25;
            setTimeout(() => playSound("die"), 250);
        }

        //Display restart message after a second
        setTimeout(() => {
            gameEngine.addEntity(restartMessage(), Layers.UI);
        }, 1000);
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

    restartGame() {
        for(let element of gameEngine.entities[Layers.UI]) {
            if(element.restartMessage) {
                element.removeFromWorld = true;
                break;
            }
        }
        this.gameStarted = false;
        this.dead = false;
        this.pos.y = 298;
        this.score = 0;
        this.keyPressedPreviously = true;

        for(let pipe of gameEngine.entities[Layers.PIPES]) {
            pipe.removeFromWorld = true;
        }
        this.pipes = new PipeManager();
        for(let ground of gameEngine.entities[Layers.GROUND]) {
            ground.removeFromWorld = true;
        }
        this.ground = new GroundScroll();
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

function playerInteract() {
    return gameEngine.keys[' '] || gameEngine.keys['w'] || gameEngine.keys['W'] || gameEngine.tap;
}

function restartMessage() {
    let message = new UIText(null, "PRESS SPACE OR W TO RESTART", 24);
    gameEngine.ctx.font = message.font;
    let pos = new Vec2();
    let textWidth = gameEngine.ctx.measureText(message.content).width;
    pos.x = width / 2 - textWidth / 2;
    pos.y = (height - 156) / 2 - message.size / 2;
    message.pos = pos;
    message.restartMessage = true;
    return message;
}