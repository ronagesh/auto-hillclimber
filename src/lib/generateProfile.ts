import Anthropic from '@anthropic-ai/sdk';
import type { AgentProfile, Issue, AppliedExperiment, ChartPoint } from '../types';

const DATES = ['Feb 28', 'Mar 7', 'Mar 14', 'Mar 21', 'Mar 28', 'Apr 4', 'Apr 11', 'Apr 18', 'Apr 25', 'May 2'];

function generateChartData(
  m1Before: number, m1After: number,
  m2Before: number, m2After: number,
  fixAt: number,
): ChartPoint[] {
  return DATES.map((date, i) => {
    const post = i >= fixAt;
    const progress = post ? Math.min(1, (i - fixAt + 1) / 3) : 0;
    const jitter = () => Math.round((Math.random() - 0.5) * 3);
    return {
      date,
      metric1: Math.round(m1Before + (m1After - m1Before) * progress) + jitter(),
      metric1Baseline: post ? m1Before + jitter() : null,
      metric2: Math.round(m2Before + (m2After - m2Before) * progress) + jitter(),
      metric2Baseline: post ? m2Before + jitter() : null,
    };
  });
}

function assembleProfile(raw: Record<string, unknown>): AgentProfile {
  const issues: Issue[] = ((raw.issues as unknown[]) ?? []).map((iss: unknown, i: number) => {
    const issue = iss as Record<string, unknown>;
    return {
      id: `gen-${i}`,
      priority: (issue.priority as Issue['priority']) ?? 'medium',
      category: (issue.category as string) ?? 'Correctness',
      evaluator: (issue.evaluator as string) ?? 'quality-judge',
      title: (issue.title as string) ?? 'Unknown Issue',
      description: (issue.description as string) ?? '',
      frequency: (issue.frequency as Issue['frequency']) ?? 'medium',
      kpiRisk: (issue.kpiRisk as Issue['kpiRisk']) ?? 'medium',
      escalationVolume: (issue.escalationVolume as Issue['escalationVolume']) ?? 'medium',
      affectedSpans: (issue.affectedSpans as number) ?? 100,
      status: 'open',
      suggestedFix: (issue.suggestedFix as string) ?? '',
      suggestedPromptDiff: (issue.suggestedPromptDiff as string) ?? '',
      sampleSpans: ((issue.sampleSpans as unknown[]) ?? []).map((s: unknown, j: number) => {
        const span = s as Record<string, unknown>;
        return {
          id: `gen-${i}-s${j}`,
          userInput: (span.userInput as string) ?? '',
          agentOutput: (span.agentOutput as string) ?? '',
          evalLabel: (span.evalLabel as 'pass' | 'fail') ?? 'fail',
          evalReason: (span.evalReason as string) ?? '',
        };
      }),
    };
  });

  const experiments: AppliedExperiment[] = ((raw.experiments as unknown[]) ?? []).map((exp: unknown, i: number) => {
    const e = exp as Record<string, unknown>;
    const m1b = (e.metric1Before as number) ?? 65;
    const m1a = (e.metric1After as number) ?? 78;
    const m2b = (e.metric2Before as number) ?? 70;
    const m2a = (e.metric2After as number) ?? 82;
    const fixAt = 6;
    return {
      id: `gen-exp-${i}`,
      issueTitle: (e.issueTitle as string) ?? '',
      category: (e.category as string) ?? '',
      appliedDate: (e.appliedDate as string) ?? 'Apr 14, 2026',
      change: (e.change as string) ?? '',
      metric1: {
        label: (raw.kpi1 as string) ?? 'KPI 1',
        before: m1b,
        after: m1a,
        lift: m1a - m1b,
        ci: (e.ci1 as number) ?? 2,
      },
      metric2: {
        label: (raw.kpi2 as string) ?? 'KPI 2',
        before: m2b,
        after: m2a,
        lift: m2a - m2b,
        ci: (e.ci2 as number) ?? 3,
      },
      conversations: (e.conversations as number) ?? 1500,
      fixAtIndex: fixAt,
      chartData: generateChartData(m1b, m1a, m2b, m2a, fixAt),
    };
  });

  const highPriority = issues.filter(i => i.priority === 'high').length;

  return {
    id: 'generated',
    projectName: 'my-agent',
    label: 'Generated',
    agentType: 'AI Agent',
    kpi1: (raw.kpi1 as string) ?? 'Quality Score',
    kpi2: (raw.kpi2 as string) ?? 'Resolution Rate',
    kpi1Lift: (raw.kpi1Lift as string) ?? '+8 pts',
    kpi2Lift: (raw.kpi2Lift as string) ?? '+10 pts',
    openIssues: issues.length,
    highPriority,
    issues,
    experiments,
  };
}

export async function generateProfile(description: string, kpis: string): Promise<AgentProfile> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY not set');

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const prompt = `You are the Arize Autopilot intelligence engine. Given an AI agent description and its KPIs, generate a realistic set of production failure clusters that this agent is experiencing, along with sample traces and suggested fixes.

Agent description: ${description}
KPIs that matter: ${kpis}

Return ONLY valid JSON with this exact structure (no markdown, no explanation):

{
  "kpi1": "Primary KPI name using the user's exact terminology, 2-4 words",
  "kpi2": "Secondary KPI name using the user's exact terminology, 2-4 words",
  "kpi1Lift": "+X pts",
  "kpi2Lift": "+X pts",
  "issues": [
    {
      "title": "Concise issue title describing the failure mode",
      "category": "One of: Hallucination, Correctness, Tone, Completeness, Policy Violation, Escalation Accuracy",
      "evaluator": "short-slug-evaluator-name",
      "priority": "high",
      "description": "2-3 sentences describing exactly what is failing, with a specific failure rate percentage and business impact.",
      "frequency": "high",
      "kpiRisk": "high",
      "escalationVolume": "high",
      "affectedSpans": 350,
      "suggestedFix": "One actionable sentence describing the fix.",
      "suggestedPromptDiff": "The exact 2-5 sentence instruction to add to the system prompt to address this issue. Should be specific and directly actionable.",
      "sampleSpans": [
        {
          "userInput": "A realistic user message that triggers this failure",
          "agentOutput": "The agent's failing response (1-3 sentences, realistic)",
          "evalLabel": "fail",
          "evalReason": "Specific reason this response failed the evaluator"
        },
        {
          "userInput": "A similar user message where the agent handled it correctly",
          "agentOutput": "The agent's correct response",
          "evalLabel": "pass",
          "evalReason": "Why this response passed"
        },
        {
          "userInput": "Another user message showing the failure mode",
          "agentOutput": "Another failing response",
          "evalLabel": "fail",
          "evalReason": "Why this one failed"
        }
      ]
    }
  ],
  "experiments": [
    {
      "issueTitle": "Title of an issue that was already fixed (can be a past issue not in the open list)",
      "category": "Category of that issue",
      "appliedDate": "Apr 14, 2026",
      "change": "Description of exactly what was changed to fix it",
      "metric1Before": 65,
      "metric1After": 78,
      "metric2Before": 70,
      "metric2After": 83,
      "ci1": 2,
      "ci2": 3,
      "conversations": 1847
    }
  ]
}

Rules:
- Generate exactly 4-5 issues ordered by priority (high priority first)
- Generate exactly 1-2 experiments showing past fixes that moved the KPIs
- Every issue, span, and fix MUST be specific to the described agent type — no generic content
- Use the user's exact KPI terminology in kpi1 and kpi2
- Failure rates in descriptions should be between 15% and 45%
- affectedSpans should be realistic (50-600 range)
- suggestedPromptDiff should read as actual system prompt instructions, not meta-commentary`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in response');

  const raw = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
  return assembleProfile(raw);
}
