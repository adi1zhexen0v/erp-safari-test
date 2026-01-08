// @ts-expect-error - qazaq-tili не имеет типов
import qts from "qazaq-tili";
// @ts-expect-error - russian-nouns-js не имеет типов
import RussianNouns from "russian-nouns-js";

export function kkInflect(text: string, caseNumber: number): string {
  if (!text) return "";
  return qts(text, caseNumber);
}

const engine = new RussianNouns.Engine();

export function ruInflect(text: string, caseNumber: number): string {
  if (!text) return "";

  const caseMap: Record<number, RussianNouns.Case> = {
    0: RussianNouns.Case.NOMINATIVE,
    1: RussianNouns.Case.GENITIVE,
    2: RussianNouns.Case.DATIVE,
    3: RussianNouns.Case.ACCUSATIVE,
    4: RussianNouns.Case.INSTRUMENTAL,
    5: RussianNouns.Case.PREPOSITIONAL,
  };

  const grammaticalCase = caseMap[caseNumber];
  if (!grammaticalCase) return text;

  try {
    const forms = engine.decline({ text, gender: RussianNouns.Gender.MASCULINE }, grammaticalCase);
    return forms?.[0] ?? text;
  } catch (error) {
    console.error("Ошибка при склонении текста", error);
    return text;
  }
}

