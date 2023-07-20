import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

global.ResizeObserver = require("resize-observer-polyfill");

declare module "vitest" {
  interface Assertion<T = any>
    extends jest.Matchers<void, T>,
      TestingLibraryMatchers<T, void> {}
}

expect.extend(matchers);
