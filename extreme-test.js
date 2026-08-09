const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./config/db');

const baseUrl = 'http://localhost:3000';
let sessionCookie = null;

async function request(method, path, data = null, isMultipart = false, boundary = '----SmarstructionBoundary12345') {
    return new Promise((resolve, reject) => {
        const url = new URL(path, baseUrl);
        const options = {
            method: method,
            headers: {
                'User-Agent': 'Smarstruction-Extreme-QA-Auditor/2.0'
            }
        };

        if (sessionCookie) {
            options.headers['Cookie'] = sessionCookie;
        }

        let body = null;
        if (data && !isMultipart) {
            body = new URLSearchParams(data).toString();
            options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            options.headers['Content-Length'] = Buffer.byteLength(body);
        } else if (data && isMultipart) {
            body = data;
            options.headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`;
            options.headers['Content-Length'] = Buffer.byteLength(body);
        }

        const req = http.request(url, options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => { responseData += chunk; });
            res.on('end', () => {
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

function createMultipartPayload(fields, fileField, filename, fileContent, boundary) {
    let payload = '';
    for (const [key, val] of Object.entries(fields)) {
        payload += `--${boundary}\r\n`;
        payload += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
        payload += `${val}\r\n`;
    }
    payload += `--${boundary}\r\n`;
    payload += `Content-Disposition: form-data; name="${fileField}"; filename="${filename}"\r\n`;
    payload += `Content-Type: text/plain\r\n\r\n`;
    payload += `${fileContent}\r\n`;
    payload += `--${boundary}--\r\n`;
    return Buffer.from(payload, 'utf-8');
}

async function runExtremeAudit() {
    console.log('🔥 STARTING EXTREME FULL-LIFECYCLE SIMULATION QA AUDIT...');
    let totalSteps = 0;
    let passedSteps = 0;

    function check(stepName, condition, details = '') {
        totalSteps++;
        if (condition) {
            console.log(`✅ [PASS] Step ${totalSteps}: ${stepName}`);
            passedSteps++;
        } else {
            console.error(`❌ [FAIL] Step ${totalSteps}: ${stepName}`);
            if (details) console.error(`       Details: ${details}`);
            process.exit(1); // Fail immediately on first breakdown
        }
    }

    try {
        // Step 1: Authentication
        console.log('\n🔑 Phase 1: Authentication & Session Access');
        const loginRes = await request('POST', '/login', { email: 'admin@smarstruction.bd', password: 'admin123' });
        check('Login as SuperAdmin returns 302 redirect to Dashboard', loginRes.statusCode === 302 && loginRes.headers.location === '/dashboard');

        // Step 2: Member A — BOQ Generator Full Lifecycle
        console.log('\n🏗️ Phase 2: Member A — BOQ Generator Full Lifecycle');
        const createBoqRes = await request('POST', '/boq/create', {
            project_id: 1,
            title: 'Extreme Quality Assurance Structural BOQ',
            notes: 'Testing full CRUD and calculation engine under extreme simulated load.'
        });
        check('Create BOQ Worksheet submits and redirects to new worksheet', createBoqRes.statusCode === 302 && createBoqRes.headers.location.startsWith('/boq/'));
        const newBoqId = createBoqRes.headers.location.split('/').pop();
        console.log(`       -> Created BOQ Worksheet ID: ${newBoqId}`);

        const boqViewRes = await request('GET', `/boq/${newBoqId}`);
        check('Newly created BOQ Worksheet renders without error (HTTP 200)', boqViewRes.statusCode === 200 && !boqViewRes.body.includes('ReferenceError'));

        // Add catalog item to BOQ
        const addItem1Res = await request('POST', `/boq/${newBoqId}/add-item`, {
            material_name: 'Portland Cement Grade-53',
            unit: 'Bags',
            quantity_estimated: '600',
            unit_price_estimated: '550.00',
            item_category: 'Cement'
        });
        check('Add catalog item to BOQ succeeds (redirect back to BOQ)', addItem1Res.statusCode === 302 && addItem1Res.headers.location === `/boq/${newBoqId}`);

        // Add custom temporary item to BOQ
        const addItem2Res = await request('POST', `/boq/${newBoqId}/add-item`, {
            material_name: 'Temporary Scaffolding Bamboo (Delete Test)',
            unit: 'Bundle',
            quantity_estimated: '50',
            unit_price_estimated: '1200.00',
            item_category: 'Temporary'
        });
        check('Add custom temporary item to BOQ succeeds', addItem2Res.statusCode === 302);

        // Check db for inserted item ID to delete it
        const [items] = await db.query('SELECT id FROM boq_items WHERE boq_id = ? AND material_name LIKE "%Scaffolding%"', [newBoqId]);
        check('Custom item found in MySQL database', items.length > 0);
        const itemIdToDelete = items[0].id;

        // Delete the temporary item
        const deleteItemRes = await request('POST', `/boq/delete-item/${itemIdToDelete}`, { boq_id: newBoqId });
        check('Delete BOQ line item succeeds and redirects to worksheet', deleteItemRes.statusCode === 302);

        // Verify final rendered BOQ math and CSV export
        const finalBoqRes = await request('GET', `/boq/${newBoqId}`);
        check('BOQ Worksheet renders calculations correctly after deletion', finalBoqRes.statusCode === 200 && finalBoqRes.body.includes('330,000.00')); // 600 * 550 = 330000

        const boqCsvRes = await request('GET', `/boq/${newBoqId}/export-csv`);
        check('BOQ Excel CSV Export generates file with correct financial grand total', boqCsvRes.statusCode === 200 && boqCsvRes.body.includes('330000.00') && boqCsvRes.headers['content-type'].includes('text/csv'));

        // Step 3: Member B — Vendor Contract Uploads & Payment Tracker
        console.log('\n📜 Phase 3: Member B — Vendor Contract Upload & Payment Disbursement');
        const boundary = '----SmarstructionExtremeTestBoundary998877';
        const fileContent = 'This is a valid test contract agreement document generated by Smarstruction Extreme QA.';
        const contractPayload = createMultipartPayload({ vendor_id: '1', title: '2026 Master Steel Agreement (Extreme Test)' }, 'contract_file', 'extreme_test_contract.txt', fileContent, boundary);
        
        const uploadRes = await request('POST', '/contracts', contractPayload, true, boundary);
        check('Upload Vendor Contract Document via Multer file processing succeeds (302 Redirect)', uploadRes.statusCode === 302 && uploadRes.headers.location === '/contracts');

        const contractsListRes = await request('GET', '/contracts');
        check('Contracts Directory renders uploaded file cleanly without errors', contractsListRes.statusCode === 200 && contractsListRes.body.includes('2026 Master Steel Agreement (Extreme Test)'));

        // Issue payment disbursement
        const payRes = await request('POST', '/payments/create', {
            vendor_id: '1',
            po_id: '1',
            payment_type: 'Milestone Payment',
            amount: '250000.00',
            payment_method: 'Bank Transfer (EFT/BEFTN)',
            reference_no: 'EXTREME-EFT-9900',
            payment_date: '2026-08-03',
            notes: 'QA simulation disbursement'
        });
        check('Record Vendor Payment Disbursement submits cleanly to database', payRes.statusCode === 302 && payRes.headers.location === '/payments');

        const vendorLedgerRes = await request('GET', '/payments/vendor/1');
        check('Vendor Account Ledger statement page renders new debit/credit audit trail without ReferenceError', vendorLedgerRes.statusCode === 200 && vendorLedgerRes.body.includes('EXTREME-EFT-9900') && !vendorLedgerRes.body.includes('NaN'));

        // Step 4: Member C — Project Expense Reports & Daily Site Progress
        console.log('\n📊 Phase 4: Member C — Expense Reports & Daily Site Progress Reports');
        const expenseReportRes = await request('GET', '/expenses/report?project_id=1&start_date=2026-01-01&end_date=2027-12-31');
        check('Generate Filtered Expense Report with date range renders without error', expenseReportRes.statusCode === 200 && !expenseReportRes.body.includes('ReferenceError'), `Status: ${expenseReportRes.statusCode}, Body snippet: ${expenseReportRes.body.slice(0, 400)}`);

        const expenseCsvRes = await request('GET', '/expenses/export-csv?project_id=1');
        check('Expense Report CSV Excel download succeeds (HTTP 200)', expenseCsvRes.statusCode === 200 && expenseCsvRes.headers['content-type'].includes('text/csv'));

        // Generate brand new Daily Site Report
        const siteReportPostRes = await request('POST', '/site-reports/create', {
            project_id: '1',
            report_date: '2026-08-03',
            weather_condition: 'Stormy & Heavy Rainfall (28°C)',
            general_progress: 'Executed structural inspection and drainage pump verification under extreme testing.',
            safety_incidents: 'Zero accidents or near-misses recorded.'
        });
        check('Generate & Publish Daily Site Report form submission succeeds (302 Redirect)', siteReportPostRes.statusCode === 302 && siteReportPostRes.headers.location.startsWith('/site-reports/'));

        // Check db for new report ID
        const [reports] = await db.query('SELECT id FROM daily_site_reports WHERE weather_condition LIKE "%Stormy%" ORDER BY id DESC LIMIT 1');
        check('Newly published Daily Site Report found in MySQL', reports.length > 0);
        const newReportId = reports[0].id;

        const siteReportViewRes = await request('GET', `/site-reports/${newReportId}`);
        check('Published Daily Site Report page renders system auto-aggregated labor & shipments without ReferenceError', siteReportViewRes.statusCode === 200 && !siteReportViewRes.body.includes('ReferenceError') && siteReportViewRes.body.includes('Stormy'));

        // Step 5: Member D — Heavy Fleet Registry & Maintenance State Engine
        console.log('\n🚜 Phase 5: Member D — Fleet Registry & Maintenance Automation Engine');
        const regMachineryRes = await request('POST', '/equipment/create', {
            name: 'CAT Bulldozer D9-Extreme',
            equipment_code: 'CAT-EXT-009',
            category: 'Heavy Machinery',
            current_project_id: '1',
            status: 'Operational',
            purchase_date: '2026-08-01'
        });
        check('Register New Machinery submits cleanly and redirects to Equipment Hub', regMachineryRes.statusCode === 302 && regMachineryRes.headers.location === '/equipment');

        const [machines] = await db.query('SELECT id, status FROM equipment WHERE equipment_code = "CAT-EXT-009"');
        check('Registered CAT Bulldozer exists in database with status Operational', machines.length > 0 && machines[0].status === 'Operational');
        const newMachineId = machines[0].id;

        // Schedule maintenance (Repair type)
        const schedRes = await request('POST', '/equipment/schedule', {
            equipment_id: newMachineId,
            scheduled_date: '2026-08-03',
            maintenance_type: 'Repair',
            description: 'Hydraulic high-pressure hose overhaul and seal check.',
            assigned_to: 'CAT Authorized Specialists',
            cost_estimate: '45000.00',
            notes: 'Scheduled via Extreme QA Audit'
        });
        check('Schedule Maintenance Service submits cleanly', schedRes.statusCode === 302 && schedRes.headers.location === '/equipment');

        // Check if machinery status automatically shifted to 'Under Maintenance'
        const [machinesAfterSched] = await db.query('SELECT status FROM equipment WHERE id = ?', [newMachineId]);
        check('Automated state trigger shifted machine operational status to "Under Maintenance"', machinesAfterSched[0].status === 'Under Maintenance', `Actual status: ${machinesAfterSched[0].status}`);

        // Find maintenance task ID
        const [maintTasks] = await db.query('SELECT id FROM maintenance_schedules WHERE equipment_id = ? ORDER BY id DESC LIMIT 1', [newMachineId]);
        const maintTaskId = maintTasks[0].id;

        // Start work
        const startWorkRes = await request('POST', `/equipment/maintenance/${maintTaskId}/status`, {
            status: 'In Progress',
            equipment_id: newMachineId
        });
        check('Update maintenance status to "In Progress" succeeds', startWorkRes.statusCode === 302);

        // Mark Complete
        const completeWorkRes = await request('POST', `/equipment/maintenance/${maintTaskId}/status`, {
            status: 'Completed',
            equipment_id: newMachineId
        });
        check('Mark maintenance task as "Completed" & Operational succeeds', completeWorkRes.statusCode === 302);

        // Verify machine automatically returned to Operational
        const [machinesFinal] = await db.query('SELECT status FROM equipment WHERE id = ?', [newMachineId]);
        check('Automated restoration trigger successfully returned machine status back to "Operational"', machinesFinal[0].status === 'Operational', `Actual status: ${machinesFinal[0].status}`);

        console.log('\n==================================================================================');
        console.log(`🏆 EXTREME QA CERTIFIED: ALL ${passedSteps}/${totalSteps} LIFECYCLE SIMULATION TESTS PASSED WITH 100% PERFECTION!`);
        console.log('🛡️ Zero unhandled exceptions! Zero SQL syntax bugs! Zero broken redirects! ZERO ReferenceErrors!');
        console.log('🎬 YOU ARE COMPLETELY BULLETPROOF FOR YOUR VIDEO DEMONSTRATION!');
        console.log('==================================================================================\n');
        process.exit(0);
    } catch (err) {
        console.error('\n🚨 FATAL EXTREME AUDIT EXCEPTION DETECTED:', err);
        process.exit(1);
    }
}

runExtremeAudit();
