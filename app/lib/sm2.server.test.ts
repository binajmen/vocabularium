import { describe, expect, test } from "vitest";
import { sm2 } from "./sm2.server";

describe("first card review", () => {
  test("with good grade", () => {
    expect(sm2({ grade: 5 })).toStrictEqual({
      repetition: 1,
      easinessFactor: 260,
      interval: 1,
    });
  });

  test("with middle grade", () => {
    expect(sm2({ grade: 3 })).toStrictEqual({
      repetition: 1,
      easinessFactor: 236,
      interval: 1,
    });
  });

  test("with bad grade", () => {
    expect(sm2({ grade: 1 })).toStrictEqual({
      repetition: 0,
      easinessFactor: 196,
      interval: 1,
    });
  });
});

describe("second card review", () => {
  test("with good grade", () => {
    expect(
      sm2({ grade: 5, repetition: 1, easinessFactor: 260, interval: 1 })
    ).toStrictEqual({
      repetition: 2,
      easinessFactor: 270,
      interval: 6,
    });
  });

  test("with middle grade", () => {
    expect(
      sm2({ grade: 3, repetition: 1, easinessFactor: 236, interval: 1 })
    ).toStrictEqual({
      repetition: 2,
      easinessFactor: 222,
      interval: 6,
    });
  });

  test("with bad grade", () => {
    expect(
      sm2({ grade: 1, repetition: 1, easinessFactor: 196, interval: 1 })
    ).toStrictEqual({
      repetition: 0,
      easinessFactor: 142,
      interval: 1,
    });
  });
});

describe("third card review", () => {
  test("with bad grade", () => {
    expect(
      sm2({ grade: 1, repetition: 2, easinessFactor: 270, interval: 6 })
    ).toStrictEqual({
      repetition: 0,
      easinessFactor: 216,
      interval: 1,
    });
  });

  test("with middle grade", () => {
    expect(
      sm2({ grade: 5, repetition: 2, easinessFactor: 222, interval: 6 })
    ).toStrictEqual({
      repetition: 3,
      easinessFactor: 232,
      interval: 13,
    });
  });

  test("with bad grade", () => {
    expect(
      sm2({ grade: 5, repetition: 0, easinessFactor: 142, interval: 1 })
    ).toStrictEqual({
      repetition: 1,
      easinessFactor: 152,
      interval: 1,
    });
  });
});
