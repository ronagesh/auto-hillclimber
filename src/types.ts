export type Tab = 'feed' | 'impact';
export type Priority = 'high' | 'medium' | 'low';
export type Level = 'high' | 'medium' | 'low';
export type IssueStatus = 'open' | 'applied';

export interface Issue {
  id: string;
  priority: Priority;
  category: string;
  evaluator: string;
  title: string;
  description: string;
  frequency: Level;
  kpiRisk: Level;
  escalationVolume: Level;
  affectedSpans: number;
  status: IssueStatus;
  suggestedFix: string;
}

export interface ChartPoint {
  date: string;
  correctness: number;
  correctnessBaseline: number | null;
  escalation: number;
  escalationBaseline: number | null;
}

export interface AppliedExperiment {
  id: string;
  issueTitle: string;
  category: string;
  appliedDate: string;
  change: string;
  correctness: { before: number; after: number; lift: number; ci: number };
  escalation: { before: number; after: number; lift: number; ci: number };
  conversations: number;
  fixAtIndex: number;
  chartData: ChartPoint[];
}
