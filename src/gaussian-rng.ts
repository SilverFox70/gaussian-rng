/**
 * Generates a random number following a Gaussian (normal) distribution.
 * @param {Object} options - The options object.
 * @param {number} [options.mean=0] - The mean (center) of the distribution.
 * @param {number} [options.stdDev=1] - The standard deviation (spread) of the distribution (must be > 0).
 * @param {number} [options.skew=0] - The skew factor; higher values skew the distribution.
 * @returns {number} A normally distributed random number.
 * @throws {Error} If stdDev is not greater than zero.
 */
export function gaussianRandom({
  mean = 0,
  stdDev = 1,
  skew = 0,
}: {
  mean?: number;
  stdDev?: number;
  skew?: number;
}): number {
  if (stdDev <= 0) {
    throw new Error("Standard deviation must be greater than zero.");
  }

  let u1 = Math.random();
  let u2 = Math.random();
  let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  let skewAdjusted = z0 + skew * (z0 ** 3 - z0);
  return skewAdjusted * stdDev + mean;
}

/**
 * Generates a bounded random number following a Gaussian (normal) distribution.
 * Ensures the generated number falls within the specified range.
 * @param {Object} options - The options object.
 * @param {number} options.min - The minimum bound.
 * @param {number} options.max - The maximum bound (must be greater than min).
 * @param {number} [options.mean] - The mean (center) of the distribution. Defaults to (min + max) / 2.
 * @param {number} [options.stdDev] - The standard deviation (spread). Defaults to (max - min) / 6 and must be > 0.
 * @param {number} [options.skew=0] - The skew factor; higher values skew the distribution.
 * @returns {number} A normally distributed random number within the specified range.
 * @throws {Error} If min >= max or stdDev is not greater than zero.
 */
export function boundedGaussianRandom({
  min,
  max,
  mean,
  stdDev,
  skew = 0,
}: {
  min: number;
  max: number;
  mean?: number;
  stdDev?: number;
  skew?: number;
}): number {
  if (min >= max) {
    throw new Error("Minimum bound must be less than maximum bound.");
  }
  mean = mean !== undefined ? mean : (min + max) / 2;
  stdDev = stdDev !== undefined ? stdDev : (max - min) / 6;
  if (stdDev <= 0) {
    throw new Error("Standard deviation must be greater than zero.");
  }

  let num;
  do {
    num = gaussianRandom({ mean, stdDev, skew });
  } while (num < min || num > max);
  return num;
}

/**
 * Generates a Gaussian-distributed random number, either within a range or with a given mean and standard deviation.
 * @param {Object} options - The options object.
 * @param {number} [options.min] - The minimum bound (used only if max is also provided).
 * @param {number} [options.max] - The maximum bound (used only if min is also provided).
 * @param {number} [options.mean] - The mean of the distribution (if provided, min/max are ignored).
 * @param {number} [options.stdDev] - The standard deviation (if provided, min/max are ignored and must be > 0).
 * @param {number} [options.skew=0] - The skew factor; higher values skew the distribution.
 * @returns {number} A Gaussian-distributed random number based on provided parameters.
 * @throws {Error} If neither min/max nor mean/stdDev are provided, or if constraints are violated.
 */
export function generateGaussianRandom({
  min,
  max,
  mean,
  stdDev,
  skew = 0,
}: {
  min?: number;
  max?: number;
  mean?: number;
  stdDev?: number;
  skew?: number;
}): number {
  if (mean !== undefined && stdDev !== undefined) {
    if (stdDev <= 0) {
      throw new Error("Standard deviation must be greater than zero.");
    }
    return gaussianRandom({ mean, stdDev, skew });
  }
  if (min !== undefined && max !== undefined) {
    return boundedGaussianRandom({ min, max, mean, stdDev, skew });
  }
  throw new Error("Either min/max or mean/stdDev must be provided");
}
