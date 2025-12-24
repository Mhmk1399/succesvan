const BASE_URL = 'http://localhost:3000/api';

let userId, categoryId, vehicleId, officeId, addonId;

async function testAPI(method, endpoint, body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`\n✓ ${method} ${endpoint}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.log(`\n✗ ${method} ${endpoint}`);
    console.log('Error:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');

  // 1. Get existing user from login
  const loginData = await testAPI('POST', '/auth/login', {
    emailAddress: 'john.doe@example.com',
    password: 'password123'
  });
  if (loginData?.data?.user?._id) userId = loginData.data.user._id;

  // 2. Get Users
  await testAPI('GET', '/users');

  // 3. Get Categories (use existing)
  const categoriesData = await testAPI('GET', '/categories');
  if (categoriesData?.data?.[0]?._id) categoryId = categoriesData.data[0]._id;

  // 4. Get Category by ID
  if (categoryId) await testAPI('GET', `/categories/${categoryId}`);

  // 5. Update Category
  if (categoryId) {
    await testAPI('PATCH', `/categories/${categoryId}`, {
      description: 'Updated: Compact vans for small loads'
    });
  }

  // 6. Create Vehicle
  if (categoryId) {
    const vehicleData = await testAPI('POST', '/vehicles', {
      title: 'Test Ford Transit Van',
      description: 'Large cargo van perfect for moving',
      images: ['https://example.com/van1.jpg'],
      category: categoryId,
      pricePerHour: 15,
      fuel: 'diesel',
      gear: 'manual',
      seats: 3,
      doors: 4,
      properties: [{ name: 'Cargo Space', value: '10m3' }]
    });
    if (vehicleData?.data?._id) vehicleId = vehicleData.data._id;
  }

  // 7. Get Vehicles
  await testAPI('GET', '/vehicles');

  // 8. Get Vehicle by ID
  if (vehicleId) await testAPI('GET', `/vehicles/${vehicleId}`);

  // 9. Update Vehicle
  if (vehicleId) {
    await testAPI('PATCH', `/vehicles/${vehicleId}`, {
      pricePerHour: 20,
      description: 'Updated: Premium cargo van'
    });
  }

  // 10. Get AddOns (use existing)
  const addonsData = await testAPI('GET', '/addons');
  if (addonsData?.data?.[0]?._id) addonId = addonsData.data[0]._id;

  // 11. Get AddOn by ID
  if (addonId) await testAPI('GET', `/addons/${addonId}`);

  // 12. Create Office (fix Car model issue by using empty cars array)
  const officeData = await testAPI('POST', '/offices', {
    name: 'Test London Office ' + Date.now(),
    location: { latitude: 51.5074, longitude: -0.1278 },
    address: '123 Test St, London',
    phone: '+442012345678',
    workingTime: [
      { day: 'monday', isOpen: true, startTime: '09:00', endTime: '18:00' },
      { day: 'tuesday', isOpen: true, startTime: '09:00', endTime: '18:00' },
      { day: 'wednesday', isOpen: true, startTime: '09:00', endTime: '18:00' },
      { day: 'thursday', isOpen: true, startTime: '09:00', endTime: '18:00' },
      { day: 'friday', isOpen: true, startTime: '09:00', endTime: '18:00' },
      { day: 'saturday', isOpen: false },
      { day: 'sunday', isOpen: false }
    ],
    specialDays: [],
    cars: []
  });
  if (officeData?.data?._id) officeId = officeData.data._id;

  // 13. Get Office by ID
  if (officeId) await testAPI('GET', `/offices/${officeId}`);

  // 14. Update Office
  if (officeId) {
    await testAPI('PATCH', `/offices/${officeId}`, {
      phone: '+442087654321',
      address: 'Updated: 456 New St, London'
    });
  }



  // 15. Create Reservation
  let reservationId;
  if (userId && officeId && addonId) {
    const reservationData = await testAPI('POST', '/reservations', {
      user: userId,
      office: officeId,
      startDate: '2025-12-20T09:00:00Z',
      endDate: '2025-12-25T18:00:00Z',
      totalPrice: 500,
      driverAge: 25,
      messege: 'Please have the van ready by 9am',
      addOns: [{ addOn: addonId, quantity: 2 }]
    });
    if (reservationData?.data?._id) reservationId = reservationData.data._id;
  }

  // 16. Get Reservations
  await testAPI('GET', '/reservations');

  // 17. Get Reservation by ID
  if (reservationId) await testAPI('GET', `/reservations/${reservationId}`);

  // 18. Update Reservation (PATCH)
  if (reservationId) {
    await testAPI('PATCH', `/reservations/${reservationId}`, {
      status: 'confirmed',
      totalPrice: 550,
      messege: 'Updated: Van ready at 9am sharp'
    });
  }

  // 19. Get Updated Reservation
  if (reservationId) await testAPI('GET', `/reservations/${reservationId}`);

  // 20. Get User by ID
  if (userId) await testAPI('GET', `/users/${userId}`);

  console.log('\n🗑️  Cleanup: Deleting test data...');

  // 21. Delete Reservation
  if (reservationId) await testAPI('DELETE', `/reservations/${reservationId}`);

  // 22. Delete Office
  if (officeId) await testAPI('DELETE', `/offices/${officeId}`);

  // 23. Delete Vehicle
  if (vehicleId) await testAPI('DELETE', `/vehicles/${vehicleId}`);

  console.log('\n✅ All tests completed!');
}

runTests();
