/**
 * Represents a partial version of a type, where each property is optional and can be recursively partial if it's an object.
 *
 * @template T - The type to make partial.
 * @property {[P in keyof T]?: T[P] extends Record<string, unknown> ? ChildPartial<T[P]> : T[P]} - Each property of the original type is made optional and can be recursively partial if it's an object.
 */
export type ChildPartial<T> = {
  [P in keyof T]?: T[P] extends Record<string, unknown>
    ? ChildPartial<T[P]>
    : T[P]
}
