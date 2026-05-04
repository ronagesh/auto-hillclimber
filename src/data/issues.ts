import type { Issue } from '../types';

export const ISSUES: Issue[] = [
  {
    id: 'issue-1',
    priority: 'high',
    category: 'Escalation Accuracy',
    evaluator: 'helios-escalation',
    title: 'Billing Dispute Escalations Missed',
    description:
      'Agent resolves billing disputes autonomously in 34% of cases that require human review. Customers who needed refund approval received incorrect self-service instructions, correlating strongly with churn and chargebacks.',
    frequency: 'high',
    kpiRisk: 'high',
    escalationVolume: 'high',
    affectedSpans: 412,
    status: 'open',
    suggestedFix:
      'Add explicit escalation triggers to system prompt for tickets containing "refund" + "dispute" or "bank".',
  },
  {
    id: 'issue-2',
    priority: 'high',
    category: 'Hallucination',
    evaluator: 'helios-hallucination',
    title: 'Pro Plan Pricing Hallucination',
    description:
      'Agent fabricates Pro plan pricing ($39/mo, $59/mo) in 28% of billing-related responses. Actual price is $49/month. Inconsistent answers correlate with escalation volume and poor satisfaction ratings.',
    frequency: 'high',
    kpiRisk: 'high',
    escalationVolume: 'medium',
    affectedSpans: 287,
    status: 'open',
    suggestedFix:
      'Expand KB pricing section and add a retrieval guardrail requiring KB citation for any pricing claim.',
  },
  {
    id: 'issue-3',
    priority: 'medium',
    category: 'Correctness',
    evaluator: 'helios-correctness',
    title: 'Force Flush Setup Step Omitted',
    description:
      'Agent omits the force_flush() + shutdown() step in 41% of tracing setup responses. Developers following these instructions see no traces appear, creating a broken onboarding experience.',
    frequency: 'medium',
    kpiRisk: 'medium',
    escalationVolume: 'low',
    affectedSpans: 198,
    status: 'open',
    suggestedFix:
      'Update the tracing KB article to emphasize force_flush() as a required final step for script-based workflows.',
  },
  {
    id: 'issue-4',
    priority: 'medium',
    category: 'Escalation Accuracy',
    evaluator: 'helios-escalation',
    title: 'Security Incident Under-escalation',
    description:
      'Agent defaults to standard API key rotation advice for potential account compromise reports 22% of the time. These require immediate security team involvement, not self-service resolution.',
    frequency: 'low',
    kpiRisk: 'high',
    escalationVolume: 'high',
    affectedSpans: 41,
    status: 'open',
    suggestedFix:
      'Add "unauthorized access" and "compromised" as hard-coded escalation triggers, bypassing normal resolution flow.',
  },
  {
    id: 'issue-5',
    priority: 'low',
    category: 'Correctness',
    evaluator: 'helios-correctness',
    title: 'LangGraph vs LangChain Setup Conflated',
    description:
      'Agent provides LangChain instrumentation steps for LangGraph questions in 19% of framework-specific queries. The two have different setup paths and the conflation leads to broken instrumentation.',
    frequency: 'medium',
    kpiRisk: 'low',
    escalationVolume: 'low',
    affectedSpans: 93,
    status: 'open',
    suggestedFix:
      'Add a LangGraph-specific KB article and update search keywords to distinguish it from LangChain queries.',
  },
];
