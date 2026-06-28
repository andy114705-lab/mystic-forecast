// Vercel Serverless Function — DeepSeek API 代理
// Key 只存服务端环境变量 DEEPSEEK_API_KEY，永不暴露前端

export default async function handler(req, res) {
  // 只允许 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 读取请求体
  const body = req.body;

  // 验证必要字段
  if (!body || !body.messages) {
    return res.status(400).json({ error: 'Missing messages' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  try {
    const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: body.messages,
        temperature: body.temperature ?? 0.6,
        max_tokens: body.max_tokens ?? 3000,
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return res.status(resp.status).json({ error: data.error?.message || 'API error' });
    }

    // 返回结果，附带用量
    return res.status(200).json({
      choices: data.choices,
      usage: data.usage,
    });
  } catch (err) {
    return res.status(502).json({ error: 'Upstream API unreachable' });
  }
}
