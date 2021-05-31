import { ArrayList } from "./ArrayList"

export type Constructor<T> = new (...args: never[]) => T
/**
 * Base node class.
 * Has methods for traversing the tree of nodes.
 */
export class Node {
  /**
   * Reference to the previous node (in the parent array "children").
   */
  protected previous?: Node

  /**
   * Array of descendants.
   */
  readonly children = new ArrayList<Node>()

  /**
   * Link to the parent node.
   */
  parent?: Node

  /**
   * Link to the next node (in the parent array "children").
   */
  protected next?: Node

  /**
   * Adds a child to this node and also updates links
   * to the next, previous and parent nodes.
   *
   * @param child Descendant.
   */
  attach(child: Node) {
    // The last child added.
    const previous = this.children[this.children.length - 1]

    // If it exists ("Attach ()" has been called at least once).
    if (previous) {
      // The last child added refers to the new "child" node.
      previous.next = child
      // "child" refers to the last added child.
      child.previous = previous
    }

    // "child" refers to this node (parent).
    child.parent = this

    // Finally, we add it to the descendant array.
    this.children.push(child)
  }

  /**
   * Removes a child from this node and also updates links
   * to the next, previous and parent nodes.
   *
   * @param child Descendant.
   */
  detach(child: Node) {
    if (child.previous) {
      // It was:
      // A -> "child" -> B
      // Has become:
      // A -> B
      child.previous.next = child.next
    }

    if (child.next) {
      // It was:
      // A <- "child" <- B
      // Has become:
      // A <- B
      child.next.previous = child.previous
    }

    if (child.parent) {
      // "parent" -> "child"
      child.parent.children.delete(child)
      // "parent" <- "child"
      child.parent = undefined
    }
  }

  /**
   * An iterator over child nodes.
   *
   * @param predicate Search criterion, if not passed, will return all nodes.
   *
   * @yields Knot, satisfying the search criteria.
   */
  get(): Generator<Node, undefined, undefined>

  get<T extends Node>(T: Constructor<T>): Generator<T, undefined, undefined>

  *get<T extends Node>(T?: Constructor<T>) {
    const children = this.children

    for (const child of children) {
      if (!T || child instanceof T) {
        yield child
      }
    }
  }

  /**
   * Iterator over child nodes and child nodes of child nodes (recursive).
   * The Breadth-First algorithm (breadth first search) is used.
   *
   * @param predicate Search criterion, if not passed, will return all nodes.
   *
   * @yields Knot, satisfying the search criteria.
   */
  getInChildren(): Generator<Node, undefined, undefined>

  getInChildren<T extends Node>(
    T: Constructor<T>,
  ): Generator<T, undefined, undefined>

  *getInChildren<T extends Node>(T?: Constructor<T>) {
    const children = this.children.slice()

    for (const child of children) {
      if (!T || child instanceof T) {
        yield child
      }

      children.push(...child.children)
    }
  }

  /**
   * An iterator over parent nodes (including the node on which this function is called).
   *
   * @param predicate Search criterion, if not passed, will return all nodes.
   *
   * @yields Knot, satisfying the search criteria.
   */
  getInParent(): Generator<Node, undefined, undefined>

  getInParent<T extends Node>(
    T: Constructor<T>,
  ): Generator<T, undefined, undefined>

  *getInParent<T extends Node>(T?: Constructor<T>) {
    const ancestors: Node[] = this.parent ? [this.parent] : []

    for (const ancestor of ancestors) {
      if (!T || ancestor instanceof T) {
        yield ancestor
      }

      if (ancestor.parent) {
        ancestors.push(ancestor.parent)
      }
    }
  }
}
