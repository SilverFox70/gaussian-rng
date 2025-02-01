# Gaussian Random Number Generator

Gaussian-RNG is a lightweight and flexible JavaScript/TypeScript library for generating random numbers that follow a Gaussian (normal) distribution. Unlike standard uniform random number generators, this package ensures that numbers are distributed around a specified mean, with a controlled spread (standard deviation) and an optional skew to shift probability density toward one side.

This library can be useful in scientific simulations, statistical modeling, procedural content generation (e.g., gaming, terrain generation), AI randomness tuning, finance, and Monte Carlo simulations, where naturally occurring variations tend to follow a normal distribution rather than uniform randomness.

With support for bounded Gaussian distributions (ensuring values stay within a given range), custom mean and standard deviation settings, and skew adjustments, Gaussian-RNG provides fine-grained control over random number generation in applications requiring realistic randomness.

## **Understanding Skew in the Gaussian Distribution**

Skewness refers to the asymmetry in the probability distribution of a real-valued random variable. In an ideal **normal (Gaussian) distribution**, the skewness is **zero**, meaning the distribution is perfectly symmetric around the mean.

- **Positive skew (`skew > 0`)**: More values are concentrated **below the mean**, with a longer tail to the right.
- **Negative skew (`skew < 0`)**: More values are concentrated **above the mean**, with a longer tail to the left.

#### **How We Apply Skewness in the Distribution**

In the function:

```typescript
let skewAdjusted = z0 + skew * (z0 ** 3 - z0);
```

We use a **cubic transformation** (`z0 ** 3 - z0`), which subtly shifts values toward one side of the mean. This works as follows:

- The term `(z0 ** 3 - z0)` **exaggerates extreme values**, amplifying the skew.
- Multiplying it by `skew` allows control over how much skew is introduced.
- **Higher values of `skew`** push more numbers toward the left (negative skew).
- **Lower values of `skew`** push more numbers toward the right (positive skew).

This is a simple way to introduce skewness without overly distorting the distribution.

---

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

### **Summary**

1. **Skewing the distribution**:

   - Uses `skew * (z0 ** 3 - z0)` to introduce asymmetry.
   - Positive `skew` skews left, negative `skew` skews right.

2. **Box-Muller Transform**:
   - Converts two uniform random numbers into a normal (Gaussian) distribution.
   - Scales results to a given **mean** and **standard deviation**.

---

## **Example Use**

imagine we have a basketball player who is the 90th percentile for the league in shooting free throws, and we know that the league average is 70% for making free throw shots. From this can we develop parameters and feed them to one of a gaussian random number gens to create a realistic set of numbers for this player for a game or for a season.

### **Step 1: Understanding the Distribution**

- League average free throw percentage: 70%
- 90th percentile shooter: This means the player is better than 90% of the league.
- Expected shooting percentage: Likely higher than 70%, possibly around 85-90%.
- Distribution Type: Normally distributed around the player's true shooting ability.

### **Step 2: Estimating Parameters for Gaussian RNG**

To use our gaussianRandom function, we need:

1. Mean (μ) → The player's expected free throw percentage.

- Let's assume 88% (based on their percentile).

2. Standard Deviation (σ) → The variance in free throws per game.

- A typical standard deviation for shooting percentages is ~5-7%.
- Let's use σ = 5 to represent normal variance.

3. Skew (skew) → If we think the player is more consistent than average, a small negative skew could reflect fewer poor shooting games.

### **Step 3: Implementing the Function**

We can now generate realistic free throw percentages per game:

typescript

```
const freeThrowPercentage = gaussianRandom({ mean: 88, stdDev: 5, skew: -0.5 });
console.log(`Simulated Free Throw Percentage: ${freeThrowPercentage.toFixed(2)}%`);
```

#### **What This Does**

- Generates a realistic free throw percentage for a game.
- Centered at 88%, but allows natural variance (~5%).
- The negative skew (-0.5) slightly reduces extreme low shooting nights.

### **Step 4: Bounded Percentages**

Since free throw percentages must be between 0% and 100%, we should ensure values stay within bounds:

typescript

```
const freeThrowPercentage = boundedGaussianRandom({ min: 50, max: 100, mean: 88, stdDev: 5, skew: -0.5 });
console.log(`Bounded Free Throw Percentage: ${freeThrowPercentage.toFixed(2)}%`);
```

#### **Why Use Bounded Values?**

- Prevents impossible results like >100% or <0%.
- A minimum of 50% ensures even on a bad day, an elite shooter doesn’t fall too low.

#### **Step 5: Simulating Multiple Games**

If we want to simulate a season, we can run multiple trials:

typescript

```
const games = 10; // Simulate 10 games
const gameResults = Array.from({ length: games }, () =>
  boundedGaussianRandom({ min: 50, max: 100, mean: 88, stdDev: 5, skew: -0.5 })
);

console.log("Simulated Free Throw Percentages for 10 Games:", gameResults.map(p => p.toFixed(2) + "%"));
```
