// @ts-check

export const reset_btn = /** @type {HTMLButtonElement} */ (document.querySelector("#reset_btn"))
export const scramble_btn = /** @type {HTMLButtonElement} */ (document.querySelector("#scramble_btn"))
export const canvas1 = /** @type {HTMLCanvasElement} */ (document.querySelector("#canvas1"))
export const canvas2 = /** @type {HTMLCanvasElement} */ (document.querySelector("#canvas2"))
export const canvas3 = /** @type {HTMLCanvasElement} */ (document.querySelector("#canvas3"))
export const ctx1 = /** @type {CanvasRenderingContext2D} */ (canvas1.getContext("2d"))
export const ctx2 = /** @type {CanvasRenderingContext2D} */ (canvas2.getContext("2d"))
export const ctx3 = /** @type {CanvasRenderingContext2D} */ (canvas3.getContext("2d"))
export const toast_element = /** @type {HTMLDivElement} */ (document.querySelector("#toast"))
export const timer_btn = /** @type {HTMLButtonElement} */ (document.querySelector("#timer_btn"))
export const timer_section = /** @type {HTMLElement} */ (document.querySelector("#timer_section"))
export const timer_display = /** @type {HTMLDivElement} */ (document.querySelector("#timer_display"))
