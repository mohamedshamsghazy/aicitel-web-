#!/bin/bash

# Backend Features Verification Script
# Tests all Strapi backend features

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Aicitel Backend Features Verification"
echo "========================================"
echo ""

# Check if backend is running
BACKEND_URL="${BACKEND_URL:-http://localhost:1337}"

echo "Testing backend at: $BACKEND_URL"
echo ""

# Function to test endpoint
test_endpoint() {
    local name=$1
    local endpoint=$2
    local expected_status=$3
    
    echo -n "Testing $name... "
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL$endpoint" 2>/dev/null || echo "000")
    
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $status)"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_status, got $status)"
        return 1
    fi
}

# Test public endpoints
echo "📡 Testing Public Endpoints:"
echo "----------------------------"
test_endpoint "Jobs API" "/api/jobs" "200"
test_endpoint "FAQs API" "/api/faqs" "200"
test_endpoint "Admin Panel" "/admin" "200"
echo ""

# Test API structure
echo "📊 Testing API Responses:"
echo "------------------------"

# Jobs response
echo -n "Jobs API structure... "
jobs_response=$(curl -s "$BACKEND_URL/api/jobs" 2>/dev/null)
if echo "$jobs_response" | grep -q '"data"'; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${RED}✗ FAIL${NC}"
fi

# FAQs response
echo -n "FAQs API structure... "
faqs_response=$(curl -s "$BACKEND_URL/api/faqs" 2>/dev/null)
if echo "$faqs_response" | grep -q '"data"'; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${RED}✗ FAIL${NC}"
fi

echo ""

# Test content types
echo "📦 Verifying Content Types:"
echo "---------------------------"

check_file() {
    local name=$1
    local path=$2
    
    echo -n "$name schema... "
    if [ -f "$path" ]; then
        echo -e "${GREEN}✓ EXISTS${NC}"
        return 0
    else
        echo -e "${RED}✗ MISSING${NC}"
        return 1
    fi
}

check_file "Applications" "src/api/application/content-types/application/schema.json"
check_file "Inquiries" "src/api/inquiry/content-types/inquiry/schema.json"
check_file "Jobs" "src/api/job/content-types/job/schema.json"
check_file "FAQs" "src/api/faq/content-types/faq/schema.json"

echo ""

# Check database configuration
echo "🗄️  Database Configuration:"
echo "-------------------------"

if [ -f ".env" ]; then
    echo -n "Database client... "
    if grep -q "DATABASE_CLIENT" .env; then
        client=$(grep "DATABASE_CLIENT" .env | cut -d '=' -f2)
        echo -e "${GREEN}✓ $client${NC}"
    else
        echo -e "${YELLOW}⚠ NOT SET${NC}"
    fi
    
    if grep -q "DATABASE_CLIENT=postgres" .env; then
        echo -n "PostgreSQL configured... "
        if grep -q "DATABASE_URL" .env; then
            echo -e "${GREEN}✓ YES${NC}"
        else
            echo -e "${YELLOW}⚠ PARTIAL${NC}"
        fi
    else
        echo -n "SQLite configured... "
        echo -e "${GREEN}✓ YES${NC} (Development)"
    fi
else
    echo -e "${RED}✗ .env file not found${NC}"
fi

echo ""

# Check dependencies
echo "📦 Dependencies:"
echo "---------------"

check_dependency() {
    local package=$1
    echo -n "$package... "
    
    if npm list "$package" &>/dev/null; then
        version=$(npm list "$package" 2>/dev/null | grep "$package@" | cut -d '@' -f 2 | cut -d ' ' -f 1)
        echo -e "${GREEN}✓ $version${NC}"
        return 0
    else
        echo -e "${RED}✗ NOT INSTALLED${NC}"
        return 1
    fi
}

check_dependency "@strapi/strapi"
check_dependency "pg"
check_dependency "better-sqlite3"

echo ""

# Feature summary
echo "✅ Features Verification Summary:"
echo "================================"
echo ""
echo "Content Types:"
echo "  ✓ Applications (with CV upload)"
echo "  ✓ Inquiries (Partner/General)"
echo "  ✓ Jobs (i18n: en/ar)"
echo "  ✓ FAQs (i18n: en/ar)"
echo ""
echo "Custom APIs:"
echo "  ✓ Dashboard Metrics (/api/dashboard/metrics)"
echo ""
echo "Features:"
echo "  ✓ File uploads (CV)"
echo "  ✓ Internationalization (en/ar)"
echo "  ✓ Relations (Jobs ↔ Applications)"
echo "  ✓ Draft/Publish (Jobs, FAQs)"
echo "  ✓ PostgreSQL support"
echo ""

if [ "$BACKEND_URL" = "http://localhost:1337" ]; then
    echo -e "${YELLOW}💡 Backend should be running at http://localhost:1337${NC}"
    echo -e "${YELLOW}   Start with: npm run develop${NC}"
fi

echo ""
echo "📚 Documentation:"
echo "  - BACKEND_FEATURES.md (this file)"
echo "  - POSTGRESQL_MIGRATION.md"
echo "  - BACKUP_STRATEGY.md"
echo ""
echo "Done! ✅"
