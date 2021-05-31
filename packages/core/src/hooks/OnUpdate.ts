export type OnUpdate = {
  /**
   * Updates occur no more than N times per second.
   *
   * @param elapsedTime Time between frames (in seconds).
   */
  onUpdate(elapsedTime: number): void
}
