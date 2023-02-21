/**
 * Represents a piece of text to be part of the in canvas UI
 *
 * @author Kyler Robison
 */
class UIText extends Entity {
    /**
     * Default font
     * @type {string}
     */
    static font = 'flappy';

    /**
     * Creates UI Text
     * @param pos {Vec2} position of the text on the screen.
     * @param text {String | Number} content of the text.
     * @param size {Number} font size of the text in pixels.
     * @param color {RGBColor} color of the text, defaults to white.
     */
    constructor(pos, text = 'text', size = 12,
                color = new RGBColor(255, 255, 255)) {
        super(pos, null);
        this.content = text;
        this.font = `${size}px ${UIText.font}`;
        this.fillStyle = rgba(color.r, color.g, color.b, 1);
        this.textBaseline = 'top';
        this.updateFn = () => {};
    }

    /**
     * Draws the text.
     * @param ctx
     */
    draw(ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.fillStyle;
        ctx.textBaseline = this.textBaseline;
        ctx.fillText(this.content, this.pos.x, this.pos.y);
    }

    update() {
        this.updateFn();
    }

    static drawText(ctx, pos, content, size = 20, color = new RGBColor(255, 255, 255)) {
        ctx.font = `${size}px ${UIText.font}`;
        ctx.fillStyle = rgba(color.r, color.g, color.b, 1);
        ctx.textBaseline = 'top';
        ctx.fillText(content, pos.x, pos.y);
    }
}