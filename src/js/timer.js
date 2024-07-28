// @ts-check

import { timer_display, timer_section, timer_btn } from "./dom.js"

/**
 * Timer class
 */
export class Timer {
	/**
	 * Create the timer
	 */
	constructor() {
		this.running = false
		this.btn = timer_btn
		this.section = timer_section
		this.display = timer_display
		this.start_time = 0
		/**
		 * @type {number | undefined}
		 */
		this.interval = undefined

		this.btn.addEventListener("click", () => {
			this.toggle()
		})

		this.reset()
	}

	/**
	 * Reset the timer
	 */
	reset() {
		this.stop()
		this.display.innerText = "0.0"
		this.display.classList.remove("done")
	}

	/**
	 * Start the timer
	 */
	start() {
		this.section.classList.add("visible")
		this.btn.innerText = "Stop timer"
		this.running = true
		this.display.classList.remove("done")
		this.start_time = performance.now()
		this.interval = setInterval(() => {
			this.update()
		}, 100)
	}

	/**
	 * Stop the timer
	 */
	stop() {
		this.running = false
		this.btn.innerText = "Start timer"
		this.display.classList.add("done")
		if (!this.interval) return
		clearInterval(this.interval)
		this.interval = undefined
	}

	/**
	 * Toggle the timer
	 */
	toggle() {
		if (this.running) {
			this.stop()
		} else {
			this.start()
		}
	}

	/**
	 * Update the timer display
	 */
	update() {
		if (!this.running) return
		const elapsed_time = (performance.now() - this.start_time) / 1000
		this.display.innerText = elapsed_time.toFixed(1)
	}
}
