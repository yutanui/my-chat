import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// jsdom doesn't implement scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Mock react-markdown (ESM-only, problematic in jsdom)
vi.mock("react-markdown", () => ({
  default: ({ children }: { children: string }) => children,
}));

vi.mock("remark-gfm", () => ({
  default: () => {},
}));
