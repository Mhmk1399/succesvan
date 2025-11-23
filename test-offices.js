const BASE_URL = 'http://localhost:3000/api';

let officeId = '';

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
    console.error(`\n✗ ${method} ${endpoint}`);
    console.error('Error:', error.message);
    return null;
  }
}

async function runOfficeTests() {
  console.log('🏢 Testing Office CRUD...\n');

  // 1. Create Office
  console.log('\n--- TEST 1: Create Office (POST) ---');
  const createData = await testAPI('POST', '/offices', {
    name: `Test Office ${Date.now()}`,
    location: {
      latitude: 51.5074,
      longitude: -0.1278
    },
    address: '123 Test Street, London',
    phone: '+442012345678',
    workingTime: [
      { day: 'monday', isOpen: true, startTime: '09:00', endTime: '18:00' },
      { day: 'tuesday', isOpen: true, startTime: '09:00', endTime: '18:00' },
      { day: 'wednesday', isOpen: true, startTime: '09:00', endTime: '18:00' },
      { day: 'thursday', isOpen: true, startTime: '09:00', endTime: '18:00' },
      { day: 'friday', isOpen: true, startTime: '09:00', endTime: '17:00' },
      { day: 'saturday', isOpen: true, startTime: '10:00', endTime: '14:00' },
      { day: 'sunday', isOpen: false }
    ],
    specialDays: [
      {
        date: '2025-12-25',
        isOpen: false,
        reason: 'Christmas Day'
      },
      {
        date: '2025-12-31',
        isOpen: true,
        startTime: '09:00',
        endTime: '13:00',
        reason: 'New Year Eve - Half Day'
      }
    ],
    vehicles: []
  });
  
  if (createData?.data?._id) {
    officeId = createData.data._id;
    console.log('✅ Office created with ID:', officeId);
  }

  // 2. Get All Offices
  console.log('\n--- TEST 2: Get All Offices (GET) ---');
  await testAPI('GET', '/offices');

  // 3. Get Office by ID
  if (officeId) {
    console.log('\n--- TEST 3: Get Office by ID (GET) ---');
    await testAPI('GET', `/offices/${officeId}`);
  }

  // 4. Update Office - Change phone and address
  if (officeId) {
    console.log('\n--- TEST 4: Update Office (PATCH) - Phone & Address ---');
    await testAPI('PATCH', `/offices/${officeId}`, {
      phone: '+442087654321',
      address: 'Updated: 456 New Street, London'
    });
  }

  // 5. Update Office - Modify working hours
  if (officeId) {
    console.log('\n--- TEST 5: Update Office (PATCH) - Working Hours ---');
    await testAPI('PATCH', `/offices/${officeId}`, {
      workingTime: [
        { day: 'monday', isOpen: true, startTime: '08:00', endTime: '20:00' },
        { day: 'tuesday', isOpen: true, startTime: '08:00', endTime: '20:00' },
        { day: 'wednesday', isOpen: true, startTime: '08:00', endTime: '20:00' },
        { day: 'thursday', isOpen: true, startTime: '08:00', endTime: '20:00' },
        { day: 'friday', isOpen: true, startTime: '08:00', endTime: '20:00' },
        { day: 'saturday', isOpen: true, startTime: '09:00', endTime: '17:00' },
        { day: 'sunday', isOpen: true, startTime: '10:00', endTime: '16:00' }
      ]
    });
  }

  // 6. Update Office - Add special days
  if (officeId) {
    console.log('\n--- TEST 6: Update Office (PATCH) - Add Special Days ---');
    await testAPI('PATCH', `/offices/${officeId}`, {
      specialDays: [
        {
          date: '2025-12-25',
          isOpen: false,
          reason: 'Christmas Day'
        },
        {
          date: '2025-12-26',
          isOpen: false,
          reason: 'Boxing Day'
        },
        {
          date: '2025-01-01',
          isOpen: false,
          reason: 'New Year Day'
        }
      ]
    });
  }

  // 7. Get Updated Office
  if (officeId) {
    console.log('\n--- TEST 7: Get Updated Office ---');
    await testAPI('GET', `/offices/${officeId}`);
  }

  // 8. Update Office - Change location
  if (officeId) {
    console.log('\n--- TEST 8: Update Office (PATCH) - Location ---');
    await testAPI('PATCH', `/offices/${officeId}`, {
      location: {
        latitude: 51.5155,
        longitude: -0.1426
      }
    });
  }

  // 9. Get existing vehicle to add to office
  console.log('\n--- TEST 9: Get Vehicles ---');
  const vehiclesData = await testAPI('GET', '/vehicles');
  let vehicleId = vehiclesData?.data?.[0]?._id;

  // 10. Add vehicle to office
  if (officeId && vehicleId) {
    console.log('\n--- TEST 10: Add Vehicle to Office (PATCH) ---');
    await testAPI('PATCH', `/offices/${officeId}`, {
      vehicles: [
        { vehicle: vehicleId, inventory: 5 }
      ]
    });
  }

  // 11. Get office with vehicles
  if (officeId) {
    console.log('\n--- TEST 11: Get Office with Vehicles ---');
    await testAPI('GET', `/offices/${officeId}`);
  }

  // 12. Test invalid office ID
  console.log('\n--- TEST 12: Get Invalid Office ID (should fail) ---');
  await testAPI('GET', '/offices/000000000000000000000000');

  // 13. Delete Office
  if (officeId) {
    console.log('\n--- TEST 13: Delete Office (DELETE) ---');
    await testAPI('DELETE', `/offices/${officeId}`);
  }

  // 14. Verify deletion
  if (officeId) {
    console.log('\n--- TEST 14: Verify Deletion (should fail) ---');
    await testAPI('GET', `/offices/${officeId}`);
  }

  console.log('\n✅ Office tests completed!');
}

runOfficeTests();
