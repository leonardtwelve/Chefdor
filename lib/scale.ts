export function scaleAmount(
  amount: number,
  fromServings: number,
  toServings: number,
  isScalable: boolean,
): number {
  if (!isScalable) return amount;
  if (fromServings <= 0) return amount;
  return (amount * toServings) / fromServings;
}

const VULGAR_FRACTIONS: Record<string, string> = {
  "0.125": "⅛",
  "0.25": "¼",
  "0.333": "⅓",
  "0.5": "½",
  "0.667": "⅔",
  "0.75": "¾",
};

function fractionGlyph(decimal: number): string | null {
  const rounded = Math.round(decimal * 1000) / 1000;
  for (const [key, glyph] of Object.entries(VULGAR_FRACTIONS)) {
    if (Math.abs(rounded - Number(key)) < 0.02) return glyph;
  }
  return null;
}

export function formatAmount(amount: number): string {
  if (!Number.isFinite(amount)) return "";
  if (amount === 0) return "0";

  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(amount);
  const whole = Math.floor(abs);
  const decimal = abs - whole;

  const glyph = fractionGlyph(decimal);
  if (glyph) {
    return sign + (whole === 0 ? glyph : `${whole}${glyph}`);
  }

  if (Number.isInteger(abs)) return sign + String(whole);

  const rounded = Math.round(abs * 100) / 100;
  if (Number.isInteger(rounded)) return sign + String(rounded);

  const oneDecimal = Math.round(abs * 10) / 10;
  if (Math.abs(rounded - oneDecimal) < 0.005) {
    return sign + oneDecimal.toString().replace(".", ",");
  }
  return sign + rounded.toString().replace(".", ",");
}
