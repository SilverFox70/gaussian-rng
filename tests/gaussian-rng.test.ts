import { describe, test, expect } from "vitest";
import {
  gaussianRandom,
  boundedGaussianRandom,
  generateGaussianRandom,
} from "../src/gaussian-rng.js";

describe("Gaussian Random Number Generator", () => {
  test("gaussianRandom generates values around the mean", () => {
    const result = gaussianRandom({ mean: 50, stdDev: 10 });
    expect(result).toBeGreaterThanOrEqual(50 - 30);
    expect(result).toBeLessThanOrEqual(50 + 30);
  });

  test("gaussianRandom throws an error for non-positive stdDev", () => {
    expect(() => gaussianRandom({ mean: 0, stdDev: 0 })).toThrow(
      "Standard deviation must be greater than zero."
    );
  });

  test("boundedGaussianRandom generates values within bounds", () => {
    const result = boundedGaussianRandom({ min: 10, max: 20 });
    expect(result).toBeGreaterThanOrEqual(10);
    expect(result).toBeLessThanOrEqual(20);
  });

  test("boundedGaussianRandom throws an error when min is greater than or equal to max", () => {
    expect(() => boundedGaussianRandom({ min: 20, max: 10 })).toThrow(
      "Minimum bound must be less than maximum bound."
    );
  });

  test("generateGaussianRandom generates correct values with mean and stdDev", () => {
    const result = generateGaussianRandom({ mean: 50, stdDev: 10 });
    expect(result).toBeGreaterThanOrEqual(50 - 30);
    expect(result).toBeLessThanOrEqual(50 + 30);
  });

  test("generateGaussianRandom generates values within bounds when min/max provided", () => {
    const result = generateGaussianRandom({ min: 5, max: 15 });
    expect(result).toBeGreaterThanOrEqual(5);
    expect(result).toBeLessThanOrEqual(15);
  });

  test("generateGaussianRandom throws error if neither min/max nor mean/stdDev provided", () => {
    expect(() => generateGaussianRandom({})).toThrow(
      "Either min/max or mean/stdDev must be provided"
    );
  });
});
