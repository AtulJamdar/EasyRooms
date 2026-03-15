const fetch = require('node-fetch');

/**
 * Ranks matched room candidates using an AI service (Grok API).
 *
 * The function currently accepts the base user plus a small set of candidate matches
 * and asks the AI to rank them. The result is expected to be an ordered list of
 * the best matches (2-3 items) based on compatibility, budget, habits, and preferences.
 *
 * Requires environment variable GROK_API_KEY.
 */
async function rankMatchesWithAI(user, candidates) {
  const apiKey = process.env.GROK_API_KEY;
  const model = process.env.GROK_MODEL || 'gpt-4o-mini';

  // Fallback: if no key is configured, return the original list.
  if (!apiKey) {
    return candidates;
  }

  const prompt = `You are an assistant that evaluates roommate compatibility.
User profile: ${JSON.stringify(user)}

Candidates:
${JSON.stringify(candidates, null, 2)}

Please return a JSON array of the top 3 candidates (by user._id) that are most compatible with the user, ordered best-to-worst.`;

  try {
    const response = await fetch(`https://api.grokapi.com/v1/outputs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: prompt,
        max_output_tokens: 500,
      }),
    });

    if (!response.ok) {
      console.warn('Grok API request failed', await response.text());
      return candidates;
    }

    const data = await response.json();
    const text = data?.output?.[0]?.content?.[0]?.text || data?.output?.[0]?.content?.[0]?.text?.[0] || '';

    try {
      const resultIds = JSON.parse(text);
      if (Array.isArray(resultIds)) {
        const ordered = resultIds
          .map((id) => candidates.find((c) => c.user._id.toString() === id))
          .filter(Boolean);
        return ordered.length ? ordered : candidates;
      }
    } catch (err) {
      console.warn('Failed to parse Grok response', err);
    }
  } catch (err) {
    console.warn('Grok API request failed', err);
  }

  return candidates;
}

module.exports = { rankMatchesWithAI };
