export type Tab = 'feed' | 'impact';
export type Priority = 'high' | 'medium' | 'low';
export type Level = 'high' | 'medium' | 'low';
export type IssueStatus = 'open' | 'applied';

export interface SampleSpan {
  id: string;
  userInput: string;
  agentOutput: string;
  evalLabel: 'pass' | 'fail';
  evalReason: string;
}

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
  suggestedPromptDiff: string;
  sampleSpans: SampleSpan[];
}

export interface ChartPoint {
  date: string;
  metric1: number;
  metric1Baseline: number | null;
  metric2: number;
  metric2Baseline: number | null;
}

export interface AppliedExperiment {
  id: string;
  issueTitle: string;
  category: string;
  appliedDate: string;
  change: string;
  metric1: { label: string; before: number; after: number; lift: number; ci: number };
  metric2: { label: string; before: number; after: number; lift: number; ci: number };
  conversations: number;
  fixAtIndex: number;
  chartData: ChartPoint[];
}

export interface AgentProfile {
  id: string;
  projectName: string;
  label: string;
  agentType: string;
  kpi1: string;
  kpi2: string;
  openIssues: number;
  highPriority: number;
  kpi1Lift: string;
  kpi2Lift: string;
  issues: Issue[];
  experiments: AppliedExperiment[];
}
