// @ts-check

import { w, h, l, r, COLORS } from "./config.js"
import { clear_canvas, draw_circle } from "./utils.js"

/**
 * Disk class
 */
export class Disk {
	/**
	 * @param {import("./config.js").DiskData} data - The data for the disk
	 */
	constructor(data) {
		const { id, canvas, ctx, center, main_color, initial_colors } = data
		this.id = id
		this.canvas = canvas
		this.ctx = ctx
		this.center = center
		this.initial_colors = initial_colors
		this.colors = [...initial_colors]
		this.main_color = main_color
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
		this.canvas.width = 2 * r + w
		this.canvas.height = 2 * r + w
		this.ctx.lineWidth = w
		this.ctx.strokeStyle = COLORS.OUTLINE
		this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2)
		this.ctx.scale(1, -1)

		this.canvas.style.setProperty("translate", `${this.center.x}px ${this.center.y}px`)
		const canvas_left = this.canvas.getBoundingClientRect().left

		this.canvas.addEventListener("click", (e) => {
			if (!this.enabled) return
			const clockwise = e.clientX - canvas_left > this.canvas.width / 2
			this.animate_rotation(clockwise)
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
	 * Animate the rotation of the disk
	 * @param {boolean} clockwise - Whether the disk should rotate clockwise
	 * @async
	 */
	animate_rotation(clockwise) {
		return new Promise((resolve) => {
			this.before_rotate()

			const rotation_class = clockwise ? "rotate-clockwise" : "rotate-anticlockwise"

			const finish_transition = () => {
				this.canvas.classList.remove(rotation_class)
				this.after_rotate(clockwise)
				this.canvas.classList.remove("top")
				setTimeout(resolve, 0)
			}

			this.canvas.addEventListener("transitionend", finish_transition, { once: true })

			this.canvas.classList.add(rotation_class)
			this.canvas.classList.add("top")
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
	 */
	draw() {
		clear_canvas(this.ctx)
		draw_circle(this.ctx, 0, 0, r, this.main_color)

		this.ctx.arc(0, 0, r + 0.5 * w, 0, 2 * Math.PI)
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
}
