# Load Testing Guide

## Overview

This guide explains how to perform load testing on the Aicitel web application API endpoints to ensure they can handle production traffic.

---

## Why Load Testing?

Load testing helps us:
- **Identify performance bottlenecks** before they affect users
- **Validate infrastructure scaling** capabilities
- **Establish baseline metrics** for monitoring
- **Ensure rate limiting** works as expected
- **Test database performance** under load
- **Verify third-party integrations** (Turnstile, Strapi, Redis) handle load

---

## Tool: k6

We use [k6](https://k6.io) for load testing because it's:
- Fast and lightweight
- Easy to script in JavaScript
- Great visualization and reporting
- Cloud and local execution
- Open source

### Installation

**macOS:**
```bash
brew install k6
```

**Linux:**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Windows:**
```bash
choco install k6
```

---

## Test Scenarios

### 1. Application Endpoint (`/api/apply`)

**File**: [load-tests/apply-endpoint.test.js](file:///Users/mohamedshamnsghazy/aicitel/aicitel-web/load-tests/apply-endpoint.test.js)

**Test Profile:**
- Ramp up: 10 → 50 → 100 concurrent users
- Duration: 5.5 minutes total
- Simulates realistic application submission patterns

**Run Test:**
```bash
# Local testing
k6 run load-tests/apply-endpoint.test.js

# Against staging
k6 run --env BASE_URL=https://staging.aicitel.com load-tests/apply-endpoint.test.js

# Generate HTML report
k6 run --out json=results.json load-tests/apply-endpoint.test.js
```

**Expected Results:**
- ✅ 95% of requests < 2000ms
- ✅ Error rate < 5%
- ✅ Rate limiting triggers appropriately
- ✅ No database connection errors

### 2. Inquiry Endpoint (`/api/inquiry`)

**File**: [load-tests/inquiry-endpoint.test.js](file:///Users/mohamedshamnsghazy/aicitel/aicitel-web/load-tests/inquiry-endpoint.test.js)

**Test Profile:**
- Ramp up: 20 → 75 → 150 concurrent users
- Duration: 5.5 minutes total
- Higher load as inquiry form is simpler than application form

**Run Test:**
```bash
k6 run load-tests/inquiry-endpoint.test.js

# With custom thresholds
k6 run --env BASE_URL=https://staging.aicitel.com load-tests/inquiry-endpoint.test.js
```

**Expected Results:**
- ✅ 95% of requests < 1500ms
- ✅ Error rate < 5%
- ✅ Handles 150 concurrent users
- ✅ Database queries optimized

---

## Running Load Tests

### Pre-Test Checklist

- [ ] Test environment is ready (staging preferred)
- [ ] Database has sufficient connections available
- [ ] Rate limiting configured appropriately
- [ ] Monitoring tools ready (Sentry, database metrics)
- [ ] Team notified (don't alarm anyone!)
- [ ] Backup recent (in case something goes wrong)

### Basic Test Execution

```bash
# Run apply endpoint test
k6 run load-tests/apply-endpoint.test.js

# Run inquiry endpoint test
k6 run load-tests/inquiry-endpoint.test.js
```

### Advanced Options

**Custom VUs and Duration:**
```bash
k6 run --vus 50 --duration 5m load-tests/apply-endpoint.test.js
```

**Multiple Scenarios:**
```bash
k6 run --scenarios scenarios.json load-tests/apply-endpoint.test.js
```

**Cloud Execution:**
```bash
# Sign up at k6.io/cloud
k6 cloud login
k6 cloud run load-tests/apply-endpoint.test.js
```

---

## Understanding Results

### Key Metrics

**http_req_duration:**
- Median (p50): Typical user experience
- p95: 95% of users experience this or better
- p99: Worst-case for most users

**http_req_failed:**
- Percentage of failed requests
- Should be < 5% under normal load

**http_reqs:**
- Total requests per second
- Helps calculate capacity

**vus (Virtual Users):**
- Current concurrent users
- Correlate with response times

### Sample Output

```
         /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: apply-endpoint.test.js
     output: -

  scenarios: (100.00%) 1 scenario, 100 max VUs, 6m30s max duration

     ✓ status is 200
     ✓ status is not 429 (rate limited)
     ✓ response has success field
     ✓ response time < 2000ms

     checks.........................: 95.50% ✓ 3820  ✗ 180 
     data_received..................: 1.2 MB 200 kB/s
     data_sent......................: 450 kB 75 kB/s
     http_req_blocked...............: avg=1.2ms   min=0s    med=1ms    max=50ms   p(95)=3ms   
     http_req_connecting............: avg=0.8ms   min=0s    med=0.5ms  max=40ms   p(95)=2ms   
   ✓ http_req_duration..............: avg=350ms   min=100ms med=300ms  max=1.8s   p(95)=800ms 
     http_req_failed................: 4.50%  ✗ 180   ✓ 3820
     http_req_receiving.............: avg=0.5ms   min=0s    med=0.4ms  max=5ms    p(95)=1ms   
     http_req_sending...............: avg=0.1ms   min=0s    med=0.05ms max=2ms    p(95)=0.3ms 
     http_req_waiting...............: avg=349ms   min=99ms  med=299ms  max=1.79s  p(95)=799ms 
     http_reqs......................: 4000   13.3/s
     iteration_duration.............: avg=2.5s    min=1.5s  med=2.3s   max=5s     p(95)=3.8s  
     iterations.....................: 4000   13.3/s
     vus............................: 100    min=1   max=100
     vus_max........................: 100    min=100 max=100

running (5m00.0s), 000/100 VUs, 4000 complete and 0 interrupted iterations
default ✓ [======================================] 100 VUs  5m0s
```

### What to Look For

**🟢 Good Signs:**
- p95 response time < threshold
- Error rate < 5%
- Consistent performance across load stages
- No timeouts or connection errors

**🔴 Warning Signs:**
- Increasing response times under load
- Error rate > 10%
- Database connection pool exhausted
- Memory leaks (increasing over time)

---

## Analyzing Bottlenecks

### Common Issues and Solutions

#### 1. High Response Times

**Symptoms:**
- p95 > 2000ms
- Response times increase linearly with load

**Diagnosis:**
```bash
# Check database queries
# Look at Sentry performance monitoring
# Review Strapi logs
```

**Solutions:**
- Add database indexes
- Optimize Strapi queries
- Increase database connection pool
- Add caching layer (Redis)

#### 2. High Error Rate

**Symptoms:**
- http_req_failed > 10%
- 500 errors in responses

**Diagnosis:**
- Check Sentry for errors
- Review application logs
- Monitor database connections

**Solutions:**
- Fix application bugs
- Increase timeout values
- Scale infrastructure
- Improve error handling

#### 3. Rate Limiting Issues

**Symptoms:**
- Many 429 responses
- Legitimate users affected

**Diagnosis:**
- Check Upstash Redis metrics
- Review rate limit configuration

**Solutions:**
- Adjust rate limits in code
- Implement per-user limits vs IP limits
- Add rate limit headers for client handling

#### 4. Database Connection Pool Exhausted

**Symptoms:**
- "too many connections" errors
- Connection timeout errors

**Diagnosis:**
```sql
-- Check active connections
SELECT COUNT(*) FROM pg_stat_activity;

-- Check max connections
SHOW max_connections;
```

**Solutions:**
- Increase `DATABASE_POOL_MAX` in backend config
- Optimize query execution time
- Implement connection pooling
- Consider read replicas

---

## Performance Benchmarks

### Target Metrics (Production)

| Endpoint | p50 | p95 | p99 | Max RPS | Error Rate |
|----------|-----|-----|-----|---------|------------|
| /api/apply | < 500ms | < 1500ms | < 2500ms | 20/s | < 2% |
| /api/inquiry | < 300ms | < 1000ms | < 2000ms | 30/s | < 2% |

### Current Results

**Baseline (to be filled after testing):**

| Endpoint | p50 | p95 | p99 | Max RPS | Error Rate |
|----------|-----|-----|-----|---------|------------|
| /api/apply | TBD | TBD | TBD | TBD | TBD |
| /api/inquiry | TBD | TBD | TBD | TBD | TBD |

---

## Load Testing Best Practices

### DO:
- ✅ Test on staging environment first
- ✅ Start with low load and ramp up
- ✅ Monitor resources during tests (CPU, memory, DB)
- ✅ Save results for comparison over time
- ✅ Test after significant changes
- ✅ Simulate realistic user behavior (think time)

### DON'T:
- ❌ Test on production without planning
- ❌ Run tests during business hours (for production)
- ❌ Ignore failed scenarios
- ❌ Test with unrealistic data
- ❌ Skip monitoring during tests
- ❌ Forget to clean up test data

---

## Continuous Load Testing

### Weekly Smoke Tests

Run quick tests to catch regressions:

```bash
# 30-second quick test
k6 run --duration 30s --vus 10 load-tests/apply-endpoint.test.js
```

### Monthly Full Load Tests

Run complete test suite:
- All endpoints
- Peak load scenarios
- Sustained load tests
- Spike testing

### Before Production Deploy

Always run load tests before major releases:
```bash
./run-load-tests.sh staging
```

---

## Interpreting and Reporting Results

### Create Summary Report

After testing, document:

1. **Test Configuration**
   - Date and time
   - Environment (staging/production)
   - k6 version
   - Test duration

2. **Results**
   - Key metrics (p50, p95, p99)
   - Error rate
   - Max throughput achieved

3. **Issues Found**
   - Performance bottlenecks
   - Errors encountered
   - Infrastructure limits

4. **Actions Taken**
   - Optimizations made
   - Configuration changes
   - Follow-up tasks

### Store Results

```bash
# Save results
k6 run --out json=results/apply_$(date +%Y%m%d).json load-tests/apply-endpoint.test.js

# Archive old results
mkdir -p results/archive
mv results/*.json results/archive/
```

---

## Troubleshooting Load Tests

### k6 Fails to Start

```bash
# Check installation
k6 version

# Verify test file syntax
k6 run --no-usage-report load-tests/apply-endpoint.test.js
```

### Certificate Errors

```bash
# Skip TLS verification (staging only!)
k6 run --insecure-skip-tls-verify load-tests/apply-endpoint.test.js
```

### Rate Limited Immediately

- Verify test uses different IPs (load test vs real traffic)
- Temporarily increase rate limits for testing
- Use staging environment with relaxed limits

---

## Next Steps

After initial load testing:

1. **Optimize** based on findings
2. **Re-test** to verify improvements
3. **Set up monitoring** for production metrics
4. **Create alerts** for performance regressions
5. **Document** performance baselines
6. **Schedule** regular load tests

---

## Resources

- **k6 Documentation**: https://k6.io/docs/
- **k6 Examples**: https://k6.io/docs/examples/
- **k6 Cloud**: https://k6.io/cloud/
- **Performance Testing Guide**: https://k6.io/docs/testing-guides/

---

Last Updated: 2026-02-17
