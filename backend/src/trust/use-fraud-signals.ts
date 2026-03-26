import { FraudSignal } from "@/trust/types";

export function deriveFraudSignals(input: {
  duplicateCount: number;
  priceOutlierRatio?: number;
  reportCount: number;
  unverifiedPublisher: boolean;
}): FraudSignal[] {
  const signals: FraudSignal[] = [];

  if (input.duplicateCount > 0) {
    signals.push({
      id: "duplicate",
      severity: input.duplicateCount > 2 ? "high" : "medium",
      label: "Potential duplicate listing",
      details: `${input.duplicateCount} similar listing(s) detected`,
    });
  }

  if ((input.priceOutlierRatio ?? 1) < 0.45 || (input.priceOutlierRatio ?? 1) > 2.2) {
    signals.push({
      id: "price_outlier",
      severity: "medium",
      label: "Price anomaly",
      details: "Price significantly deviates from area median",
    });
  }

  if (input.reportCount >= 3) {
    signals.push({
      id: "report_spike",
      severity: input.reportCount >= 8 ? "high" : "medium",
      label: "Report spike",
      details: `${input.reportCount} abuse report(s) filed`,
    });
  }

  if (input.unverifiedPublisher) {
    signals.push({
      id: "publisher_unverified",
      severity: "low",
      label: "Unverified publisher",
      details: "Publisher has not completed verification",
    });
  }

  return signals;
}
