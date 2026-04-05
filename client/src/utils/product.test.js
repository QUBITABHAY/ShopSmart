import { describe, it, expect } from "vitest";
import { getRatingStats } from "./product";

describe("product utils", () => {
  describe("getRatingStats", () => {
    it("should return empty stats for null product", () => {
      const stats = getRatingStats(null);
      expect(stats.rating).toBe(0);
      expect(stats.reviewCount).toBe(0);
      expect(stats.distribution).toHaveLength(5);
    });

    it("should correctly calculate stats for a product with ratings", () => {
      const product = {
        ratingStars: {
          five_stars: 10,
          four_stars: 5,
          three_stars: 2,
          two_stars: 1,
          one_star: 2,
        },
      };
      const stats = getRatingStats(product);
      expect(stats.reviewCount).toBe(20);
      expect(stats.rating).toBe(4.0); // (50+20+6+2+2)/20 = 80/20 = 4.0
      expect(stats.distribution[0].count).toBe(10); // 5 stars
      expect(stats.distribution[0].percentage).toBe(50);
    });

    it("should handle numeric keys in ratingStars", () => {
      const product = {
        ratingStars: {
          5: 10,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      };
      const stats = getRatingStats(product);
      expect(stats.reviewCount).toBe(10);
      expect(stats.rating).toBe(5.0);
    });

    it("should return zeros when ratingStars is empty", () => {
      const product = { ratingStars: {} };
      const stats = getRatingStats(product);
      expect(stats.rating).toBe(0);
      expect(stats.reviewCount).toBe(0);
      expect(stats.distribution.every((d) => d.percentage === 0)).toBe(true);
    });
  });
});
