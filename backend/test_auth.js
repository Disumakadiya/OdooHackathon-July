const testAuth = async () => {
  console.log('Testing Registration...');
  
  const uniqueEmail = `test${Date.now()}@example.com`;
  
  try {
    const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'securepassword123',
        name: 'Test Hackathon User'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Register Response Status:', registerResponse.status);
    console.log('Register Data:', registerData);
    
    if (registerResponse.ok) {
      console.log('\nRegistration Success! Now testing login...');
      
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: uniqueEmail,
          password: 'securepassword123'
        })
      });
      
      const loginData = await loginResponse.json();
      console.log('Login Response Status:', loginResponse.status);
      console.log('Login Data:', loginData);
      
      if (loginResponse.ok) {
        console.log('\n✅ ALL TESTS PASSED: User successfully created in DB and logged in.');
      } else {
        console.log('\n❌ LOGIN FAILED');
      }
    } else {
      console.log('\n❌ REGISTRATION FAILED');
    }
    
  } catch (err) {
    console.error('\n❌ ERROR:', err.message);
  }
};

testAuth();
