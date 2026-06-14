interface ScrapeResult {
  url: string;
  title: string;
  description: string;
  relevance: 'high' | 'medium' | 'low';
  markdown?: {
    markdown: string | null;
    code: string;
  };
}

interface SearchResponse {
  results: ScrapeResult[];
  query: string;
  key_metadata?: {
    credits_consumed: number;
    credits_remaining: number;
  };
}

export async function searchWeb(query: string, options?: {
  freshness?: 'last_24_hours' | 'last_week' | 'last_month' | 'last_year';
  scrape?: boolean;
}): Promise<SearchResponse> {
  const apiKey = process.env.CONTEXT_API_KEY;
  if (!apiKey) {
    throw new Error('CONTEXT_API_KEY is not defined in environment variables');
  }

  const response = await fetch('https://api.context.dev/v1/web/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query,
      freshness: options?.freshness,
      queryFanout: true,
      markdownOptions: {
        enabled: options?.scrape ?? true,
        useMainContentOnly: true,
        includeImages: true,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Context.dev API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}
