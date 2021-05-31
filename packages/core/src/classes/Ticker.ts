import { clamp } from "../functions/clamp"
import { milliseconds } from "../functions/milliseconds"
import { seconds } from "../functions/seconds"
import { OnRender } from "../hooks/OnRender"
import { OnRequestAnimationFrame } from "../hooks/OnRequestAnimationFrame"
import { OnUpdate } from "../hooks/OnUpdate"
import { GameObject } from "./GameObject"

/**
 * Game loop.
 */
export class Ticker extends GameObject {
  /**
   * Frame duration in seconds.
   */
  readonly duration = milliseconds(1 / 60)

  /**
   * Animation frame identifier. Needed in "stop ()".
   */
  protected pendingAnimationFrame?: number

  /**
   * Time stamp of the previous frame.
   */
  protected previousTime = performance.now()

  /**
   * Whether the cycle has stopped.
   */
  protected stopped = true

  /**
   * Whether the cycle has started.
   */
  protected running = false

  /**
   * Time stamp of next frame.
   */
  protected nextTime = performance.now()

  /**
   * Frame number.
   */
  protected frame = 0

  /**
   * Starts a loop.
   */
  start = () => {
    this.propagate<OnRequestAnimationFrame>(
      "onRequestAnimationFrame",
      ++this.frame,
    )

    if (this.stopped) {
      this.previousTime = performance.now()
      this.nextTime = performance.now()
    }

    this.pendingAnimationFrame = undefined
    this.stopped = false
    this.running = true

    // while update is behind
    for (
      ;
      this.running && this.nextTime < performance.now();
      this.nextTime += this.duration
    ) {
      const elapsedTime = seconds(this.difference)

      if (elapsedTime > 0) {
        this.propagate<OnUpdate>("onUpdate", elapsedTime)
      }

      this.previousTime = this.nextTime
    }

    this.propagate<OnRender>("onRender", this.interpolation)

    if (this.running) {
      this.pendingAnimationFrame = requestAnimationFrame(this.start)
    }
  }

  /**
   * Stops the loop.
   */
  stop() {
    this.running = false
    this.stopped = true

    // ungraceful stop called outside the loop
    if (this.pendingAnimationFrame) {
      cancelAnimationFrame(this.pendingAnimationFrame)
    }
  }

  /**
   * Calculates the interpolation value.
   * The ratio of elapsed time and total time between frames.
   */
  protected get interpolation() {
    const interpolation = clamp(this.elapsed / this.difference, 0, 1)

    return seconds(this.duration) * interpolation
  }

  /**
   * Calculates the time between the previous and next frame.
   */
  protected get difference() {
    return this.nextTime - this.previousTime
  }

  /**
   * Calculates the time between now and the next frame.
   */
  protected get elapsed() {
    return performance.now() - this.previousTime
  }
}
