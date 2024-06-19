// @ts-check

import { reset_btn, scramble_btn } from "./dom.js"
import { disk1_data, disk2_data, disk3_data } from "./config.js"
import { Disk } from "./disk.js"

/**
 * Puzzle class
 */
export class Puzzle {
	constructor() {
		/**
		 * The currently focussed disk
		 * @type {Disk | null}
		 */
		this.focussed_disc = null

		/**
		 * The disks in the puzzle
		 * @type {Disk[]}
		 */
		this.disks = []

		/**
		 * Whether the puzzle is currently scrambling
		 * @type {boolean}
		 */
		this.scrambling = false

		this.setup()
		this.draw()
	}

	/**
	 * Set up the puzzle
	 */
	setup() {
		this.disks = [new Disk(disk1_data), new Disk(disk2_data), new Disk(disk3_data)]

		for (const disk of this.disks) {
			disk.after_rotate = /** @type {boolean} */ (clockwise) => {
				this.rotate_disk(disk, clockwise)
				for (const disky of this.disks) {
					disky.enabled = true
				}
			}
			disk.before_rotate = () => {
				for (const disky of this.disks) {
					disky.enabled = false
				}
			}

			disk.on_focus = () => {
				this.focussed_disc = disk
			}

			disk.on_focusout = () => {
				this.focussed_disc = null
			}
		}

		reset_btn.addEventListener("click", () => this.reset())
		scramble_btn.addEventListener("click", () => this.scramble())

		document.addEventListener("keydown", (e) => {
			this.handle_keydown(e.key)
		})
	}

	/**
	 * Draws all disks in the puzzle
	 */
	draw() {
		for (const disk of this.disks) {
			disk.draw()
		}
	}

	/**
	 * Resets all disks in the puzzle and redraws them
	 */
	reset() {
		if (this.turning) return
		for (const disk of this.disks) {
			disk.reset()
		}
		this.draw()
	}

	/**
	 * Checks if some disk is currently turning
	 */
	get turning() {
		return this.scrambling || this.disks.some((disk) => !disk.enabled)
	}

	/**
	 * Handle keydown events for the puzzle
	 * @param {string} key - The key that was pressed
	 */
	handle_keydown(key) {
		if (this.turning || !this.focussed_disc) return
		switch (key) {
			case "ArrowRight":
				this.focussed_disc.animate_rotation(true)
				break
			case "ArrowLeft":
				this.focussed_disc.animate_rotation(false)
				break
			case "Escape":
				if (document.activeElement instanceof HTMLElement) {
					document.activeElement.blur()
				}
				break
		}
	}

	/**
	 * Get a disk by its id
	 * @param {string} id - The id of the disk
	 * @returns {Disk | undefined} The disk with the given id
	 */
	get_disk(id) {
		return this.disks.find((disk) => disk.id == id)
	}

	/**
	 * Rotate a disk and update the other disks accordingly
	 * @param {Disk} disk - The disk to rotate
	 * @param {boolean} clockwise - Whether to rotate the disk clockwise or not
	 */
	rotate_disk(disk, clockwise) {
		disk.colors = clockwise
			? [...disk.colors.slice(2, 12), disk.colors[0], disk.colors[1]]
			: [disk.colors[10], disk.colors[11], ...disk.colors.slice(0, 10)]

		const disk1 = this.get_disk("1")
		const disk2 = this.get_disk("2")
		const disk3 = this.get_disk("3")

		if (!disk1 || !disk2 || !disk3) return

		switch (disk.id) {
			// disk 1 is rotated
			case "1":
				// action on disk 2
				disk2.colors[0] = disk1.colors[4]
				disk2.colors[11] = disk1.colors[5]
				disk2.colors[10] = disk1.colors[6]
				// action on disk 3
				disk3.colors[0] = disk1.colors[8]
				disk3.colors[1] = disk1.colors[7]
				disk3.colors[2] = disk1.colors[6]
				break
			// disk 2 is rotated
			case "2":
				// action on disk 1
				disk1.colors[4] = disk2.colors[0]
				disk1.colors[5] = disk2.colors[11]
				disk1.colors[6] = disk2.colors[10]
				// action on disk 3
				disk3.colors[2] = disk2.colors[10]
				disk3.colors[3] = disk2.colors[9]
				disk3.colors[4] = disk2.colors[8]
				break
			// disk 3 is rotated
			case "3":
				// action on disk 1
				disk1.colors[8] = disk3.colors[0]
				disk1.colors[7] = disk3.colors[1]
				disk1.colors[6] = disk3.colors[2]
				// action on disk 2
				disk2.colors[10] = disk3.colors[2]
				disk2.colors[9] = disk3.colors[3]
				disk2.colors[8] = disk3.colors[4]
				break
			default:
				break
		}

		this.draw()
	}

	/**
	 * Scramble the puzzle by rotating random disks in random directions
	 * @param {number} [number_turns] - The number of turns to scramble the puzzle
	 * @async
	 */
	async scramble(number_turns = 100) {
		if (this.turning) return

		this.prepare_scrambling()

		/**
		 * @type {{ id: string, clockwise: boolean} | null}
		 */
		let last_turn = null

		for (let i = 0; i < number_turns; i++) {
			const disk = this.disks[Math.floor(Math.random() * this.disks.length)]
			const clockwise = Math.random() < 0.5
			const turn = { id: disk.id, clockwise }
			const just_undo = last_turn != null && last_turn.id == disk.id && last_turn.clockwise != clockwise
			if (just_undo) {
				i--
				continue
			}
			last_turn = turn
			await disk.animate_rotation(clockwise)
		}

		this.finish_scrambling()
	}

	/**
	 * Prepare the puzzle for scrambling
	 */
	prepare_scrambling() {
		this.scrambling = true
		reset_btn.disabled = true
		scramble_btn.disabled = true

		for (const disk of this.disks) {
			disk.prepare_scrambling()
		}
	}

	/**
	 * Finish scrambling the puzzle
	 */
	finish_scrambling() {
		this.scrambling = false
		reset_btn.disabled = false
		scramble_btn.disabled = false

		for (const disk of this.disks) {
			disk.finish_scrambling()
		}
	}
}
