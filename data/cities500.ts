import * as fs from "fs";
import path from "path";

console.log("Starting cities500 data processing script...");

// cities5000.txt를 처리하는 함수
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

  const cityMap = new Map<string, any>(); // 중복된 이름을 관리하기 위한 Map
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
      geonameId, // 0
      name, // 1: 기본 이름
      asciiName, // 2
      alternateNamesRaw, // 3: 사용 안 함 (LevelDB에서 조회)
      latitude, // 4
      longitude, // 5
      featureClass, // 6
      featureCode, // 7
      countryCode, // 8
      cc2, // 9
      admin1Code, // 10
      admin2Code, // 11
      admin3Code, // 12
      admin4Code, // 13
      population, // 14: 인구수
    ] = columns;

    const lat = parseFloat(latitude);
    const long = parseFloat(longitude);
    const pop = parseInt(population, 10) || 0;

    if (isNaN(lat) || isNaN(long)) {
      skippedCount++;
      continue;
    }

    const cityName = asciiName || name;
    // 중복된 이름 처리: 인구수가 더 큰 도시 선택
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

  // Map의 값을 배열로 변환
  console.log("\nConverting city map to array...");
  const cities = Array.from(cityMap.values());
  console.log(`Total unique cities: ${cities.length}`);

  // JSON으로 저장
  console.log(`Writing JSON output to: ${outputFile}`);
  const jsonContent = JSON.stringify(cities, null, 2);
  await fs.promises.writeFile(outputFile, jsonContent, "utf8");

  console.log(`\n\nProcessing statistics:`);
  console.log(`- Total lines processed: ${processedCount + skippedCount}`);
  console.log(`- Valid cities processed: ${processedCount}`);
  console.log(`- Lines skipped: ${skippedCount}`);
  console.log(`- Duplicate city names found: ${duplicateCount}`);
  console.log(`- Cities replaced due to higher population: ${replacedCount}`);
  console.log(`\n\nProcessed ${cities.length} unique cities.`);
}

// 실행 함수
async function main() {
  console.log("Starting main function...");
  const inputFile = path.join(
    process.cwd(),
    "data",
    "Region-Dataset",
    "Region-Level-2",
    "cities500.txt"
  );
  console.log(`Cities input file path: ${inputFile}`);

  const outputFile = path.join(
    process.cwd(),
    "data",
    "Region-Dataset",
    "Region-Level-2",
    "cities500.json"
  );
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

// 실행
console.log("Script execution started");
main().catch((error) => {
  console.error("Error in main execution:", error);
  console.error(error.stack);
});
