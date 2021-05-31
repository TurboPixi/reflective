export type OnRender = {
  /**
   * Rendering is happening all the time.
   *
   * @param interpolation Time between frames (in seconds).
   */
  onRender(interpolation: number): void
}
