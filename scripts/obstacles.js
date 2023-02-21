const deleteThresh = -200;

class Obstacle extends Entity {
    constructor(sprite, pos, size) {
        super(pos, new Dimension(size.w * global_scale, size.h * global_scale));
        this.sprite = sprite;
    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(this.sprite, 0, 0, this.size.w / global_scale, this.size.h / global_scale,
            this.pos.x, this.pos.y, this.size.w, this.size.h);
    }
}

class Pipe extends Obstacle {
    static startSpeed = 100;
    static curSpeed = 0;
    constructor(sprite, pos) {
        super(sprite, pos, new Dimension(26, 160));
        this.boundingBox =
            new BoundingBox(new Vec2(this.pos.x, this.pos.y), new Dimension(this.size.w, this.size.h));
    }

    update() {
        if(this.pos.x < deleteThresh) {
            return this.removeFromWorld = true;
        }
        this.pos.x -= Pipe.curSpeed * gameEngine.clockTick;
        this.boundingBox =
            new BoundingBox(new Vec2(this.pos.x, this.pos.y), new Dimension(this.size.w, this.size.h));
    }

    draw(ctx) {
        super.draw(ctx);
        this.boundingBox.draw(ctx);
    }
}

class PipeManager {
    static pipeGap = 200;
    constructor() {
        this.latestPipe = new Pipe(sprite("tube_top.png"),
            new Vec2(width, -290));
        gameEngine.addEntity(this.latestPipe, Layers.PIPES);

        gameEngine.addEntity(new Pipe(sprite("tube_bottom.png"),
            new Vec2(width, 390)), Layers.PIPES);
    }

    update() {
        if(this.latestPipe.pos.x < width) {
            let oldX = this.latestPipe.pos.x;

            this.latestPipe = new Pipe(sprite("tube_top.png"),
                new Vec2(this.latestPipe.pos.x + PipeManager.pipeGap, -290));
            gameEngine.addEntity(this.latestPipe, Layers.PIPES);

            gameEngine.addEntity(new Pipe(sprite("tube_bottom.png"),
                new Vec2(oldX + PipeManager.pipeGap, 390)), Layers.PIPES);
        }
    }

}

class GroundScroll {
    constructor() {
        this.left = new Obstacle(sprite("ground.png"), new Vec2(0, height - 3 * 52), new Dimension(168, 56));
        this.right = new Obstacle(sprite("ground.png"), new Vec2(width, height - 3 * 52), new Dimension(168, 56));

        gameEngine.addEntity(this.left, Layers.GROUND);
        gameEngine.addEntity(this.right, Layers.GROUND);

    }

    update() {
        this.left.pos.x -= Pipe.curSpeed * gameEngine.clockTick;
        this.right.pos.x -= Pipe.curSpeed * gameEngine.clockTick;
        if(this.right.pos.x <= 0) {
            this.left.pos.x = 0;
            this.right.pos.x = width;
        }
    }
}