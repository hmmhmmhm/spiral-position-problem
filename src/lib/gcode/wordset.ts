import { toBaseN } from "./base-n";

export type SupportedLanguage = "English" | "Korean";

export const WordSetBaseCount: Record<SupportedLanguage, number> = {
  English: 6000,
  Korean: 5630,
};

export const encodeByWordSet = async ({
  n,
  language = "English",
}: {
  n: number;
  language?: SupportedLanguage;
}) => {
  let wordSet: string[] | null = null;
  const baseSet = toBaseN(n, WordSetBaseCount[language]);

  if (language === "English") {
    wordSet = (await import("../../../data/Wordset/english.json"))
      .default as string[];
  } else if (language === "Korean") {
    wordSet = (await import("../../../data/Wordset/korean.json"))
      .default as string[];
  } else {
    throw new Error(`Invalid language: ${language}`);
  }

  const encodedBaseSet = baseSet.map((digit) => wordSet[digit]);
  return encodedBaseSet.join("-");
};
