const http = require('http');

const baseUrl = 'http://localhost:3000';
let sessionCookie = null;

async function request(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, baseUrl);
        const options = {
            method: method,
            headers: {
                'User-Agent': 'SmartConstruction-Automated-Auditor/1.0'
            }
        };

        if (sessionCookie) {
            options.headers['Cookie'] = sessionCookie;
        }

        let body = null;
        if (data) {
            body = new URLSearchParams(data).toString();
            options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            options.headers['Content-Length'] = Buffer.byteLength(body);
        }

        const req = http.request(url, options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => { responseData += chunk; });
            res.on('end', () => {
                // Check for session cookie setting on login
                if (res.headers['set-cookie'] && !sessionCookie) {
                    sessionCookie = res.headers['set-cookie'][0].split(';')[0];
                }
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: responseData
                });
            });
        });

        req.on('error', (err) => { reject(err); });
        if (body) req.write(body);
        req.end();
    });
}

async function runAudit() {
    console.log('🚀 Starting Automated Full-Stack Verification & EJS Crash Test...');
    
    try {
        // 1. Log in as SuperAdmin
        console.log('\n🔑 Step 1: Logging in as SuperAdmin...');
        const loginRes = await request('POST', '/login', { email: 'admin@smartconstruction.bd', password: 'admin123' });
        if (loginRes.statusCode === 302 && loginRes.headers.location === '/dashboard') {
            console.log('✅ Login Successful! Session Cookie Established.');
        } else {
            console.error('❌ Login Failed! Status:', loginRes.statusCode);
        }

        // 2. Test All Routes across Sprints 1, 2, 3, and 4
        const routesToTest = [
            // Sprint 1 (Foundation & Baseline)
            { name: 'Home (CMS & Public View)', path: '/' },
            { name: 'Executive Management Dashboard', path: '/dashboard' },
            { name: 'Material Stock Tracking (A1)', path: '/materials' },
            { name: 'Vendor Directory & Ratings (B1)', path: '/vendors' },
            { name: 'Create Project Form', path: '/projects/create' },
            { name: 'Milestone Tracker (C1)', path: '/milestones' },
            
            // Sprint 2 (Core Logistical Workflows)
            { name: 'Purchase Orders System (A2)', path: '/purchase_orders' },
            { name: 'Inventory Transfers Hub (A3)', path: '/inventory-transfers' },
            { name: 'Delivery Scheduling (B2)', path: '/deliveries' },
            { name: 'Labor Attendance & Cost (C2)', path: '/labor' },
            { name: 'Notice Board / Announcements (D3)', path: '/notices' },

            // Sprint 3 (Intelligence & Visualizations)
            { name: 'Material Waste Auditing (A4)', path: '/waste-logs' },
            { name: 'Price Comparison Engine (B3)', path: '/price-comparison' },
            { name: 'Project Progress Gantt-lite (C3)', path: '/dashboard_projects' },
            { name: 'Emergency Material Requests (D4)', path: '/material-requests' },

            // Sprint 4 (Reporting, Financials & Fleet Operations)
            { name: 'BOQ Generator Directory (A5)', path: '/boq' },
            { name: 'BOQ Worksheet Create Form (A5)', path: '/boq/create' },
            { name: 'BOQ Worksheet View #1 (A5)', path: '/boq/1' },
            { name: 'BOQ Excel CSV Export #1 (A5)', path: '/boq/1/export-csv' },
            { name: 'Contract Document Uploads (B4)', path: '/contracts' },
            { name: 'Vendor Payment Tracker (B5)', path: '/payments' },
            { name: 'Payment Disbursement Form (B5)', path: '/payments/create' },
            { name: 'Vendor Account Ledger View #1 (B5)', path: '/payments/vendor/1' },
            { name: 'Expenses Project Overview (C4)', path: '/expenses' },
            { name: 'Expense Financial Report #1 (C4)', path: '/expenses/report?project_id=1' },
            { name: 'Expense Excel CSV Export #1 (C4)', path: '/expenses/export-csv?project_id=1' },
            { name: 'Daily Site Reports List (C5)', path: '/site-reports' },
            { name: 'Generate Site Report Form (C5)', path: '/site-reports/generate?project_id=1' },
            { name: 'Daily Site Report View #1 (C5)', path: '/site-reports/1' },
            { name: 'Equipment & Maintenance Hub (D5)', path: '/equipment' },
            { name: 'Register Machinery Form (D5)', path: '/equipment/create' },
            { name: 'Schedule Service Form (D5)', path: '/equipment/schedule?equipment_id=1' }
        ];

        let passed = 0;
        let failed = 0;
        console.log('\n📡 Step 2: Auditing All 32 Application Endpoints & CSV Exports...');
        console.log('---------------------------------------------------------------------------------');

        for (const r of routesToTest) {
            const res = await request('GET', r.path);
            // Expect 200 OK for valid pages and file downloads
            if (res.statusCode === 200) {
                console.log(`✅ [200 OK] ${r.name.padEnd(35)} -> ${r.path}`);
                passed++;
            } else {
                console.error(`❌ [ERROR ${res.statusCode}] ${r.name.padEnd(30)} -> ${r.path}`);
                const titleMatch = res.body.match(/<title>(.*?)<\/title>/i) || res.body.match(/Error:.*|<h[1-3]>.*?<\/h[1-3]>/i);
                if (titleMatch) {
                    console.error(`       Snippet/Title: ${titleMatch[0]}`);
                }
                if (res.body.includes('ReferenceError') || res.body.includes('SyntaxError') || res.body.includes('TypeError') || res.body.includes('sqlMessage')) {
                    const errorLines = res.body.split('\n').filter(l => l.includes('Error') || l.includes('at ')).slice(0, 4).join('\n       ');
                    console.error(`       Exception Trace:\n       ${errorLines}`);
                }
                failed++;
            }
        }

        console.log('---------------------------------------------------------------------------------');
        console.log(`📊 Final Verification Results: ${passed} PASSED | ${failed} FAILED out of ${routesToTest.length} tested endpoints.`);
        if (failed === 0) {
            console.log('🌟 SUCCESS: 100% of routes rendered immaculately! Zero ReferenceErrors, 404s, or HTTP 500s!');
            process.exit(0);
        } else {
            console.log('⚠️ WARNING: Some routes failed. Review error output above!');
            process.exit(1);
        }
    } catch (err) {
        console.error('Fatal Test Suite Exception:', err);
        process.exit(1);
    }
}

runAudit();
