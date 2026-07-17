import "@testing-library/jest-dom";
import v8 from "node:v8";

// jsdom's global object doesn't expose structuredClone, which Chakra UI v3 uses
// internally when building its theme system. Polyfill it via v8 so it also
// handles Date/Map/Set (a JSON round-trip would drop those).
if (typeof globalThis.structuredClone === "undefined") {
  globalThis.structuredClone = <T>(value: T): T =>
    v8.deserialize(v8.serialize(value)) as T;
}
