const BASE_URL = 'http://localhost:3000/api';

let token = '';

async function testAPI(method, endpoint, body = null, useToken = false) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (useToken && token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (body) options.body = JSON.stringify(body);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`\n✓ ${method} ${endpoint}${useToken ? ' (with token)' : ''}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.log(`\n✗ ${method} ${endpoint}`);
    console.log('Error:', error.message);
    return null;
  }
}

async function runAuthTests() {
  console.log('🔐 Testing Auth System...\n');

  // 1. Register new user (should return token)
  console.log('\n--- TEST 1: Register ---');
  const registerData = await testAPI('POST', '/auth/register', {
    name: 'Test',
    lastName: 'User',
    emaildata: { emailAddress: `test${Date.now()}@example.com` },
    phoneData: { phoneNumber: `+4477${Date.now().toString().slice(-8)}` },
    password: 'password123',
    role: 'user'
  });
  
  if (registerData?.data?.token) {
    token = registerData.data.token;
    console.log('✅ Token received from register:', token.substring(0, 20) + '...');
  }

  // 2. Get current user with token (GET /auth/me)
  console.log('\n--- TEST 2: Get Current User (GET /auth/me) ---');
  await testAPI('GET', '/auth/me', null, true);

  // 3. Login with token (auto-login)
  console.log('\n--- TEST 3: Login with Token (auto-login) ---');
  const tokenLoginData = await testAPI('POST', '/auth/login', {}, true);
  if (tokenLoginData?.data?.token) {
    console.log('✅ New token received from token login');
  }

  // 4. Login with password
  console.log('\n--- TEST 4: Login with Password ---');
  const passwordLoginData = await testAPI('POST', '/auth/login', {
    emailAddress: registerData?.data?.user?.emaildata?.emailAddress,
    password: 'password123'
  });
  
  if (passwordLoginData?.data?.token) {
    token = passwordLoginData.data.token;
    console.log('✅ Token received from password login');
  }

  // 5. Get current user again with new token
  console.log('\n--- TEST 5: Get Current User Again ---');
  await testAPI('GET', '/auth/me', null, true);

  // 6. Test invalid token
  console.log('\n--- TEST 6: Invalid Token ---');
  const oldToken = token;
  token = 'invalid_token_12345';
  await testAPI('GET', '/auth/me', null, true);
  token = oldToken;

  // 7. Test no token
  console.log('\n--- TEST 7: No Token ---');
  await testAPI('GET', '/auth/me', null, false);

  // 8. Get user by ID
  const userId = registerData?.data?.user?._id;
  if (userId) {
    console.log('\n--- TEST 8: Get User by ID ---');
    await testAPI('GET', `/users/${userId}`);
  }

  // 9. Update user (PATCH) - requires token
  if (userId) {
    console.log('\n--- TEST 9: Update User (PATCH) ---');
    await testAPI('PATCH', `/users/${userId}`, {
      name: 'Updated',
      lastName: 'Name'
    }, true);
  }

  // 10. Get updated user
  if (userId) {
    console.log('\n--- TEST 10: Get Updated User ---');
    await testAPI('GET', `/users/${userId}`);
  }

  // 11. Try to update without token (should fail)
  if (userId) {
    console.log('\n--- TEST 11: Update Without Token (should fail) ---');
    await testAPI('PATCH', `/users/${userId}`, {
      name: 'Hacker'
    }, false);
  }

  // 12. Delete user - requires token
  if (userId) {
    console.log('\n--- TEST 12: Delete User ---');
    await testAPI('DELETE', `/users/${userId}`, null, true);
  }

  console.log('\n✅ Auth tests completed!');
}

runAuthTests();
