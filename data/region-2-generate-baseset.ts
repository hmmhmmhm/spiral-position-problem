import fs from "fs";
import path from "path";

// Load cities500
const cities500FilePath = path.join(
  process.cwd(),
  "data",
  "Region-Dataset",
  "Region-Level-2",
  "cities500.json"
);
const cities500 = JSON.parse(fs.readFileSync(cities500FilePath, "utf8")) as {
  name: string;
  code: string;
  lat: number;
  long: number;
}[];

console.log(`Collected cities500 count: ${cities500.length}`);

const regionLevel2PreTranslationPath = path.join(
  process.cwd(),
  "data",
  "Region-Dataset",
  "Region-Level-2",
  "Pre-Translation",
  "BaseSet"
);

fs.mkdirSync(regionLevel2PreTranslationPath, { recursive: true });

console.log(
  "Splitting regions into batches of 100 and saving as JSON files..."
);

// Format each region as "Label (Lat, Long)\n"
const formattedRegions = cities500.map(
  (city) => `${city.name} (${city.lat}, ${city.long})`
);

// Split into batches of 100
const batchSize = 100;
const batches: string[][] = [];

for (let i = 0; i < formattedRegions.length; i += batchSize) {
  batches.push(formattedRegions.slice(i, i + batchSize));
}

if (!fs.existsSync(regionLevel2PreTranslationPath)) {
  fs.mkdirSync(regionLevel2PreTranslationPath, { recursive: true });
}

// Save each batch as a separate JSON file
batches.forEach((batch, index) => {
  const batchFilePath = path.join(
    regionLevel2PreTranslationPath,
    `batch-${index + 1}.txt`
  );
  fs.writeFileSync(batchFilePath, batch.join("\n"));
  console.log(
    `Saved batch ${index + 1} with ${batch.length} regions to ${batchFilePath}`
  );
});

console.log(`Total batches created: ${batches.length}`);
