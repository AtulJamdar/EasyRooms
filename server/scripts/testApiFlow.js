const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api';

async function login() {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@easyroom.test', password: 'Admin123!' }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Login failed: ${JSON.stringify(data)}`);
  return data.token;
}

async function run() {
  try {
    const token = await login();

    console.log('✅ Logged in, token length', token.length);

    const createRoomRes = await fetch(`${API_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'Flow Test Room',
        description: 'Created during automated flow test',
        rent: 3200,
        location: 'Flow City',
        numberOfRoommatesNeeded: 1,
      }),
    });
    console.log('Create room status:', createRoomRes.status);
    console.log(await createRoomRes.json());

    const searchRes = await fetch(`${API_URL}/rooms/search?query=Flow`);
    console.log('Search status:', searchRes.status);
    console.log('Search results count:', (await searchRes.json()).length);

    const reqRes = await fetch(`${API_URL}/requirements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'Test requirement',
        description: 'Find a room near Flow City',
        preferredArea: 'Flow City',
        maxRent: 3500,
        genderPreference: 'any',
      }),
    });
    console.log('Create requirement status:', reqRes.status);
    console.log(await reqRes.json());

    const getReqRes = await fetch(`${API_URL}/requirements`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Get requirements status:', getReqRes.status);
    console.log('Requirements count:', (await getReqRes.json()).length);
  } catch (err) {
    console.error(err);
  }
}

run();
