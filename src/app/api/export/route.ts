import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { report, format } = await req.json();

    if (!report || !format) {
      return NextResponse.json({ error: 'Missing report or format' }, { status: 400 });
    }

    const filename = `research_universe_${format}_${Date.now()}`;

    if (format === 'markdown') {
      const content = `# Research Universe Report\n\n**Question:** ${report.question}\n\n**Answer:** ${report.answer}\n\n## Summary\n${report.summary}\n\n## Sources\n${report.sources.map((s: any) => `- [${s.title}](${s.url}) (Credibility: ${s.credibility.score}/100)`).join('\n')}\n`;
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': `attachment; filename="${filename}.md"`,
        },
      });
    }

    if (format === 'json') {
      return new NextResponse(JSON.stringify(report, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}.json"`,
        },
      });
    }

    if (format === 'csv') {
      const rows = [
        ['Source Title', 'Source URL', 'Credibility Score', 'Trust Level'],
        ...report.sources.map((s: any) => [s.title, s.url, s.credibility.score, s.credibility.trustLevel])
      ];
      const csvContent = rows.map(r => r.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}.csv"`,
        },
      });
    }

    // Default mock response for PDF, PPT, Word
    const textContent = `Research Universe document compiled in ${format.toUpperCase()} format.\nReport Topic: ${report.question}\nConfidence: ${report.confidence}%\n`;
    return new NextResponse(textContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${filename}.${format === 'presentation' ? 'pptx' : format === 'pdf' ? 'pdf' : 'docx'}"`,
      },
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Export failed' }, { status: 500 });
  }
}
