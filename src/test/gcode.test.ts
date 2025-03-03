import { encode, decode } from "../lib/gcode";
import { checkMaximumRange } from "./test-utils";

describe("GCode", () => {
  describe("encode/decode", () => {
    it("should correctly encode and decode coordinates", async () => {
      const center = { lat: 37.5665, lng: 126.978 };
      const target = { lat: 37.5666, lng: 126.9781 };

      const encoded = await encode(target, { center });
      const decoded = decode({ center, encoded });

      expect(decoded.lat).toBeCloseTo(target.lat, 4);
      expect(decoded.lng).toBeCloseTo(target.lng, 4);
    });
  });

  describe("checkMaximumRange", () => {
    it("should return correct range in meters", () => {
      const result = checkMaximumRange({ n: 100, precisionMeters: 3 });
      expect(result).toMatch(/^\d+(\.\d+)?(m|km)$/);
    });

    it("should handle kilometer conversion", () => {
      const result = checkMaximumRange({ n: 1000000, precisionMeters: 3 });
      expect(result).toMatch(/^\d+(\.\d+)?km$/);
    });

    it("should use default precision if not provided", () => {
      const result = checkMaximumRange({ n: 100 });
      expect(result).toMatch(/^\d+(\.\d+)?(m|km)$/);
    });
  });
});
