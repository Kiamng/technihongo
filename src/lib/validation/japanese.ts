export const isMostlyJapanese = (
  text: string,
  threshold: number = 0.8,
): boolean => {
  const japaneseCharRegex =
    /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー]/gu;
  const emojiOrSymbolRegex =
    /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

  const japaneseChars = text.match(japaneseCharRegex) || [];
  const emojiChars = text.match(emojiOrSymbolRegex) || [];

  const totalChars = text.length;

  if (emojiChars.length > 0) return false;
  if (totalChars <= 2) return japaneseChars.length === totalChars;

  const ratio = japaneseChars.length / totalChars;

  return ratio >= threshold;
};

export const isKanaOnly = (text: string): boolean => {
  const kanaOnlyRegex =
    /^[\p{Script=Hiragana}\p{Script=Katakana}\sー・、。！？～]+$/u;

  return kanaOnlyRegex.test(text.trim());
};

export const isMostlyJapaneseParagraph = (
  text: string,
  threshold: number = 0.8,
): boolean => {
  const japaneseCharRegex =
    /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー]/gu;

  const ignorableCharRegex = /[\p{Punctuation}\p{Separator}\p{ASCII}]/gu;

  // Đếm ký tự Nhật
  const japaneseChars = text.match(japaneseCharRegex) || [];

  // Bỏ qua các ký tự không mang tính ngôn ngữ rõ ràng (dấu câu, khoảng trắng, ký tự Latin,...)
  const significantChars = text.replace(ignorableCharRegex, "");
  const totalSignificantChars = significantChars.length;

  if (totalSignificantChars === 0) return false;

  const ratio = japaneseChars.length / totalSignificantChars;

  return ratio >= threshold;
};
