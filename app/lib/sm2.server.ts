type SM2Input = {
  grade: number;
  repetition?: number;
  easinessFactor?: number;
  interval?: number;
};

export function sm2({
  grade,
  repetition = 0,
  easinessFactor = 250,
  interval = 0,
}: SM2Input): { repetition: number; easinessFactor: number; interval: number } {
  easinessFactor /= 100; // stored as integer in the database

  // Correct response
  if (grade >= 3) {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easinessFactor);
    }
    repetition++;
  }
  // Incorrect response
  else {
    repetition = 0;
    interval = 1;
  }

  easinessFactor =
    easinessFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (easinessFactor < 1.3) {
    easinessFactor = 1.3;
  }

  easinessFactor = Math.round(easinessFactor * 100); // stored as integer in the database
  return { repetition, easinessFactor, interval };
}
