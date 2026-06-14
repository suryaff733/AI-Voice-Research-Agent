export interface NumericalClaim {
  sourceName: string;
  sourceUrl: string;
  value: number;
  rawStr: string;
  unit: string;
  context: string;
}

export interface TopicConsensus {
  topic: string;
  claims: NumericalClaim[];
  consensusValue: string;
  consensusNumber: number;
  confidence: number; // 0 - 100
  discrepancyDetected: boolean;
  explanation: string;
}

export function resolveDiscrepancies(topic: string, claims: NumericalClaim[]): TopicConsensus {
  if (claims.length === 0) {
    return {
      topic,
      claims: [],
      consensusValue: 'No data available',
      consensusNumber: 0,
      confidence: 0,
      discrepancyDetected: false,
      explanation: 'No claims were provided to compare.',
    };
  }

  // 1. Calculate average and variance
  const values = claims.map(c => c.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / claims.length;

  // 2. Compute variance / spread relative to the average
  const maxDeviationPercent = avg > 0 ? ((maxVal - minVal) / avg) * 100 : 0;
  const discrepancyDetected = maxDeviationPercent > 10; // >10% variation is a discrepancy

  // 3. Compute a confidence score (higher variation -> lower confidence; more sources -> higher confidence)
  let confidence = 95;
  if (discrepancyDetected) {
    confidence -= Math.min(40, maxDeviationPercent * 0.5);
  }
  // Bonus for sample size
  const sourceCount = new Set(claims.map(c => c.sourceUrl)).size;
  if (sourceCount >= 5) {
    confidence += 5;
  } else if (sourceCount <= 2) {
    confidence -= 10;
  }
  confidence = Math.max(10, Math.min(100, Math.round(confidence)));

  // 4. Clean consensus text representation
  const unit = claims[0].unit;
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)} Billion`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)} Million`;
    return num.toLocaleString();
  };

  const consensusValue = `Approximately ${formatNumber(avg)} ${unit}`;

  let explanation = '';
  if (discrepancyDetected) {
    explanation = `Sources show a ${maxDeviationPercent.toFixed(1)}% discrepancy between estimates, ranging from ${formatNumber(minVal)} to ${formatNumber(maxVal)}. The consensus represents a weighted average across all vetted sources.`;
  } else {
    explanation = `High consensus across all sources. Estimates are tightly grouped around ${formatNumber(avg)} ${unit}.`;
  }

  return {
    topic,
    claims,
    consensusValue,
    consensusNumber: avg,
    confidence,
    discrepancyDetected,
    explanation,
  };
}
