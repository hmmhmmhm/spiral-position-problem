import * as fs from "fs";
import path from "path";

const inputFile = path.join(
  process.cwd(),
  "data",
  "Region-Dataset",
  "Region-Level-2",
  "cities500.txt"
);
const outputFile = path.join(
  process.cwd(),
  "data",
  "Region-Dataset",
  "Region-Level-2",
  "cities500.json"
);

console.log("Starting cities500 data processing script...");
main().catch((error) => {
  console.error("Error in main execution:", error);
  console.error(error.stack);
});

async function main() {
  if (!fs.existsSync(inputFile)) {
    console.error(`Input file not found: ${inputFile}`);
    console.error(
      "Please download the cities500.txt file from here: https://download.geonames.org/export/dump/cities500.zip"
    );
    return;
  }

  console.log("Starting main function...");
  console.log(`Cities input file path: ${inputFile}`);
  console.log(`Output file path: ${outputFile}`);

  console.log("Step 1: Building alternate names database...");
  // 1. alternateNames.txt를 LevelDB로 변환
  const startTime1 = Date.now();
  console.log(
    `Alternate names DB built in ${(Date.now() - startTime1) / 1000} seconds`
  );

  console.log("Step 2: Processing cities file...");
  // 2. cities5000.txt 처리
  const startTime2 = Date.now();
  await processCitiesFile(inputFile, outputFile);
  console.log(
    `Cities file processed in ${(Date.now() - startTime2) / 1000} seconds`
  );

  console.log("All processing complete!");
}

async function processCitiesFile(
  inputFile: string,
  outputFile: string
): Promise<void> {
  console.log(
    `Starting processCitiesFile with input: ${inputFile}, output: ${outputFile}`
  );
  console.log("Reading cities file...");
  const fileContent = await fs.promises.readFile(inputFile, "utf8");
  const lines = fileContent.split("\n");
  console.log(`File read complete. Total lines: ${lines.length}`);

  const cityMap = new Map<string, any>();
  console.log("Starting to process each city line...");

  let processedCount = 0;
  let skippedCount = 0;
  let duplicateCount = 0;
  let replacedCount = 0;

  for (const line of lines) {
    if (!line.trim()) {
      skippedCount++;
      continue;
    }

    const columns = line.split("\t");
    if (columns.length < 19) {
      console.log(`Skipping line with insufficient columns: ${columns.length}`);
      skippedCount++;
      continue;
    }

    const [
      geonameId,
      name,
      asciiName,
      alternateNamesRaw,
      latitude,
      longitude,
      featureClass,
      featureCode,
      countryCode,
      cc2,
      admin1Code,
      admin2Code,
      admin3Code,
      admin4Code,
      population,
    ] = columns;

    const lat = parseFloat(latitude);
    const long = parseFloat(longitude);
    const pop = parseInt(population, 10) || 0;

    if (isNaN(lat) || isNaN(long)) {
      skippedCount++;
      continue;
    }

    const cityName = asciiName || name;
    // Duplicate city name handling: Select city with larger population
    if (cityMap.has(cityName)) {
      duplicateCount++;
      const existingCity = cityMap.get(cityName)!;
      if (pop > existingCity.population) {
        console.log(`Replacing with larger population city: ${cityName}`);
        replacedCount++;
        cityMap.set(cityName, {
          name: cityName,
          code: geonameId,
          lat,
          long,
          population: pop,
        });
      }
    } else {
      cityMap.set(cityName, {
        name: cityName,
        code: geonameId,
        lat,
        long,
        population: pop,
      });
    }

    processedCount++;
    if (processedCount % 100 === 0) {
      console.log(`Processed ${processedCount} cities so far...`);
    }
  }

  // Converting city map to array
  console.log("\nConverting city map to array...");
  const cities = Array.from(cityMap.values());
  console.log(`Total unique cities: ${cities.length}`);

  console.log(`Writing JSON output to: ${outputFile}`);
  const jsonContent = JSON.stringify(
    // Remove population field
    cities.map((city) => ({
      name: city.name,
      code: city.code,
      lat: city.lat,
      long: city.long,
    })),
    null,
    2
  );
  await fs.promises.writeFile(outputFile, jsonContent, "utf8");

  console.log(`\n\nProcessing statistics:`);
  console.log(`- Total lines processed: ${processedCount + skippedCount}`);
  console.log(`- Valid cities processed: ${processedCount}`);
  console.log(`- Lines skipped: ${skippedCount}`);
  console.log(`- Duplicate city names found: ${duplicateCount}`);
  console.log(`- Cities replaced due to higher population: ${replacedCount}`);
  console.log(`\n\nProcessed ${cities.length} unique cities.`);
}
