import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
    stages: [
        { duration: '30s', target: 20 },  // Ramp up to 20 users
        { duration: '1m', target: 20 },   // Stay at 20 users
        { duration: '30s', target: 75 },  // Ramp up to 75 users
        { duration: '2m', target: 75 },   // Stay at 75 users
        { duration: '30s', target: 150 }, // Spike to 150 users
        { duration: '1m', target: 150 },  // Hold at 150 users
        { duration: '30s', target: 0 },   // Ramp down to 0
    ],
    thresholds: {
        http_req_duration: ['p(95)<1500'], // 95% of requests should be below 1.5s
        http_req_failed: ['rate<0.05'],    // Less than 5% of requests should fail
        errors: ['rate<0.1'],              // Less than 10% error rate
    },
};

// Base URL - update this for your environment
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_URL = `${BASE_URL}/api/inquiry`;

// Sample data generator
function generateInquiryData() {
    const randomId = Math.floor(Math.random() * 1000000);
    const companies = ['Tech Corp', 'Sales GmbH', 'Marketing Inc', 'Business AG', 'Consulting Ltd'];
    const types = ['Partnership', 'Sales', 'Support', 'General'];

    return {
        companyName: `${companies[Math.floor(Math.random() * companies.length)]} ${randomId}`,
        contactPerson: `Contact Person ${randomId}`,
        email: `contact${randomId}@company${randomId}.com`,
        phone: `+4930${Math.floor(Math.random() * 100000000)}`,
        message: `This is a load test inquiry message from company ${randomId}. We are interested in learning more about your direct sales services and how we can collaborate.`,
        type: types[Math.floor(Math.random() * types.length)],
        token: 'test-turnstile-token-for-load-testing',
    };
}

export default function () {
    // Generate test data
    const inquiryData = generateInquiryData();

    // Prepare request payload
    const payload = JSON.stringify(inquiryData);
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
        tags: { name: 'InquirySubmission' },
    };

    // Make request
    const response = http.post(API_URL, payload, params);

    // Validate response
    const success = check(response, {
        'status is 200': (r) => r.status === 200,
        'status is not 429 (rate limited)': (r) => r.status !== 429,
        'response has success field': (r) => r.json('success') !== undefined,
        'response time < 1500ms': (r) => r.timings.duration < 1500,
        'no server errors': (r) => r.status < 500,
    });

    // Track errors
    errorRate.add(!success);

    // Log failures for debugging
    if (response.status !== 200 && response.status !== 429) {
        console.error(`Request failed with status ${response.status}: ${response.body}`);
    }

    // Simulate realistic user behavior - inquiries take longer to fill out
    sleep(Math.random() * 5 + 2); // 2-7 seconds
}

// Test setup
export function setup() {
    console.log('Starting inquiry endpoint load test');
    console.log(`Target URL: ${API_URL}`);
}

// Test teardown
export function teardown(data) {
    console.log('Load test completed');
}
