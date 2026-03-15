const fetch = require('node-fetch');

async function run() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@easyroom.test', password: 'Admin123!' }),
    });

    const loginData = await loginRes.json();
    if (!loginRes.ok) {
      throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    }

    const token = loginData.token;
    const userId = loginData.user._id;

    const aiRes = await fetch(`http://localhost:5000/api/matches/${userId}/ai`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const aiData = await aiRes.json();

    console.log('AI matches status:', aiRes.status);
    console.log('AI matches response:', JSON.stringify(aiData, null, 2));
  } catch (err) {
    console.error('Error running AI match test:', err);
  }
}

run();
