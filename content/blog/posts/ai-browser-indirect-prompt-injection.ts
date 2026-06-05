import type { BlogPostDetail } from './types';

export const aiBrowserPromptInjectionDetail: BlogPostDetail = {
  slug: 'ai-browser-indirect-prompt-injection',
  deck:
    'Security researchers at Brave revealed a critical weakness in AI-powered browsers: attackers can hide instructions in web content (white-on-white text, HTML comments, spoilers, screenshots) that an assistant will obediently execute. When the assistant runs with your signed-in privileges, a single click can hand an attacker emails, one-time passwords, and full account access.',
  body: [
    {
      type: 'heading',
      level: 2,
      text: 'What’s Happening?',
    },
    {
      type: 'paragraph',
      text:
        "Attackers embed hidden prompts in page content — invisible text, comments, spoiler tags, or nearly-invisible overlays. AI assistants (like Comet in the Brave demo) can't reliably separate user intent from page content, so they execute both. The result: data exfiltration using the user's own authenticated sessions.",
    },

    {
      type: 'heading',
      level: 2,
      text: 'How the Exploit Worked (Demo)',
    },
    {
      type: 'list',
      style: 'bullet',
      items: [
        'Hidden payload in a Reddit spoiler — triggered by “Summarize this comment”.',
        'Assistant logged into Perplexity to record the user email.',
        'Assistant opened Gmail (user already authenticated) and grabbed an OTP.',
        'Assistant posted email + OTP back to the attacker’s comment — full account takeover with one click.',
      ],
    },
    {
      type: 'paragraph',
      text:
        'No phishing link. No classic malware. Just a trust boundary collapse between page content and assistant commands.',
    },

    {
      type: 'heading',
      level: 2,
      text: 'Why This Is Terrifying',
    },
    {
      type: 'paragraph',
      text:
        'AI browsers often act with the same session privileges as you. If you’re logged into email, bank, or work apps, the assistant’s actions inherit those privileges — meaning hidden instructions can access sensitive assets without human consent.',
    },
    {
      type: 'paragraph',
      text:
        'Some browsers auto-send page content to the AI engine (background summarization). That behavior removes even the “click” requirement — visiting a malicious page might be enough.',
    },

    {
      type: 'heading',
      level: 2,
      text: 'Attack Surface & Tech Notes',
    },
    {
      type: 'list',
      style: 'bullet',
      items: [
        'Hidden text layers and HTML comments are simple carriers for malicious prompts.',
        'Screenshots with near-invisible text (steganographic overlays) can embed instructions.',
        'Auto-ingestion (background fetch → model prompt) drastically widens the attack surface.',
        'Mitigations require both UI/UX isolation and server-side policy enforcement from browser vendors.',
      ],
    },

    {
      type: 'heading',
      level: 2,
      text: 'Immediate Mitigations (For Users & Admins)',
    },
    {
      type: 'list',
      style: 'bullet',
      items: [
        'Disable AI summarization or assistant features while logged into sensitive accounts.',
        'Use separate browser profiles for sensitive work (no third-party AI features in that profile).',
        'Turn off auto-send/background content processing for AI features.',
        'Enforce strict CSPs and sanitize third-party content in corporate web apps.',
        'Monitor for unusual token reuse, rapid OTP requests, and anomalous API calls.',
      ],
    },

    {
      type: 'callout',
      tone: 'red',
      title: 'Final Thoughts',
      text:
        'AI assistants are powerful — but they also blur the lines between what you asked and what the page told them to do. Until browsers implement strong isolation layers that separate user intent from page content, treat AI browser features like any other privileged tool: limit their reach, reduce automatic access, and assume attackers will try to weaponize convenience. Who’s thinking for your browser? Make sure it’s you.',
    },
  ],
  tags: [
    'AI Browser',
    'Prompt Injection',
    'Brave',
    'Comet',
    'Security',
    'Browser Threats',
  ],
};
