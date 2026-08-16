import fetch from 'node-fetch'; // wait, node 24 has global fetch

async function test() {
  try {
    const response = await fetch('http://localhost:5001/api/maintenances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        asset_id: 1,
        description: 'The furniture has completely damaged',
        priority: 'High'
      })
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}
test();
