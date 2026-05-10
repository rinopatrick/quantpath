'use client';

export type AIProvider = 'deepseek' | 'openrouter' | 'mimo';

interface AIConfig {
  name: string;
  baseUrl: string;
  model: string;
  apiKeyEnv: string;
}

export const AI_CONFIGS: Record<AIProvider, AIConfig> = {
  deepseek: {
    name: 'Deepseek',
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
  },
  openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'anthropic/claude-3.5-sonnet',
    apiKeyEnv: 'OPENROUTER_API_KEY',
  },
  mimo: {
    name: 'MiMo',
    baseUrl: 'https://api.mimo.com/v1',
    model: 'mimo-7b',
    apiKeyEnv: 'MIMO_API_KEY',
  },
};

export async function callAI(
  provider: AIProvider,
  prompt: string,
  context?: string
): Promise<string> {
  const config = AI_CONFIGS[provider];
  const apiKey = process.env[config.apiKeyEnv];

  if (!apiKey) {
    throw new Error(`API key not found for ${provider}`);
  }

  const systemPrompt = `You are QuantPath AI, a personal quant career advisor helping someone transition from Nuclear Engineering to Quantitative Finance.

Context: ${context || 'General quant learning advice'}

Provide specific, actionable advice. Be concise and practical.`;

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://quantpath.app',
        'X-Title': 'QuantPath',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error(`Error calling ${provider}:`, error);
    throw error;
  }
}

export async function explainResource(resourceTitle: string, resourceDescription: string): Promise<string> {
  const prompt = `Explain this learning resource and what I should do with it:

Resource: ${resourceTitle}
Description: ${resourceDescription}

Please provide:
1. What this resource teaches
2. Why it's important for quantitative finance
3. Specific steps to complete it
4. How it connects to nuclear engineering (if applicable)
5. Tips for getting the most out of it`;

  return callAI('deepseek', prompt, 'Resource explanation for quant learning');
}

export async function assessSkill(skillName: string, currentLevel: number): Promise<string> {
  const prompt = `Assess my skill level in ${skillName}. Current self-assessment: ${currentLevel}/100.

Please provide:
1. What skills are needed at different levels (beginner, intermediate, advanced)
2. What I should know at my current level
3. What to learn next to improve
4. Recommended resources for my level
5. Practice exercises to strengthen this skill`;

  return callAI('mimo', prompt, 'Skill assessment for quant learning');
}

export async function generateProjectIdea(
  skills: string[],
  difficulty: string,
  nuclearNiche: boolean
): Promise<string> {
  const prompt = `Generate a quantitative finance project idea with these requirements:

Skills: ${skills.join(', ')}
Difficulty: ${difficulty}
Nuclear Niche: ${nuclearNiche ? 'Yes - leverage nuclear engineering background' : 'No'}

Please provide:
1. Project title and description
2. Learning objectives
3. Technical implementation steps
4. Expected deliverables
5. CV impact and talking points
6. Resources needed`;

  return callAI('deepseek', prompt, 'Project idea generation for quant portfolio');
}
