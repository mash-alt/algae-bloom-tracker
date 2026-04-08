import type { AlgaeReport, ReportSeverity } from '@/services/reports';

export type ReportScopeKey = 'global' | 'north-bay' | 'central-bay' | 'south-bay' | 'coast' | 'other';

export interface ReportScopeOption {
  key: ReportScopeKey;
  label: string;
}

export interface LocationSummary {
  key: ReportScopeKey;
  label: string;
  reports: AlgaeReport[];
  count: number;
  latestDate: Date;
  severity: 'low' | 'medium' | 'high';
}

const severityRank: Record<ReportSeverity, number> = {
  None: 0,
  Mild: 1,
  Moderate: 2,
  Severe: 3,
};

export const REPORT_SCOPE_OPTIONS: ReportScopeOption[] = [
  { key: 'global', label: 'Global' },
  { key: 'north-bay', label: 'North Bay' },
  { key: 'central-bay', label: 'Central Bay' },
  { key: 'south-bay', label: 'South Bay' },
  { key: 'coast', label: 'Coast' },
  { key: 'other', label: 'Other' },
];

export function getReportDate(report: Pick<AlgaeReport, 'createdAt' | 'timestamp'>) {
  const raw = report.createdAt ?? report.timestamp;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function getReportScope(report: Pick<AlgaeReport, 'coordinates'>): ReportScopeKey {
  const { lat, lng } = report.coordinates;

  if (lat >= 37.92) return 'north-bay';
  if (lat >= 37.6) return 'central-bay';
  if (lat >= 37.2) return 'south-bay';
  if (lng <= -122.55) return 'coast';
  return 'other';
}

export function getReportScopeLabel(report: Pick<AlgaeReport, 'coordinates'>) {
  return REPORT_SCOPE_OPTIONS.find((option) => option.key === getReportScope(report))?.label ?? 'Other';
}

export function getReportLocationLabel(report: Pick<AlgaeReport, 'coordinates'> & { locationName?: string }) {
  return report.locationName?.trim() || getReportScopeLabel(report);
}

export function formatRelativeTime(date: Date, now = new Date()) {
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.max(1, Math.round(diffMs / 60000));

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function sortReportsNewestFirst(reports: AlgaeReport[]) {
  return [...reports].sort((left, right) => getReportDate(right).getTime() - getReportDate(left).getTime());
}

export function filterReportsByScope(reports: AlgaeReport[], scope: ReportScopeKey) {
  if (scope === 'global') {
    return reports;
  }

  return reports.filter((report) => getReportScope(report) === scope);
}

export function summarizeLocationReports(reports: AlgaeReport[]) {
  const groups = new Map<ReportScopeKey, AlgaeReport[]>();

  for (const report of reports) {
    const scope = getReportScope(report);
    const existing = groups.get(scope) ?? [];
    existing.push(report);
    groups.set(scope, existing);
  }

  const summaries = [...groups.entries()].map(([key, items]) => {
    const latest = sortReportsNewestFirst(items)[0];
    const highestSeverity = items.reduce<ReportSeverity>((current, report) => {
      return severityRank[report.severity] > severityRank[current] ? report.severity : current;
    }, 'None');

    const severity: 'low' | 'medium' | 'high' =
      highestSeverity === 'Severe'
        ? 'high'
        : highestSeverity === 'Moderate' || highestSeverity === 'Mild'
        ? 'medium'
        : 'low';

    return {
      key,
      label: latest.locationName?.trim() || REPORT_SCOPE_OPTIONS.find((option) => option.key === key)?.label ?? 'Other',
      reports: items,
      count: items.length,
      latestDate: getReportDate(latest),
      severity,
    } satisfies LocationSummary;
  });

  return summaries.sort((left, right) => {
    if (right.count !== left.count) return right.count - left.count;
    return right.latestDate.getTime() - left.latestDate.getTime();
  });
}