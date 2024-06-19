// @ts-check

import { canvas1, canvas2, canvas3, ctx1, ctx2, ctx3 } from "./dom.js"

/**
 * Minimum of the viewport width and height, capped at 500
 */
const vmin = Math.min(window.innerWidth, window.innerHeight, 500)

/**
 * Length of the side of the equilateral triangle,
 * which is the distance between the centers of the circles.
 */
export const l = Math.round(0.39 * vmin)

/**
 * Radius of the circles
 */
export const r = Math.round(0.27 * vmin)

/**
 * Height of the equilateral triangle
 */
export const h = 0.5 * Math.sqrt(3) * l

/**
 * Width of the lines
 */
export const w = Math.round(0.01 * vmin)

/**
 * Colors of the pieces
 */
export const COLORS = Object.freeze({
	RED: "#f10",
	BLUE: "#43f",
	GREEN: "#0f0",
	PURPLE: "#f3f",
	YELLOW: "#ff0",
	ORANGE: "#e90",
	SKY: "#0ff",
	OUTLINE: "#111",
})

/**
 * Overlaps of a disk with other disks, encoding by a dictionary of piece indices for each disk id.
 * @typedef {Record<string, Record<number, number>>} Overlaps
 */

/**
 * Data to create a disk.
 * @typedef {object} DiskData
 * @property {string} id - The unique identifier for the disk.
 * @property {string} main_color - The main color of the disk.
 * @property {readonly string[]} initial_colors - The initial colors of the disk.
 * @property {HTMLCanvasElement} canvas - The canvas element the disk is drawn on.
 * @property {CanvasRenderingContext2D} ctx - The canvas context used for drawing.
 * @property {{x: number, y: number}} center - The center position of the disk.
 * @property {Overlaps} overlaps - The overlaps of the disk with other disks.
 */

/**
 * Disk 1 in the top middle
 * @type {DiskData}
 */
export const disk1_data = {
	id: "1",
	main_color: COLORS.RED,
	initial_colors: Object.freeze([
		COLORS.RED,
		COLORS.RED,
		COLORS.RED,
		COLORS.RED,
		COLORS.PURPLE,
		COLORS.PURPLE,
		COLORS.YELLOW,
		COLORS.ORANGE,
		COLORS.ORANGE,
		COLORS.RED,
		COLORS.RED,
		COLORS.RED,
	]),
	canvas: canvas1,
	ctx: ctx1,
	center: { x: 0, y: -h / 2 },
	overlaps: {
		2: { 4: 0, 5: 11, 6: 10 },
		3: { 8: 0, 7: 1, 6: 2 },
	},
}

/**
 * Disk 2 in the bottom left
 * @type {DiskData}
 */
export const disk2_data = {
	id: "2",
	main_color: COLORS.BLUE,
	initial_colors: Object.freeze([
		COLORS.PURPLE,
		COLORS.BLUE,
		COLORS.BLUE,
		COLORS.BLUE,
		COLORS.BLUE,
		COLORS.BLUE,
		COLORS.BLUE,
		COLORS.BLUE,
		COLORS.SKY,
		COLORS.SKY,
		COLORS.YELLOW,
		COLORS.PURPLE,
	]),
	canvas: canvas2,
	ctx: ctx2,
	center: { x: -l / 2, y: h / 2 },
	overlaps: {
		1: { 0: 4, 11: 5, 10: 6 },
		3: { 10: 2, 9: 3, 8: 4 },
	},
}

/**
 * Disk 3 in the bottom right
 * @type {DiskData}
 */
export const disk3_data = {
	id: "3",
	main_color: COLORS.GREEN,
	initial_colors: Object.freeze([
		COLORS.ORANGE,
		COLORS.ORANGE,
		COLORS.YELLOW,
		COLORS.SKY,
		COLORS.SKY,
		COLORS.GREEN,
		COLORS.GREEN,
		COLORS.GREEN,
		COLORS.GREEN,
		COLORS.GREEN,
		COLORS.GREEN,
		COLORS.GREEN,
	]),
	canvas: canvas3,
	ctx: ctx3,
	center: { x: l / 2, y: h / 2 },
	overlaps: {
		1: { 2: 6, 1: 7, 0: 8 },
		2: { 2: 10, 3: 9, 4: 8 },
	},
}
