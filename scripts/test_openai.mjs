import OpenAI from "openai";

const key = process.env.OPENAI_API_KEY;
if (!key) {
  console.error('OPENAI_API_KEY not set');
  process.exit(2);
}

const client = new OpenAI({ apiKey: key });

(async () => {
  try {
    const prompt = `Generate a concise eco-friendly daily tip in JSON {"title":"...","description":"..."}`;
    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 150
    });
    console.log('OK', JSON.stringify(resp.choices?.[0]?.message?.content));
  } catch (e) {
    console.error('OPENAI ERROR', e);
    process.exit(1);
  }
})();
