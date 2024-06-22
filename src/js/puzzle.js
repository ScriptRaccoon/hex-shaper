// @ts-check

import { reset_btn, scramble_btn } from "./dom.js"
import { disk1_data, disk2_data, disk3_data } from "./config.js"
import { Disk } from "./disk.js"
import { rotate_array_left } from "./utils.js"

/**
 * Puzzle class representing the Hex Shaper
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
		this.load_state_from_storage()
		this.draw()
	}

	/**
	 * The state of the puzzle, used for saving and loading
	 * @returns {string[][]}
	 */
	get state() {
		return this.disks.map((disk) => disk.colors)
	}

	/**
	 * Save the state of the puzzle to local storage.
	 * This runs whenever a disk rotates or the puzzle is reset.
	 */
	save_state_to_storage() {
		localStorage.setItem("state", JSON.stringify(this.state))
	}

	/**
	 * Load the state of the puzzle from local storage.
	 * This runs when the puzzle is created.
	 */
	load_state_from_storage() {
		try {
			const saved_state = localStorage.getItem("state")
			if (!saved_state) {
				console.info("No saved state found in storage")
				return
			}
			/**
			 * @type {string[][]}
			 */
			const state = JSON.parse(saved_state)
			for (let i = 0; i < state.length; i++) {
				this.disks[i].colors = state[i]
			}
		} catch (_) {
			console.error("Failed to load state from storage")
		}
	}

	/**
	 * Set up the puzzle
	 */
	setup() {
		this.disks = [new Disk(disk1_data), new Disk(disk2_data), new Disk(disk3_data)]

		for (const disk of this.disks) {
			disk.after_rotate = /** @type {boolean} */ (clockwise) => {
				this.rotate_colors({ disk, clockwise })
				for (const disky of this.disks) {
					disky.enabled = true
				}
				this.save_state_to_storage()
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
		scramble_btn.addEventListener("click", () => this.toggle_scramble())

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
		this.save_state_to_storage()
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
				this.focussed_disc.rotate({ clockwise: true })
				break
			case "ArrowLeft":
				this.focussed_disc.rotate({ clockwise: false })
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
	 * @param {object} options - The options for the rotation
	 * @param {Disk} options.disk - The disk to rotate
	 * @param {boolean} options.clockwise - Whether to rotate the disk clockwise or not
	 */
	rotate_colors({ disk, clockwise }) {
		disk.colors = rotate_array_left(disk.colors, clockwise ? 2 : -2)

		for (const other_disk of this.disks) {
			if (other_disk === disk) continue
			const mapping = disk.overlaps[other_disk.id]
			for (const [index, other_index] of Object.entries(mapping)) {
				other_disk.colors[other_index] = disk.colors[index]
			}
		}

		this.draw()
	}

	/**
	 * Toggle scrambling the puzzle
	 */
	toggle_scramble() {
		if (this.scrambling) {
			this.scrambling = false
		} else {
			this.scramble()
		}
	}

	/**
	 * Scramble the puzzle by rotating random disks in random directions
	 * @async
	 */
	async scramble() {
		if (this.turning) return
		const MAX_TURNS = 10_000

		this.prepare_scrambling()

		/**
		 * @type {{ id: string, clockwise: boolean} | null}
		 */
		let last_turn = null

		for (let i = 0; i < MAX_TURNS; i++) {
			if (!this.scrambling) break
			const disk = this.disks[Math.floor(Math.random() * this.disks.length)]
			const clockwise = Math.random() < 0.5
			const turn = { id: disk.id, clockwise }
			const just_undo = last_turn != null && last_turn.id == disk.id && last_turn.clockwise != clockwise
			if (just_undo) {
				i--
				continue
			}
			last_turn = turn
			await disk.rotate({ clockwise, speed: Math.PI / 20 })
		}

		this.finish_scrambling()
	}

	/**
	 * Prepare the puzzle for scrambling
	 */
	prepare_scrambling() {
		scramble_btn.innerText = "Stop Scramble"
		this.scrambling = true
		reset_btn.disabled = true

		for (const disk of this.disks) {
			disk.prepare_scrambling()
		}
	}

	/**
	 * Finish scrambling the puzzle
	 */
	finish_scrambling() {
		scramble_btn.innerText = "Scramble"
		this.scrambling = false
		reset_btn.disabled = false

		for (const disk of this.disks) {
			disk.finish_scrambling()
		}
	}
}
