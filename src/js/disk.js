// @ts-check

import { w, h, l, r, COLORS } from "./config.js"
import { clear_canvas, draw_circle } from "./utils.js"

/**
 * Disk class
 */
export class Disk {
	static DEFAULT_SPEED = Math.PI / 40

	/**
	 * Create a disk
	 * @param {import("./config.js").DiskData} data - The data for the disk
	 */
	constructor(data) {
		const { id, canvas, ctx, center, main_color, initial_colors, overlaps } = data
		this.id = id
		this.canvas = canvas
		this.ctx = ctx
		this.center = center
		this.initial_colors = initial_colors
		this.colors = [...initial_colors]
		this.main_color = main_color
		this.overlaps = overlaps
		this.enabled = true

		/**
		 * What happens after the disk rotates,
		 * implemented by Puzzle class
		 * @param {boolean} clockwise
		 */
		this.after_rotate = (clockwise) => {}

		/**
		 * What happens before the disk rotates,
		 * implemented by Puzzle class
		 */
		this.before_rotate = () => {}

		/**
		 * What happens when the disk is focused,
		 * implemented by Puzzle class
		 */
		this.on_focus = () => {}

		/**
		 * What happens when the disk is focused out,
		 * implemented by Puzzle class
		 */

		this.on_focusout = () => {}

		this.setup()
	}

	/**
	 * Set up the disk
	 */
	setup() {
		const ratio = window.devicePixelRatio || 1
		const size = 2 * r + w
		this.canvas.width = ratio * size
		this.canvas.height = ratio * size
		this.canvas.style.width = `${size}px`
		this.canvas.style.height = `${size}px`
		this.ctx.lineWidth = w
		this.ctx.strokeStyle = COLORS.OUTLINE
		this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2)
		this.ctx.scale(ratio, -ratio)

		this.canvas.style.setProperty("translate", `${this.center.x}px ${this.center.y}px`)
		const canvas_left = this.canvas.getBoundingClientRect().left

		this.canvas.addEventListener("click", async (e) => {
			if (!this.enabled) return
			const clockwise = e.clientX - canvas_left > size / 2
			await this.rotate({ clockwise })
		})

		this.canvas.addEventListener("focus", () => {
			if (!this.enabled) return
			this.on_focus()
		})

		this.canvas.addEventListener("focusout", () => {
			this.on_focusout()
		})
	}

	/**
	 * Animate the rotation of the disk by 60 degrees in the given direction
	 * @param {object} options - The options for the rotation
	 * @param {boolean} options.clockwise - Whether the disk should rotate clockwise
	 * @param {number} [options.speed] - The speed of the rotation
	 * @returns {Promise<void>} - A promise that resolves when the rotation is complete
	 */
	rotate(options) {
		const { clockwise, speed = Disk.DEFAULT_SPEED } = options

		if (this.rotating) return Promise.resolve()

		this.before_rotate()
		this.canvas.classList.add("rotating")
		const target_angle = clockwise ? -Math.PI / 3 : Math.PI / 3
		let angle = 0
		this.rotating = true

		return new Promise((resolve) => {
			const animation = () => {
				angle += clockwise ? -speed : speed
				this.draw(angle)

				const done = Math.abs(angle) >= Math.abs(target_angle)

				if (!done) {
					requestAnimationFrame(animation)
					return
				}

				this.draw(target_angle)
				this.canvas.classList.remove("rotating")
				this.rotating = false
				this.after_rotate(clockwise)
				resolve()
			}

			requestAnimationFrame(animation)
		})
	}

	/**
	 * Reset the disk to its initial state
	 */
	reset() {
		this.colors = [...this.initial_colors]
	}

	/**
	 * Draws a small triangular piece of the disk
	 * @param {CanvasRenderingContext2D} ctx - The canvas context
	 * @param {string} color - The color of the piece
	 * @param {number} index - The index of the piece
	 */
	static draw_small_piece(ctx, color, index) {
		ctx.save()
		ctx.beginPath()
		ctx.rotate((index * (2 * Math.PI)) / 12)
		ctx.arc(-l / 2, h, r, 0.5 * Math.PI, -0.25 * Math.PI, true)
		ctx.arc(l / 2, h, r, -0.75 * Math.PI, -Math.PI, true)
		ctx.fillStyle = color
		ctx.fill()
		ctx.closePath()
		ctx.restore()
	}

	/**
	 * Draws a larger quadrilateral piece of the disk
	 * @param {CanvasRenderingContext2D} ctx - The canvas context
	 * @param {string} color - The color of the piece
	 * @param {number} index - The index of the piece
	 */
	static draw_large_piece(ctx, color, index) {
		ctx.save()
		ctx.rotate(((index + 1) * (2 * Math.PI)) / 12)
		ctx.beginPath()
		ctx.arc(l / 2, h, r, 0, 2 * Math.PI)
		ctx.fillStyle = color
		ctx.fill()
		ctx.closePath()
		ctx.restore()
	}

	/**
	 * Draw the disk by drawing the pieces of the disk
	 * and the arcs that separate them
	 * @param {number} [angle] - The angle of rotation of the disk
	 */
	draw(angle = 0) {
		clear_canvas(this.ctx)

		this.ctx.save()
		this.ctx.rotate(angle)

		draw_circle(this.ctx, 0, 0, r, this.main_color)

		this.ctx.beginPath()
		this.ctx.arc(0, 0, r, 0, 2 * Math.PI)
		this.ctx.clip()

		for (let index = 1; index < this.colors.length; index += 2) {
			Disk.draw_large_piece(this.ctx, this.colors[index], index)
		}

		for (let index = 0; index < this.colors.length; index += 2) {
			Disk.draw_small_piece(this.ctx, this.colors[index], index)
		}

		draw_circle(this.ctx, 0, 0, r)
		draw_circle(this.ctx, l, 0, r)
		draw_circle(this.ctx, -l, 0, r)
		draw_circle(this.ctx, l / 2, h, r)
		draw_circle(this.ctx, -l / 2, h, r)
		draw_circle(this.ctx, l / 2, -h, r)
		draw_circle(this.ctx, -l / 2, -h, r)

		this.ctx.restore()
	}

	/**
	 * Prepare the disk for scrambling
	 */
	prepare_scrambling() {
		this.canvas.classList.add("scrambling")
		this.canvas.removeAttribute("tabindex")
	}

	/**
	 * Finish the scrambling of the disk
	 */
	finish_scrambling() {
		this.canvas.classList.remove("scrambling")
		this.canvas.setAttribute("tabindex", "0")
	}

	/**
	 * Check if the disk is solved, i.e. the colors are in the initial order
	 * @returns {boolean}
	 */
	get is_solved() {
		return this.colors.every((color, index) => color === this.initial_colors[index])
	}
}
