import { printMaximumRange, formatNumber } from "./test-utils";

describe("Range Tests", () => {
  describe("printMaximumRange", () => {
    const mockConsoleLog = jest.spyOn(console, "log");
    const mockConsoleTable = jest.spyOn(console, "table");

    beforeEach(() => {
      mockConsoleLog.mockClear();
      mockConsoleTable.mockClear();
    });

    it("should print range for decimal base", () => {
      printMaximumRange({
        base: 10,
        precisionMeters: 3,
        length: 12,
      });

      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(
          "Maximum representable distance per digit position in base-10 with 3m precision."
        )
      );
      expect(mockConsoleTable).toHaveBeenCalled();
    });

    it("should print range for base-32", () => {
      printMaximumRange({
        base: 32,
        precisionMeters: 3,
        length: 9,
      });

      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(
          "Maximum representable distance per digit position in base-32 with 3m precision."
        )
      );
      expect(mockConsoleTable).toHaveBeenCalled();
    });
  });

  describe("formatNumber", () => {
    it("should format decimal numbers correctly", () => {
      expect(formatNumber(123456, 10)).toBe("(e.g: 123 456)");
      expect(formatNumber(123456789, 10)).toBe("(e.g: 123 456 789)");
    });

    it("should return empty string for invalid base", () => {
      expect(formatNumber(123456, 33)).toBe("");
    });
  });
});
