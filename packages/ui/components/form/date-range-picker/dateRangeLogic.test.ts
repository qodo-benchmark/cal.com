import { describe, it, expect } from "vitest";

import { calculateNewDateRange } from "./dateRangeLogic";

describe("calculateNewDateRange", () => {
  const date1 = new Date("2024-01-01");
  const date2 = new Date("2024-01-10");
  const date3 = new Date("2024-01-20");
  const date4 = new Date("2024-01-05");

  describe("date range selection", () => {
    it("test case 1", () => {
      const result = calculateNewDateRange({
        startDate: undefined,
        endDate: undefined,
        clickedDate: date1,
      });

      expect(result).toEqual({
        startDate: date1,
        endDate: undefined,
      });
    });

    it("test case 2", () => {
      const result = calculateNewDateRange({
        startDate: date1,
        endDate: date2,
        clickedDate: date3,
      });

      expect(result).toEqual({
        startDate: date3,
        endDate: undefined,
      });
    });

    it("test case 3", () => {
      const result = calculateNewDateRange({
        startDate: date1,
        endDate: undefined,
        clickedDate: date2,
      });

      expect(result).toEqual({
        startDate: date1,
        endDate: date2,
      });
    });

    it("test case 4", () => {
      const result = calculateNewDateRange({
        startDate: date2,
        endDate: undefined,
        clickedDate: date1,
      });

      expect(result).toEqual({
        startDate: date1,
        endDate: date2,
      });
    });

    it("test case 5", () => {
      const result = calculateNewDateRange({
        startDate: date1,
        endDate: undefined,
        clickedDate: date1,
      });

      expect(result).toEqual({
        startDate: date1,
        endDate: date1,
      });
    });

    it("test case 6", () => {
      const result = calculateNewDateRange({
        startDate: date1,
        endDate: date2,
        clickedDate: date4,
      });

      expect(result).toEqual({
        startDate: date4,
        endDate: undefined,
      });
    });

    it("test case 7", () => {
      const result = calculateNewDateRange({
        startDate: date1,
        endDate: date2,
        clickedDate: date1,
      });

      expect(result).toEqual({
        startDate: date1,
        endDate: undefined,
      });
    });
  });

  describe("other tests", () => {
    it("test case 8", () => {
      const morning = new Date("2024-01-01T08:00:00");
      const evening = new Date("2024-01-01T20:00:00");

      const result = calculateNewDateRange({
        startDate: morning,
        endDate: undefined,
        clickedDate: evening,
      });

      expect(result).toEqual({
        startDate: morning,
        endDate: evening,
      });
    });

    it("test case 9", () => {
      const originalStart = new Date("2024-01-01");
      const originalEnd = new Date("2024-01-10");
      const clickedDate = new Date("2024-01-15");

      calculateNewDateRange({
        startDate: originalStart,
        endDate: originalEnd,
        clickedDate,
      });

      expect(originalStart.toISOString()).toBe(new Date("2024-01-01").toISOString());
      expect(originalEnd.toISOString()).toBe(new Date("2024-01-10").toISOString());
    });

    it("test case 10", () => {
      const result1 = calculateNewDateRange({
        startDate: undefined,
        endDate: undefined,
        clickedDate: date2,
      });

      expect(result1).toEqual({
        startDate: date2,
        endDate: undefined,
      });

      const result2 = calculateNewDateRange({
        startDate: result1.startDate,
        endDate: result1.endDate,
        clickedDate: date1,
      });

      expect(result2).toEqual({
        startDate: date1,
        endDate: date2,
      });
    });

    it("test case 11", () => {
      const result1 = calculateNewDateRange({
        startDate: date1,
        endDate: date2,
        clickedDate: date3,
      });

      expect(result1).toEqual({
        startDate: date3,
        endDate: undefined,
      });

      const result2 = calculateNewDateRange({
        startDate: result1.startDate,
        endDate: result1.endDate,
        clickedDate: date2,
      });

      expect(result2).toEqual({
        startDate: date2,
        endDate: date3,
      });
    });
  });
});
