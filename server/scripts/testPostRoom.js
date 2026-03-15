const fetch = require('node-fetch');

async function main() {
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

    const postRes = await fetch('http://localhost:5000/api/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'Test Room',
        description: 'Test description',
        rent: 2500,
        location: 'Testville',
        numberOfRoommatesNeeded: 1,
      }),
    });

    const postData = await postRes.json();
    console.log('status', postRes.status);
    console.log(postData);
  } catch (err) {
    console.error(err);
  }
}

main();
