import fs from "fs";
import path from "path";
import { input } from "@inquirer/prompts";
import { Level } from "level";

// Load alternate names DB
const dbPath = path.join(
  process.cwd(),
  "data",
  "Region-Dataset",
  "Region-Level-2",
  "alternateNames.db"
);
const db = new Level(dbPath, { valueEncoding: "json" });

// Request language
const language = await input({
  message: "Please enter a language name. (e.g. Korean)",
});

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

for (const city of cities500) {
  if (city.name !== "New York City") continue;

  // Find alternate names
  const alternateNames = JSON.parse(await db.get(city.code)) as {
    alternateNameId: string;
    language: string;
    alternateName: string;
    isPreferredName: boolean;
    isShortName: boolean;
    isColloquial: boolean;
    isHistoric: boolean;
  }[];
  console.log({ city, alternateNames });
  break;
}
