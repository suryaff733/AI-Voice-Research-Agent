export interface SourceCredibility {
  score: number; // 0 - 100
  trustLevel: 'High' | 'Medium' | 'Low';
  reasons: string[];
}

const TRUSTED_DOMAINS = [
  'wikipedia.org',
  'statista.com',
  'gartner.com',
  'idc.com',
  'canalys.com',
  'bloomberg.com',
  'reuters.com',
  'wsj.com',
  'nytimes.com',
  'ft.com',
  'techcrunch.com',
  'cnbc.com',
  'forbes.com',
  'marketwatch.com',
  'sec.gov',
  'census.gov',
  'bls.gov',
  'w3.org',
  'github.com',
  'arxiv.org',
];

export function scoreSource(url: string, title?: string, snippet?: string): SourceCredibility {
  let score = 70; // Base score
  const reasons: string[] = [];

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase().replace('www.', '');

    // 1. SSL/TLS check
    if (parsedUrl.protocol === 'https:') {
      score += 5;
      reasons.push('Uses secure HTTPS protocol');
    } else {
      score -= 15;
      reasons.push('Unsecure HTTP protocol');
    }

    // 2. Domain type checking
    if (hostname.endsWith('.gov')) {
      score += 20;
      reasons.push('Official government domain (.gov)');
    } else if (hostname.endsWith('.edu')) {
      score += 18;
      reasons.push('Academic institution domain (.edu)');
    } else if (hostname.endsWith('.org')) {
      score += 8;
      reasons.push('Organization domain (.org)');
    }

    // 3. Trusted domain check
    const isTrusted = TRUSTED_DOMAINS.some(domain => hostname === domain || hostname.endsWith('.' + domain));
    if (isTrusted) {
      score += 15;
      reasons.push('Recognized high-credibility research or news publication');
    }

    // 4. Content length/quality heuristical check (based on title/snippet)
    if (title && title.length > 20) {
      score += 2;
    }
    if (snippet && snippet.length > 100) {
      score += 3;
    }

    // Cap score at 100 and floor at 10
    score = Math.max(10, Math.min(100, score));

  } catch {
    score = 50;
    reasons.push('Malformed URL format');
  }

  let trustLevel: 'High' | 'Medium' | 'Low' = 'Medium';
  if (score >= 85) {
    trustLevel = 'High';
  } else if (score < 60) {
    trustLevel = 'Low';
  }

  return {
    score,
    trustLevel,
    reasons,
  };
}
