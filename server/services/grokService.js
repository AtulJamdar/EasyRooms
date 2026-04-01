const fetch = require('node-fetch');

/**
 * Ranks matched room candidates using the GROQ AI Service.
 * Corrected for Groq's OpenAI-compatible API.
 */
async function rankMatchesWithAI(user, candidates) {
  const apiKey = process.env.GROK_API_KEY; // This is your Groq Key
  // Recommended Groq models: 'llama-3.3-70b-versatile' or 'mixtral-8x7b-32768'
  const model = process.env.GROK_MODEL || 'llama-3.3-70b-versatile';

  if (!apiKey) {
    console.log("⚠️ AI SKIPPED: No API Key found.");
    return candidates;
  }

  // We only send essential data to save tokens and improve speed
  const candidateData = candidates.map(c => ({
    id: c.user._id,
    name: c.user.name,
    budget: c.user.budget,
    college: c.user.college,
    course: c.user.course
  }));

  const prompt = `You are a roommate matching expert. 
Compare this User to the list of Candidates.
User: ${JSON.stringify({ name: user.name, budget: user.budget, college: user.college, course: user.course })}
Candidates: ${JSON.stringify(candidateData)}

Task: Re-order the candidate IDs from most compatible to least compatible based on budget and profile.
Constraint: Return ONLY a plain JSON array of strings (the IDs). No explanation, no markdown.
Example Output: ["id1", "id2", "id3"]`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "You only output valid JSON arrays." },
          { role: "user", content: prompt }
        ],
        temperature: 0.1, // Low temperature for consistent ranking
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Groq API Error:', errorText);
      return candidates;
    }

    const data = await response.json();
    
    // Groq follows the OpenAI response format: data.choices[0].message.content
    let content = data?.choices?.[0]?.message?.content || "";
    
    // Strip markdown backticks if the AI accidentally adds them
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const resultIds = JSON.parse(content);
      
      if (Array.isArray(resultIds)) {
        console.log("🎯 AI successfully re-ranked IDs:", resultIds);
        
        // Map the IDs back to the original full candidate objects
        const ordered = resultIds
          .map((id) => candidates.find((c) => c.user._id.toString() === id))
          .filter(Boolean);

        // If the AI only returned 3, but we sent 5, we append the rest or just return the 3
        return ordered.length ? ordered : candidates;
      }
    } catch (parseErr) {
      console.warn('⚠️ Failed to parse Groq JSON output. Raw text:', content);
    }
  } catch (err) {
    console.error('❌ Groq Request Failed:', err.message);
  }

  return candidates;
}

module.exports = { rankMatchesWithAI };