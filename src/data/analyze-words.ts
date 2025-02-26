import "dotenv/config";
import { input } from "@inquirer/prompts";
import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import * as glob from "glob";

console.clear();
console.log(
  chalk.green(
    "This command runs through the process of generating a wordset using generative AI."
  )
);

const language = await input({
  message: "Please enter a language name. (e.g. Korean)",
});

const prefix = await input({
  message: "Please enter a file prefix name. (e.g. generated)",
});

let totalArrays = 0;
const allWords = new Set<string>();
const duplicateWords = new Set<string>();
const wordCount: { [key: string]: number } = {};
const wordLengthStats: { [key: number]: number } = {};
const wordsByLength: { [key: number]: Set<string> } = {};
const emptyArrayIndices: number[] = [];

const pattern = path.join(
  process.cwd(),
  "data",
  `${language}-Wordset`,
  `${prefix}-*.json`
);
const files = glob.sync(pattern);

console.log(`Found ${files.length} files for ${language}`);

for (const file of files) {
  const content = JSON.parse(await fs.readFile(file, "utf-8"));
  if (Array.isArray(content)) {
    totalArrays++;
    if (content.length === 0) {
      // 파일명에서 인덱스 추출
      const fileName = path.basename(file);
      const match = fileName.match(new RegExp(`${prefix}-(\\d+)\\.json`));
      if (match && match[1] !== undefined) {
        const fileIndex = parseInt(match[1]);
        emptyArrayIndices.push(fileIndex);
      }
    }
    for (const word of content) {
      if (typeof word === "string") {
        if (wordCount[word]) {
          duplicateWords.add(word);
          wordCount[word]++;
        } else {
          wordCount[word] = 1;
          // 고유 단어만 길이 통계에 추가
          const wordLength = word.length;
          wordLengthStats[wordLength] = (wordLengthStats[wordLength] || 0) + 1;

          // 길이별 단어 목록 저장
          if (!wordsByLength[wordLength]) {
            wordsByLength[wordLength] = new Set();
          }
          wordsByLength[wordLength].add(word);
        }
        allWords.add(word);
      }
    }
  }
}

console.log("\nAnalysis Results:");
console.log("----------------");
console.log(`Total arrays found: ${totalArrays}`);
console.log(`Total unique words: ${allWords.size}`);
console.log(`Number of duplicate words: ${duplicateWords.size}`);

if (emptyArrayIndices.length > 0) {
  console.log(
    `\nEmpty arrays found at indices: ${emptyArrayIndices.join(", ")}`
  );
  console.log(`Total empty arrays: ${emptyArrayIndices.length}`);
}

console.log(
  `Total words (including duplicates): ${Object.values(wordCount).reduce(
    (a, b) => a + b,
    0
  )}`
);

console.log(`Duplicate words: ${duplicateWords.size}`);

// 단어 길이 통계 출력
console.log("\nWord length statistics:");
const sortedLengths = Object.keys(wordLengthStats)
  .map(Number)
  .sort((a, b) => a - b);
let totalUniqueWords = 0;
for (const length of sortedLengths) {
  totalUniqueWords += wordLengthStats[length]!;
}

for (const length of sortedLengths) {
  const count = wordLengthStats[length]!;
  const percentage = ((count / totalUniqueWords) * 100).toFixed(1);
  let output = `${length} characters: ${count} words (${percentage}%)`;

  // 단어가 1개인 경우 해당 단어 표시
  const wordsOfLength = wordsByLength[length];
  if (count === 1 && wordsOfLength && wordsOfLength.size === 1) {
    const word = Array.from(wordsOfLength)[0];
    output += ` - "${word}"`;
  }

  console.log(output);
}
