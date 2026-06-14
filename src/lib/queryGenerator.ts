export function generateQueryVariations(question: string): string[] {
  const cleanQ = question.trim().replace(/[?.]/g, '');
  const variations: string[] = [question];

  // Heuristic extraction of key terms
  const words = cleanQ.split(/\s+/);

  // Look for years (e.g. 2025, 2026)
  const currentYear = new Date().getFullYear();
  const yearPattern = /\b(20\d{2})\b/;
  const yearMatch = cleanQ.match(yearPattern);
  const year = yearMatch ? yearMatch[1] : currentYear.toString();

  // Remove common question prefixes
  const searchSubject = cleanQ
    .replace(/^(how many|how much|what is|what are|who is|which is|best|top|compare)\b/gi, '')
    .trim();

  if (searchSubject.length > 3) {
    variations.push(`${searchSubject} statistics ${year}`);
    variations.push(`${searchSubject} market share report`);
    variations.push(`${searchSubject} numbers revenue ${year}`);
  }

  // Deduplicate and limit to 4 variations
  return Array.from(new Set(variations)).slice(0, 4);
}
