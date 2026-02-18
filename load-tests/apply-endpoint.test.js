import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
    stages: [
        { duration: '30s', target: 10 },  // Ramp up to 10 users
        { duration: '1m', target: 10 },   // Stay at 10 users
        { duration: '30s', target: 50 },  // Ramp up to 50 users
        { duration: '2m', target: 50 },   // Stay at 50 users
        { duration: '30s', target: 100 }, // Spike to 100 users
        { duration: '1m', target: 100 }, // Hold at 100 users
        { duration: '30s', target: 0 },   // Ramp down to 0
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
        http_req_failed: ['rate<0.05'],    // Less than 5% of requests should fail
        errors: ['rate<0.1'],              // Less than 10% error rate
    },
};

// Base URL - update this for your environment
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_URL = `${BASE_URL}/api/apply`;

// Sample data generator
function generateApplicationData() {
    const randomId = Math.floor(Math.random() * 1000000);
    return {
        fullName: `Test User ${randomId}`,
        email: `test${randomId}@example.com`,
        phone: `+4917${Math.floor(Math.random() * 100000000)}`,
        notes: 'This is a load test application submission.',
        token: 'test-turnstile-token-for-load-testing',
    };
}

export default function () {
    // Generate test data
    const formData = generateApplicationData();

    // Prepare request payload
    const payload = JSON.stringify(formData);
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
        tags: { name: 'ApplicationSubmission' },
    };

    // Make request
    const response = http.post(API_URL, payload, params);

    // Validate response
    const success = check(response, {
        'status is 200': (r) => r.status === 200,
        'status is not 429 (rate limited)': (r) => r.status !== 429,
        'response has success field': (r) => r.json('success') !== undefined,
        'response time < 2000ms': (r) => r.timings.duration < 2000,
    });

    // Track errors
    errorRate.add(!success);

    // Log failures
    if (response.status !== 200 && response.status !== 429) {
        console.error(`Request failed with status ${response.status}: ${response.body}`);
    }

    // Simulate realistic user behavior - wait between requests
    sleep(Math.random() * 3 + 1); // 1-4 seconds
}

// Test teardown
export function teardown(data) {
    console.log('Load test completed');
}
