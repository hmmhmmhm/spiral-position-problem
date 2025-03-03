import fs from "fs";
import path from "path";

const iso3166Alpha2 = JSON.parse(
  fs.readFileSync(
    path.join(
      process.cwd(),
      "data",
      "Region-Dataset",
      "Region-Level-1",
      "iso-3166-1-alpha-2.json"
    ),
    "utf-8"
  )
);
const iata = JSON.parse(
  fs.readFileSync(
    path.join(
      process.cwd(),
      "data",
      "Region-Dataset",
      "Region-Level-1",
      "iata.json"
    ),
    "utf-8"
  )
);
const icao = JSON.parse(
  fs.readFileSync(
    path.join(
      process.cwd(),
      "data",
      "Region-Dataset",
      "Region-Level-1",
      "icao.json"
    ),
    "utf-8"
  )
);

console.log(`Collected ${iso3166Alpha2.length} ISO 3166-1 Alpha-2 regions.`);
console.log(`Collected ${iata.length} IATA regions.`);
console.log(`Collected ${icao.length} ICAO regions.`);

const regions = [...iso3166Alpha2, ...iata, ...icao];

console.log(`Total Collected ${regions.length} regions.`);

fs.writeFileSync(
  path.join(process.cwd(), "data", "Region", "region-1.json"),
  JSON.stringify(regions, null, 2),
  "utf-8"
);
