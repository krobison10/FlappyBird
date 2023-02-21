'use strict';

/**
 * Manages the scene, moves the camera to follow the player.
 *
 * @author
 */
class SceneManager {
    constructor(game) {
        game.camera = this;
        this.pos = new Vec2(0, 0);
    }

    /**
     * Sets the position of the camera to center the player in the screen
     */
    update() {
        // let midpointX = width/2;
        // let midpointY = height/2;
        // this.pos.x = bird.getCenter().x - midpointX;
        // this.pos.y = bird.getCenter().y - midpointY;
    }

    //Don't delete
    draw() {

    }
}