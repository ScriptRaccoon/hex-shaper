// @ts-check

/**
 * Clears a canvas context. Uses a threshold
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
 * Draws a circle on a canvas context
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

/**
 * Rotates an array to the left by n positions
 * @template T - The type of the array elements
 * @param {T[]} arr - The array to rotate
 * @param {number} n - The number of positions to rotate the array (can be negative)
 * @returns {T[]} - The rotated array
 */
export function rotate_array_left(arr, n) {
	return arr.slice(n).concat(arr.slice(0, n))
}

/**
 * Checks if a state is valid
 * @param {unknown} state
 * @returns {state is string[][]}
 */
export function validate(state) {
	return (
		Array.isArray(state) &&
		state.length == 3 &&
		state.every(
			(colors) =>
				Array.isArray(colors) &&
				colors.length == 12 &&
				colors.every((color) => typeof color == "string" && color.length > 0)
		)
	)
}

/**
 * Disables the scroll reload on mobile devices
 */
export function disable_scroll_reload() {
	let x1 = 0
	let y1 = 0

	/**
	 * Sets the initial touch position
	 * @param {TouchEvent} e
	 */
	function handleTouchStart(e) {
		x1 = e.touches[0].pageX
		y1 = e.touches[0].pageY
	}

	/**
	 * Sets the final touch position and prevents the default behavior
	 * if the touch was a vertical swipe at the top of the page
	 * @param {TouchEvent} e
	 */
	function handleTouchMove(e) {
		const x2 = e.touches[0].pageX
		const y2 = e.touches[0].pageY

		const xd = x2 - x1
		const yd = y2 - y1

		if (window.scrollY === 0 && Math.abs(xd) < Math.abs(yd) && yd > 0) {
			e.preventDefault()
		}
	}

	document.addEventListener("touchstart", handleTouchStart, { passive: false })
	document.addEventListener("touchmove", handleTouchMove, { passive: false })
}
