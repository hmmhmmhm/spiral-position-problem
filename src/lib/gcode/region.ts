export interface Region {
  name: string;
  code: string;
  lat: number;
  long: number;
}

export const findClosestRegion = async (
  {
    lat,
    lng,
  }: {
    lat: number;
    lng: number;
  },
  options?: {
    regionLevel?: number;
  }
) => {
  const { regionLevel = 1 } = options ?? {};

  let regions: Region[] = [];
  if (regionLevel === 1) {
    const region1 = (await import("../../../data/Region/region-1.json"))
      .default as Region[];
    regions = region1;
  } else if (regionLevel == 2) {
    const region2 = (await import("../../../data/Region/region-2.json"))
      .default as Region[];
    regions = region2;
  } else {
    throw new Error(`Invalid region level: ${regionLevel}`);
  }

  // Find the region that contains the target
  let closestRegion: {
    name: string;
    code: string;
    lat: number;
    lng: number;
  } | null = null;

  let closestRegionDistance = Infinity;

  for (const region of regions) {
    // Calculate the distance between the target point and the region's center
    const distance = calculateDistance(lat, lng, region.lat, region.long);

    // Update the closest region if this one is closer
    if (distance < closestRegionDistance) {
      closestRegionDistance = distance;
      closestRegion = {
        name: region.name,
        code: region.code,
        lat: region.lat,
        lng: region.long,
      };
    }
  }

  return closestRegion;
};

/**
 * Calculates the distance between two points on the Earth's surface using the Haversine formula.
 *
 * @param {number} lat1 - Latitude of the first point in degrees
 * @param {number} lon1 - Longitude of the first point in degrees
 * @param {number} lat2 - Latitude of the second point in degrees
 * @param {number} lon2 - Longitude of the second point in degrees
 * @returns {number} Distance between the points in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Earth's radius in kilometers
  const R = 6371;

  // Convert degrees to radians
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Converts degrees to radians
 *
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
