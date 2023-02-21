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
    static height = 160;
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
    static spacing = 200;
    static gap = 160;
    static minCenter = 150;
    static maxCenter = 466;
    static variance = 300;

    constructor() {
        this.centerPoint = 306; // true center

        this.latestPipe = new Pipe(sprite("pipe_upper.png"),
            new Vec2(
                width,
                this.centerPoint - (PipeManager.gap / 2) - Pipe.height * global_scale));

        gameEngine.addEntity(new Pipe(sprite("pipe_lower.png"),
            new Vec2(
                width,
                this.centerPoint + PipeManager.gap / 2)), Layers.PIPES);

        gameEngine.addEntity(this.latestPipe, Layers.PIPES);

    }

    update() {
        if(this.latestPipe.pos.x < width) {
            let oldX = this.latestPipe.pos.x;

            this.centerPoint = PipeManager.pickNewCenterPoint(this.centerPoint);

            this.latestPipe = new Pipe(sprite("pipe_upper.png"),
                new Vec2(
                    oldX + PipeManager.spacing,
                    this.centerPoint - (PipeManager.gap / 2) - Pipe.height * global_scale));


            gameEngine.addEntity(new Pipe(sprite("pipe_lower.png"),
                new Vec2(
                    oldX + PipeManager.spacing,
                    this.centerPoint + PipeManager.gap / 2)), Layers.PIPES);

            gameEngine.addEntity(this.latestPipe, Layers.PIPES);
        }
    }

    static pickNewCenterPoint(old) {
        let lower = Math.max(old - PipeManager.variance, PipeManager.minCenter);
        let upper = Math.min(old + PipeManager.variance, PipeManager.maxCenter);

        return lower + randomInt(upper - lower);
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