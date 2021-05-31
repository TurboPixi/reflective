/**
 * Extended array with additional methods.
 */
export class ArrayList<T> extends Array<T> {
  /**
   * Removes the first element matching "searchElement" from the array.
   *
   * @param searchElement The element to be removed.
   * @param fromIndex From which index to start the search. The "~" operator has been applied to the index.
   *
   * @returns Returns the index of the removed item. The "~" operator has been applied to the index.
   */
  delete(searchElement: T, fromIndex = -1) {
    const index = this.indexOf(searchElement, ~fromIndex)

    if (index !== -1) {
      this.splice(index, 1)
    }

    return ~index
  }
}
