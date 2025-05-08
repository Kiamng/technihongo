export const containsEmoji = (text: string) =>
  /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu.test(text);

export const isVietnameseOrEnglish = (text: string) => {
  const vietnamese = /[à-ỹÀ-Ỹ]/;
  const english = /^[a-zA-Z\s.,!?'"()\-–…:;]+$/;

  return vietnamese.test(text) || english.test(text);
};
