// @ts-check

/**
 * Clears the canvas context with a threshold
 * to prevent antialiasing artifacts
 * @param {CanvasRenderingContext2D} ctx
 */
export function clear_canvas(ctx) {
	const threshold = 50
	ctx.save()
	ctx.setTransform(1, 0, 0, 1, 0, 0)
	ctx.clearRect(-threshold, -threshold, ctx.canvas.width + 2 * threshold, ctx.canvas.height + 2 * threshold)
	ctx.restore()
}

/**
 * Draws a circle on the canvas context
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} r
 * @param {string} [color]
 */
export function draw_circle(ctx, x, y, r, color) {
	ctx.beginPath()
	ctx.arc(x, y, r, 0, 2 * Math.PI)
	if (color) {
		ctx.fillStyle = color
		ctx.fill()
	}
	ctx.stroke()
	ctx.closePath()
}
