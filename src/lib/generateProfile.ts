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

function extractStructuredContent(html: string): string {
  const get = (pattern: RegExp) => (html.match(pattern) ?? [])[1]?.trim() ?? '';
  const getAll = (pattern: RegExp) => [...html.matchAll(pattern)].map(m => m[1]?.trim()).filter(Boolean);

  const title = get(/<title[^>]*>([^<]+)<\/title>/i);
  const description = get(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
    || get(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  const ogTitle = get(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  const ogDesc = get(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
  const h1s = getAll(/<h1[^>]*>([^<]+)<\/h1>/gi);
  const h2s = getAll(/<h2[^>]*>([^<]+)<\/h2>/gi).slice(0, 6);

  // Also grab a snippet of body text as fallback
  const bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1500);

  return [
    title && `Title: ${title}`,
    ogTitle && ogTitle !== title && `OG Title: ${ogTitle}`,
    description && `Meta description: ${description}`,
    ogDesc && ogDesc !== description && `OG description: ${ogDesc}`,
    h1s.length && `H1: ${h1s.join(' | ')}`,
    h2s.length && `Headings: ${h2s.join(' | ')}`,
    bodyText && `Body excerpt: ${bodyText}`,
  ].filter(Boolean).join('\n');
}

async function fetchWebsiteText(url: string): Promise<string> {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
    const data = await res.json() as { contents?: string };
    const html = data.contents ?? '';
    return extractStructuredContent(html);
  } catch {
    return '';
  }
}

const GENERATION_PROMPT = `You are the Arize Autopilot intelligence engine. Given context about a company, you must:
1. Accurately identify what this specific company's core product is and what AI agent they operate
2. Generate realistic production failure clusters for THAT specific agent

Be precise about the company. If you recognize the company from your training data, use that knowledge. Do not confuse companies with similar names or guess based on the domain alone.

Return ONLY valid JSON with this exact structure (no markdown, no explanation):

{
  "companyType": "One sentence: what does this company do and what AI agent are they operating?",
  "kpi1": "Primary KPI name, 2-4 words, using terminology natural to this company's domain",
  "kpi2": "Secondary KPI name, 2-4 words",
  "kpi1Lift": "+X pts",
  "kpi2Lift": "+X pts",
  "issues": [
    {
      "title": "Concise issue title",
      "category": "One of: Hallucination, Correctness, Tone, Completeness, Policy Violation, Escalation Accuracy",
      "evaluator": "short-slug-evaluator-name",
      "priority": "high|medium|low",
      "description": "2-3 sentences describing exactly what is failing, with a specific failure rate percentage and business impact.",
      "frequency": "high|medium|low",
      "kpiRisk": "high|medium|low",
      "escalationVolume": "high|medium|low",
      "affectedSpans": 350,
      "suggestedFix": "One actionable sentence.",
      "suggestedPromptDiff": "The exact 2-5 sentence instruction to add to the system prompt. Specific and directly actionable.",
      "sampleSpans": [
        {
          "userInput": "Realistic user message that triggers this failure",
          "agentOutput": "Agent's failing response (1-3 sentences)",
          "evalLabel": "fail",
          "evalReason": "Specific reason this response failed"
        },
        {
          "userInput": "Similar message where agent handled it correctly",
          "agentOutput": "Correct agent response",
          "evalLabel": "pass",
          "evalReason": "Why this passed"
        },
        {
          "userInput": "Another message showing the failure mode",
          "agentOutput": "Another failing response",
          "evalLabel": "fail",
          "evalReason": "Why this failed"
        }
      ]
    }
  ],
  "experiments": [
    {
      "issueTitle": "Title of a past issue that was already fixed",
      "category": "Category of that issue",
      "appliedDate": "Apr 14, 2026",
      "change": "Description of what was changed",
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
- Generate exactly 4-5 issues ordered by priority (high first)
- Generate exactly 1-2 experiments showing past fixes that moved the KPIs
- Every issue, span, and fix MUST be specific to this company's actual product and domain
- Use KPI terminology natural to this company's industry
- Failure rates in descriptions: 15-45%
- affectedSpans: 50-600
- suggestedPromptDiff should read as actual system prompt instructions`;

export async function generateProfile(input: string): Promise<AgentProfile> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY not set');

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  let contextBlock: string;

  if (input.startsWith('manual:')) {
    const rest = input.slice('manual:'.length);
    const [description, kpis] = rest.split('|||');
    contextBlock = `Agent description: ${description}\nKPIs that matter: ${kpis}`;
  } else {
    let domain = input;
    try { domain = new URL(input).hostname.replace('www.', ''); } catch { /* noop */ }

    const websiteText = await fetchWebsiteText(input);
    if (websiteText.length > 100) {
      contextBlock = `Company: ${domain}\nURL: ${input}\n\nWebsite metadata and content:\n${websiteText}\n\nIMPORTANT: Use the above content plus your own training knowledge about ${domain} to accurately identify what this company does before generating issues.`;
    } else {
      contextBlock = `Company: ${domain}\nURL: ${input}\n\nNo website content could be fetched. Use your training knowledge about ${domain} to identify exactly what this company does and what AI agent they operate. Be specific and accurate — do not guess based on the domain name alone.`;
    }
  }

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4000,
    system: GENERATION_PROMPT,
    messages: [{ role: 'user', content: contextBlock }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in response');

  const raw = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
  return assembleProfile(raw);
}
