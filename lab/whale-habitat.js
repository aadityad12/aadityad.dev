export const WHALE_CLEARANCE = 64;
export const WHALE_SCALE = 2;
export const WHALE_ENCOUNTER_MS = 26000;

export function whaleHabitat(at, waterAt) {
  const regions = [
    { name: "north", west: -122.44, east: -122.37, south: 37.82, north: 37.89 },
    { name: "central", west: -122.37, east: -122.29, south: 37.72, north: 37.81 },
    { name: "lower", west: -122.28, east: -122.18, south: 37.61, north: 37.71 },
  ];
  const offsets = [];
  for (let horizontal = -WHALE_CLEARANCE; horizontal <= WHALE_CLEARANCE; horizontal += 4) {
    for (let vertical = -WHALE_CLEARANCE; vertical <= WHALE_CLEARANCE; vertical += 4) {
      if (Math.hypot(horizontal, vertical) <= WHALE_CLEARANCE + 3) offsets.push([horizontal, vertical]);
    }
  }
  const spots = [];
  for (const region of regions) {
    for (let lon = region.west; lon <= region.east; lon += 0.008) {
      for (let lat = region.south; lat <= region.north; lat += 0.008) {
        const position = at(lon, lat);
        if (offsets.every(([horizontal, vertical]) => waterAt(position.x + horizontal, position.z + vertical))) {
          spots.push({ x: position.x, z: position.z, region: region.name });
        }
      }
    }
  }
  return spots;
}

export function whaleEncounters(spots, random = Math.random) {
  let previous = null;
  let startsAt = 8000 + random() * 10000;
  let active = false;
  return (time) => {
    if (time < startsAt) return null;
    if (!active) {
      const regions = [...new Set(spots.map((spot) => spot.region))].filter((region) => !previous || region !== previous.region);
      const region = regions[Math.floor(random() * regions.length)];
      const pool = region ? spots.filter((spot) => spot.region === region) : spots.filter((spot) => !previous || Math.hypot(spot.x - previous.x, spot.z - previous.z) > 80);
      if (!pool.length) return null;
      previous = { ...pool[Math.floor(random() * pool.length)], yaw: random() * Math.PI * 2 };
      active = true;
    }
    const elapsed = time - startsAt;
    if (elapsed >= WHALE_ENCOUNTER_MS) {
      startsAt = time + 28000 + random() * 30000;
      active = false;
      return null;
    }
    return { ...previous, elapsed };
  };
}
