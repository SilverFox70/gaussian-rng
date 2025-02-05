# Gaussian Random Number Generator

Gaussian-RNG is a lightweight and flexible JavaScript/TypeScript library for generating random numbers that follow a Gaussian (normal) distribution. Unlike standard uniform random number generators, this package ensures that numbers are distributed around a specified mean, with a controlled spread (standard deviation) and an optional skew to shift probability density toward one side.

This library can be useful in scientific simulations, statistical modeling, procedural content generation (e.g., gaming, terrain generation), AI randomness tuning, finance, and Monte Carlo simulations, where naturally occurring variations tend to follow a normal distribution rather than uniform randomness.

With support for bounded Gaussian distributions (ensuring values stay within a given range), custom mean and standard deviation settings, and skew adjustments, Gaussian-RNG provides fine-grained control over random number generation in applications requiring realistic randomness.

## **Understanding Skew in the Gaussian Distribution**

Skewness refers to the asymmetry in the probability distribution of a real-valued random variable. In an ideal **normal (Gaussian) distribution**, the skewness is **zero**, meaning the distribution is perfectly symmetric around the mean.

- **Positive skew (`skew > 0`)**: Moves **up to 25% of below-mean values above the mean**, making the right tail heftier.
- **Negative skew (`skew < 0`)**: Moves **up to 25% of above-mean values below the mean**, making the left tail heftier.

### **How We Apply Skewness in the Distribution**

Instead of modifying tail steepness, our approach **shifts a percentage of values across the mean** while maintaining a natural-ish Gaussian shape. The function:

```typescript
function gaussianRandom(mean, stdDev, skew) {
  let u1 = Math.random();
  let u2 = Math.random();
  let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  let value = z0 * stdDev + mean;

  // Apply skew: Move a proportion of values across the mean
  let flipChance = Math.abs(skew) * 0.25; // Up to 25% shift
  if (skew > 0 && value < mean && Math.random() < flipChance) {
    value = mean + (mean - value);
  } else if (skew < 0 && value > mean && Math.random() < flipChance) {
    value = mean - (value - mean);
  }
  return value;
}
```

This method ensures that **skew values range from `-1` to `+1`**, with proportional movement:

| Skew Value | Effect                                     |
| ---------- | ------------------------------------------ |
| `-1`       | Moves **25% of above-mean values below**   |
| `-0.5`     | Moves **12.5% of above-mean values below** |
| `0`        | No change, normal Gaussian                 |
| `0.5`      | Moves **12.5% of below-mean values above** |
| `1`        | Moves **25% of below-mean values above**   |

This keeps the Gaussian distribution mostly intact while shifting values appropriately.

## **Explanation of the Box-Muller Transform**

The **Box-Muller transform** is a method for generating normally distributed random numbers from **uniformly distributed random numbers** (i.e., `Math.random()`).

### **How the Box-Muller Transform Works**

1. Generate **two independent uniform random numbers** `u1` and `u2` in the range `[0,1]`:
   ```typescript
   let u1 = Math.random();
   let u2 = Math.random();
   ```
2. Apply the Box-Muller formula:

   ```typescript
   let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
   ```

   - The `Math.log(u1)` term ensures values cluster around zero (Gaussian property).
   - `Math.cos(2πu2)` provides uniform circular sampling, ensuring randomness.

3. This transformation results in `z0`, which is a normally distributed number with:

   - **Mean (`μ`)** of **0**
   - **Standard deviation (`σ`)** of **1**

4. Finally, to scale and shift the result to the desired **mean** and **standard deviation**, we use:
   ```typescript
   return z0 * stdDev + mean;
   ```
   This ensures:
   - Values are centered at `mean`
   - The spread is controlled by `stdDev`

### **Why Use the Box-Muller Transform?**

- It's efficient: generates **two** Gaussian numbers per transformation.
- Uses only basic arithmetic and trigonometry.
- Works well in applications needing high performance.

---

## **Example Use**

Imagine we have a basketball player who is the 90th percentile for the league in shooting free throws, and we know that the league average is 70% for making free throw shots. From this, we can develop parameters and feed them to a Gaussian random number generator to create a realistic set of numbers for this player over multiple games.

```typescript
const freeThrowPercentage = gaussianRandom({ mean: 88, stdDev: 5, skew: -0.5 });
console.log(
  `Simulated Free Throw Percentage: ${freeThrowPercentage.toFixed(2)}%`
);
```

This ensures a **realistic variation in free throw percentages**, allowing for **occasional high and low performances** while keeping the overall distribution accurate.
