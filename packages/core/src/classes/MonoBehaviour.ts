import { OnRequestAnimationFrame } from "../hooks/OnRequestAnimationFrame"
import { EventTarget } from "./EventTarget"
import { Constructor } from "./Node"

export type Query<K extends string | number | symbol> = {
  constructor: new (...args: unknown[]) => MonoBehaviour
  from: "GetComponent" | "GetComponentInChildren" | "GetComponentInParent"
  options?: GetComponentOptions
  propertyKey: K
  prototype: MonoBehaviour
}
export type GetComponentOptions = {
  /**
   * Default - `true`.
   */
  required?: boolean
}
export class MonoBehaviour
  extends EventTarget
  implements OnRequestAnimationFrame {
  protected static queries: Query<string | number | symbol>[] = []

  static GetComponent = <T>(
    constructor: T extends new (...args: infer U) => MonoBehaviour ? T : never,
    options?: GetComponentOptions,
  ): PropertyDecorator => (prototype, propertyKey) => {
    if (prototype instanceof MonoBehaviour) {
      MonoBehaviour.queries.push({
        constructor,
        from: "GetComponent",
        propertyKey,
        prototype,
        options,
      })
    }
  }

  static GetComponentInChildren = <T>(
    constructor: T extends new (...args: infer U) => MonoBehaviour ? T : never,
    options?: GetComponentOptions,
  ): PropertyDecorator => (prototype, propertyKey) => {
    if (prototype instanceof MonoBehaviour) {
      MonoBehaviour.queries.push({
        constructor,
        from: "GetComponentInChildren",
        propertyKey,
        prototype,
        options,
      })
    }
  }

  static GetComponentInParent = <T>(
    constructor: T extends new (...args: infer U) => MonoBehaviour ? T : never,
    options?: GetComponentOptions,
  ): PropertyDecorator => (prototype, propertyKey) => {
    if (prototype instanceof MonoBehaviour) {
      MonoBehaviour.queries.push({
        constructor,
        from: "GetComponentInParent",
        propertyKey,
        prototype,
        options,
      })
    }
  }

  onRequestAnimationFrame() {
    for (const {
      constructor,
      from,
      propertyKey,
      prototype,
      options,
    } of MonoBehaviour.queries) {
      if (prototype.constructor === this.constructor) {
        let component

        switch (from) {
          case "GetComponent":
            component = this.getComponent(constructor)
            break
          case "GetComponentInChildren":
            component = this.getComponentInChildren(constructor)
            break
          case "GetComponentInParent":
            component = this.getComponentInParent(constructor)
            break
        }

        if (component) {
          // @ts-ignore
          this[propertyKey] = component
        } else if (
          typeof options?.required === "undefined" ||
          options.required
        ) {
          const x = constructor.name
          const y = prototype.constructor.name

          throw new Error(`${x} was required in ${y} but no were found`)
        }
      }
    }
  }

  getComponent<T extends MonoBehaviour>(T: Constructor<T>) {
    return this.parent?.get(T).next().value
  }

  getComponentInChildren<T extends MonoBehaviour>(T: Constructor<T>) {
    return this.parent?.getInChildren(T).next().value
  }

  getComponentInParent<T extends MonoBehaviour>(T: Constructor<T>) {
    if (!this.parent) {
      return
    }

    for (const ancestor of this.parent.getInParent()) {
      const component = ancestor.get(T).next().value

      if (component) {
        return component
      }
    }
  }
}
