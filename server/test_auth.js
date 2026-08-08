async function testAuth() {
  console.log("Testing Registration...");
  try {
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test' + Date.now() + '@example.com',
        password: 'Password@123',
        name: 'Test Agent',
        phone: '5551234567'
      })
    });
    const regData = await regRes.json();
    console.log("Registration Response:", regRes.status, regData);

    console.log("\nTesting Login...");
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: regData.user ? regData.user.email : 'nonexistent@example.com',
        password: 'Password@123'
      })
    });
    const loginData = await loginRes.json();
    console.log("Login Response:", loginRes.status, loginData);
    
  } catch (err) {
    console.error("Test failed:", err);
  }
}

testAuth();
