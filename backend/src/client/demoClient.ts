import { SocketClient } from './socketClient';

// Demo client showing how to use the Blood Donation System
async function runDemo() {
    const client = new SocketClient('localhost', 3000);
    
    console.log('=== Blood Donation System Demo ===\n');
    
    // 1. Register a new donor
    console.log('1. Registering a new donor...');
    const newDonor = {
        id: 'D6',
        name: 'Alice Cooper',
        blood_group: 'B+',
        location: 'NodeB',
        availability: true
    };
    
    try {
        const response = await client.registerDonor(newDonor);
        if (response.success) {
            console.log(`✓ Donor registered: ${response.data.message}`);
        } else {
            console.log(`✗ Failed to register donor: ${response.error}`);
        }
    } catch (error) {
        console.log(`✗ Error registering donor: ${(error as Error).message}`);
    }
    
    console.log('');
    
    // 2. Submit a blood request
    console.log('2. Submitting a blood request...');
    const bloodRequest = {
        id: 'R5',
        required_blood_group: 'AB+',
        urgency: 'high' as const, // Fix typing for urgency
        location: 'NodeD'
    };
    
    try {
        const response = await client.submitRecipientRequest(bloodRequest);
        if (response.success) {
            console.log(`✓ Request submitted: ${response.data.message}`);
        } else {
            console.log(`✗ Failed to submit request: ${response.error}`);
        }
    } catch (error) {
        console.log(`✗ Error submitting request: ${(error as Error).message}`);
    }
    
    console.log('');
    
    // 3. Find nearest hospital
    console.log('3. Finding nearest hospital from NodeA...');
    try {
        const response = await client.findNearestHospital('NodeA');
        if (response.success) {
            const hospital = response.data.hospital;
            const distance = response.data.distance;
            console.log(`✓ Nearest hospital: ${hospital.name} (${hospital.location})`);
            console.log(`  Distance: ${distance} km`);
        } else {
            console.log(`✗ Failed to find hospital: ${response.error}`);
        }
    } catch (error) {
        console.log(`✗ Error finding hospital: ${(error as Error).message}`);
    }
    
    console.log('');
    
    // 4. Match request (we'll use the first request from our test data)
    console.log('4. Matching donor for request R1...');
    try {
        const response = await client.matchRequest('R1');
        if (response.success) {
            const match = response.data;
            console.log(`✓ Match found:`);
            console.log(`  Donor: ${match.donorName} (${match.bloodGroup})`);
            console.log(`  Distance: ${match.distanceScore} km`);
            console.log(`  Status: ${match.status}`);
        } else {
            console.log(`✗ No match found: ${response.error}`);
        }
    } catch (error) {
        console.log(`✗ Error matching request: ${(error as Error).message}`);
    }
    
    console.log('\n=== Demo Complete ===');
}

// Run the demo if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
    runDemo().catch((error: Error) => {
        console.error(error);
        process.exit(1);
    });
}

export { runDemo };