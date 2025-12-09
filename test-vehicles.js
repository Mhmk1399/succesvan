const BASE_URL = 'http://localhost:3000/api';

let categoryId = '';
let vehicleId = '';

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

async function runVehicleTests() {
  console.log('🚗 Testing Vehicle CRUD...\n');

  // 1. Get existing category (or create one)
  console.log('\n--- TEST 1: Get Categories ---');
  const categoriesData = await testAPI('GET', '/categories');
  if (categoriesData?.data?.[0]?._id) {
    categoryId = categoriesData.data[0]._id;
    console.log('✅ Using category ID:', categoryId);
  }

  // 2. Create Vehicle
  if (categoryId) {
    console.log('\n--- TEST 2: Create Vehicle (POST) ---');
    const createData = await testAPI('POST', '/vehicles', {
      title: 'Ford Transit Custom Van',
      description: 'Perfect medium-sized van for deliveries and small moves',
      images: [
        'https://example.com/transit-front.jpg',
        'https://example.com/transit-side.jpg',
        'https://example.com/transit-back.jpg'
      ],
      category: categoryId,
      pricePerHour: 18,
      fuel: 'diesel',
      gear: 'manual',
      seats: 3,
      doors: 4,
      properties: [
        { name: 'Cargo Volume', value: '8.3 m³' },
        { name: 'Payload', value: '1,355 kg' },
        { name: 'Length', value: '5.34 m' },
        { name: 'Width', value: '2.06 m' },
        { name: 'Height', value: '2.15 m' }
      ]
    });
    
    if (createData?.data?._id) {
      vehicleId = createData.data._id;
      console.log('✅ Vehicle created with ID:', vehicleId);
    }
  }

  // 3. Get All Vehicles
  console.log('\n--- TEST 3: Get All Vehicles (GET) ---');
  await testAPI('GET', '/vehicles');

  // 4. Get Vehicle by ID
  if (vehicleId) {
    console.log('\n--- TEST 4: Get Vehicle by ID (GET) ---');
    await testAPI('GET', `/vehicles/${vehicleId}`);
  }

  // 5. Update Vehicle - Change price and description
  if (vehicleId) {
    console.log('\n--- TEST 5: Update Vehicle (PATCH) - Price & Description ---');
    await testAPI('PATCH', `/vehicles/${vehicleId}`, {
      pricePerHour: 22,
      description: 'Updated: Premium medium-sized van with GPS included'
    });
  }

  // 6. Update Vehicle - Change fuel and gear
  if (vehicleId) {
    console.log('\n--- TEST 6: Update Vehicle (PATCH) - Fuel & Gear ---');
    await testAPI('PATCH', `/vehicles/${vehicleId}`, {
      fuel: 'hybrid',
      gear: 'automatic'
    });
  }

  // 7. Update Vehicle - Add more images
  if (vehicleId) {
    console.log('\n--- TEST 7: Update Vehicle (PATCH) - Images ---');
    await testAPI('PATCH', `/vehicles/${vehicleId}`, {
      images: [
        'https://example.com/transit-front-new.jpg',
        'https://example.com/transit-side-new.jpg',
        'https://example.com/transit-back-new.jpg',
        'https://example.com/transit-interior.jpg'
      ]
    });
  }

  // 8. Update Vehicle - Modify properties
  if (vehicleId) {
    console.log('\n--- TEST 8: Update Vehicle (PATCH) - Properties ---');
    await testAPI('PATCH', `/vehicles/${vehicleId}`, {
      properties: [
        { name: 'Cargo Volume', value: '8.3 m³' },
        { name: 'Payload', value: '1,355 kg' },
        { name: 'Length', value: '5.34 m' },
        { name: 'Width', value: '2.06 m' },
        { name: 'Height', value: '2.15 m' },
        { name: 'Bluetooth', value: 'Yes' },
        { name: 'Air Conditioning', value: 'Yes' }
      ]
    });
  }

  // 9. Get Updated Vehicle
  if (vehicleId) {
    console.log('\n--- TEST 9: Get Updated Vehicle ---');
    await testAPI('GET', `/vehicles/${vehicleId}`);
  }

  // 10. Update Vehicle - Change seats and doors
  if (vehicleId) {
    console.log('\n--- TEST 10: Update Vehicle (PATCH) - Seats & Doors ---');
    await testAPI('PATCH', `/vehicles/${vehicleId}`, {
      seats: 7,
      doors: 5
    });
  }

  // 11. Update service - Tire (200 days ago to test expiry)
  if (vehicleId) {
    console.log('\n--- TEST 11: Update Service - Tire (200 days ago) ---');
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 200);
    await testAPI('POST', '/vehicles/update-service', {
      vehicleId: vehicleId,
      serviceType: 'tire',
      serviceDate: oldDate
    });
  }

  // 12. Update service - Oil (100 days ago to test expiry)
  if (vehicleId) {
    console.log('\n--- TEST 12: Update Service - Oil (100 days ago) ---');
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 100);
    await testAPI('POST', '/vehicles/update-service', {
      vehicleId: vehicleId,
      serviceType: 'oil',
      serviceDate: oldDate
    });
  }

  // 13. Check vehicles needing service
  console.log('\n--- TEST 13: Check Vehicles Needing Service (GET) ---');
  await testAPI('GET', '/vehicles/service-check');

  // 14. Get vehicle to see needsService flag
  if (vehicleId) {
    console.log('\n--- TEST 14: Get Vehicle (check needsService flag) ---');
    await testAPI('GET', `/vehicles/${vehicleId}`);
  }

  // 15. Update all services to current date
  if (vehicleId) {
    console.log('\n--- TEST 15: Update All Services to Current Date ---');
    const serviceTypes = ['tire', 'oil', 'battery', 'air', 'service'];
    for (const type of serviceTypes) {
      await testAPI('POST', '/vehicles/update-service', {
        vehicleId: vehicleId,
        serviceType: type,
        serviceDate: new Date()
      });
    }
  }

  // 16. Check service again (should be clean)
  console.log('\n--- TEST 16: Check Service Again (should be clean) ---');
  await testAPI('GET', '/vehicles/service-check');

  // 17. Test invalid vehicle ID
  console.log('\n--- TEST 17: Get Invalid Vehicle ID (should fail) ---');
  await testAPI('GET', '/vehicles/000000000000000000000000');

  // 18. Delete Vehicle
  if (vehicleId) {
    console.log('\n--- TEST 18: Delete Vehicle (DELETE) ---');
    await testAPI('DELETE', `/vehicles/${vehicleId}`);
  }

  // 19. Verify deletion
  if (vehicleId) {
    console.log('\n--- TEST 19: Verify Deletion (should fail) ---');
    await testAPI('GET', `/vehicles/${vehicleId}`);
  }

  console.log('\n✅ Vehicle tests completed!');
}

runVehicleTests();
