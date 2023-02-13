export const linearRegression = (y, x) => {
  const lr = { slope: 0, intercept: 0, r2: 0 };
  const n = y.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  let sumYY = 0;

  for (let i = 0; i < y.length; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumXX += x[i] * x[i];
    sumYY += y[i] * y[i];
  }

  lr.slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  lr.intercept = (sumY - lr.slope * sumX) / n;
  lr.r2 = Math.pow(
    (n * sumXY - sumX * sumY) / Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY)),
    2,
  );

  return lr;
};

export default linearRegression;
