const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads/contracts');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// List Contracts
async function listContracts(req, res) {
    try {
        let query = `
            SELECT c.*, v.company_name, u.name AS uploader_name 
            FROM vendor_contracts c
            JOIN vendors v ON c.vendor_id = v.id
            LEFT JOIN users u ON c.uploaded_by = u.id
        `;
        let params = [];

        if (req.session.user.role === 'Vendor') {
            query += ` WHERE v.user_id = ? `;
            params.push(req.session.user.id);
        }

        query += ` ORDER BY c.uploaded_at DESC`;
        const [contracts] = await db.query(query, params);

        let vendors = [];
        if (req.session.user.role !== 'Vendor') {
            const [v] = await db.query('SELECT id, company_name FROM vendors ORDER BY company_name ASC');
            vendors = v;
        }

        res.render('contracts/index', {
            title: 'Vendor Contracts',
            user: req.session.user,
            contracts, vendors,
            error: null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

// Upload Contract (Raw SQL)
async function uploadContract(req, res) {
    try {
        const { vendor_id, title } = req.body;
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const file_path = '/uploads/contracts/' + req.file.filename;

        await db.query(
            'INSERT INTO vendor_contracts (vendor_id, title, file_path, uploaded_by) VALUES (?, ?, ?, ?)',
            [vendor_id, title, file_path, req.session.user.id]
        );

        res.redirect('/contracts');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    listContracts,
    uploadContract,
    upload  // Export multer middleware for use in routes
};
