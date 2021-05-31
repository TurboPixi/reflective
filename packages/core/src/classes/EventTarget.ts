import { OnAttach } from "../hooks/OnAttach"
import { OnDetach } from "../hooks/OnDetach"
import { Node } from "./Node"

export type Interface<Function = (...args: never[]) => void> = Record<
  string | number | symbol,
  Function
>
export class EventTarget extends Node {
  propagate<T extends Interface>(
    key: keyof T,
    ...args: Parameters<T[keyof T]>
  ) {
    for (const child of [this, ...this.getInChildren(EventTarget)]) {
      child.emit<T>(key, ...args)
    }
  }

  emit<T extends Interface>(key: keyof T, ...args: Parameters<T[keyof T]>) {
    if (typeof (this as this & T)[key] === "function") {
      ;(this as this & T)[key]?.(...args)
    }
  }

  attach(child: EventTarget) {
    super.attach(child)
    child.propagate<OnAttach>("onAttach")
  }

  detach(child: EventTarget) {
    super.detach(child)
    child.propagate<OnDetach>("onDetach")
  }
}
