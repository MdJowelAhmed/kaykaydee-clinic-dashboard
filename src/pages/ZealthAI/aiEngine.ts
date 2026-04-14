import type { ZealthMessage } from './types'

function extractBullets(text: string): string[] {
  return text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^[-*]\s+/, ''))
}

function formatList(items: string[]): string {
  return items.map((x) => `- ${x}`).join('\n')
}

export function generateZealthResponse(userPrompt: string, history: ZealthMessage[]): string {
  const prompt = userPrompt.trim()
  if (!prompt) return 'Please type a message.'

  const lower = prompt.toLowerCase()

  if (lower.includes('summarize') || lower.includes('summary')) {
    const recentUserText = history
      .filter((m) => m.role === 'user')
      .slice(-5)
      .map((m) => m.content)
      .join('\n')
    const lines = extractBullets(recentUserText || prompt).slice(0, 5)
    return [
      'Here’s a short summary:',
      formatList(lines.length ? lines : [prompt.slice(0, 120) + (prompt.length > 120 ? '…' : '')]),
    ].join('\n')
  }

  if (lower.includes('plan') || lower.includes('roadmap') || lower.includes('steps')) {
    return [
      'Here’s a practical plan you can follow:',
      '- Clarify the goal and success criteria',
      '- List required data/inputs',
      '- Draft a simple first version',
      '- Test with a small sample',
      '- Iterate based on feedback',
      '',
      'If you share your exact goal, I can tailor this plan.',
    ].join('\n')
  }

  if (lower.includes('email') && lower.includes('template')) {
    return [
      'Here’s an email template you can use:',
      '',
      'Subject: [Your subject]',
      '',
      'Hi [Name],',
      '',
      'I hope you’re doing well. I’m reaching out about [topic].',
      'Could we [request] by [date/time]?',
      '',
      'Thanks,',
      '[Your Name]',
    ].join('\n')
  }

  if (lower.includes('meeting') || lower.includes('schedule')) {
    return [
      'To schedule this smoothly, please confirm:',
      '- Date range (e.g., next 7 days)',
      '- Preferred time window',
      '- Timezone',
      '- Meeting length',
      '',
      'Once you share these, I’ll propose a few slots.',
    ].join('\n')
  }

  // Default helpful assistant style response
  return [
    'Got it. Here’s a helpful response based on your prompt:',
    '',
    `“${prompt}”`,
    '',
    'Tell me what outcome you want (draft, checklist, explanation, or examples), and I’ll format it exactly that way.',
  ].join('\n')
}

