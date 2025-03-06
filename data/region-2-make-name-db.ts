import * as fs from "fs";
import * as readline from "readline";
import { Level } from "level";
import path from "path";

// 대체 이름 정보를 나타내는 인터페이스
interface AlternateName {
  alternateNameId: string;
  language: string;
  alternateName: string;
  isPreferredName: boolean;
  isShortName: boolean;
  isColloquial: boolean;
  isHistoric: boolean;
}

/**
 * alternateNames.txt 파일을 LevelDB로 변환하는 함수
 * @param filePath alternateNames.txt 파일 경로
 * @param dbPath LevelDB 저장 경로
 */
async function convertAlternateNamesToLevelDB(
  filePath: string,
  dbPath: string
): Promise<void> {
  // LevelDB 인스턴스 생성 (값을 JSON으로 인코딩)
  const db = new Level(dbPath, { valueEncoding: "json" });

  // 파일을 스트리밍 방식으로 읽기 위한 readline 인터페이스
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: "utf8" }),
    crlfDelay: Infinity, // 모든 줄바꿈 처리
  });

  let lineCount = 0;

  // 라인 단위로 파일 읽기
  rl.on("line", async (line) => {
    const fields = line.split("\t");
    // 필드가 8개 미만이면 유효하지 않은 라인으로 간주
    if (fields.length < 8) {
      console.error(`유효하지 않은 라인: ${line}`);
      return;
    }

    // 필드 파싱
    const [
      alternateNameId,
      geonameId,
      language,
      alternateName,
      isPreferredName,
      isShortName,
      isColloquial,
      isHistoric,
    ] = fields;

    // 대체 이름 객체 생성
    const alternateNameObj: AlternateName = {
      alternateNameId,
      language,
      alternateName,
      isPreferredName: isPreferredName === "1",
      isShortName: isShortName === "1",
      isColloquial: isColloquial === "1",
      isHistoric: isHistoric === "1",
    };

    try {
      // 기존 데이터 가져오기 (없으면 빈 배열)
      let existing: AlternateName[] = [];
      try {
        const predata = await db.get(geonameId);
        existing = predata ? JSON.parse(predata) : [];
      } catch (err) {
        if (err.notFound) {
          // 키가 없으면 새로 생성
        } else {
          throw err;
        }
      }

      // 새로운 대체 이름 추가
      existing.push(alternateNameObj);
      await db.put(geonameId, JSON.stringify(existing));
    } catch (err) {
      console.error(`geonameId ${geonameId} 처리 중 오류:`, err);
    }

    // 진행 상황 로깅 (10,000줄마다)
    lineCount++;
    if (lineCount % 10000 === 0) {
      console.log(`${lineCount}줄 처리 완료`);
    }
  });

  // 파일 처리 완료 시
  return new Promise((resolve) => {
    rl.on("close", async () => {
      console.log("alternateNames.txt 처리 완료");
      console.log("20 초 대기 시작....");
      await new Promise((resolve) => setTimeout(resolve, 20000)); // 20초 대기
      await db.close();
      console.log("프로그램 종료....");
      resolve();
    });
  });
}

// 스크립트 실행 예시
async function main() {
  const filePath = path.join(
    process.cwd(),
    "data",
    "Region-Dataset",
    "Region-Level-2",
    "alternateNames.txt"
  );
  const dbPath = path.join(
    process.cwd(),
    "data",
    "Region-Dataset",
    "Region-Level-2",
    "alternateNames.db"
  );
  try {
    await convertAlternateNamesToLevelDB(filePath, dbPath);
    console.log("LevelDB 변환 성공");
  } catch (err) {
    console.error("변환 중 오류 발생:", err);
  }
}

main();
