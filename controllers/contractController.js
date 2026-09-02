const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isRequired, sanitize } = require('../middleware/validate');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads/contracts');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration with File Filter
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const cleanName = path.basename(file.originalname).replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, uniqueSuffix + '-' + cleanName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PNG, and JPG files are accepted.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB limit
    fileFilter: fileFilter
});

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
            title: 'Vendor Contract Documents',
            user: req.session.user,
            contracts, vendors,
            error: null
        });
    } catch (err) {
        console.error('List Contracts Error:', err);
        res.render('error', { message: 'Database Error: Could not retrieve vendor contracts.' });
    }
}

// Upload Contract (Raw SQL with Validation)
async function uploadContract(req, res) {
    const vendor_id = parseInt(req.body.vendor_id, 10);
    const title = sanitize(req.body.title);

    // Validation
    if (isNaN(vendor_id)) {
        return res.render('error', { message: 'Validation Error: Please select a valid vendor for this contract.' });
    }
    if (!isRequired(title) || title.length < 3) {
        return res.render('error', { message: 'Validation Error: Contract title is required and must be at least 3 characters.' });
    }
    if (!req.file) {
        return res.render('error', { message: 'Validation Error: No document file was selected for upload.' });
    }

    try {
        const file_path = '/uploads/contracts/' + req.file.filename;

        await db.query(
            'INSERT INTO vendor_contracts (vendor_id, title, file_path, uploaded_by) VALUES (?, ?, ?, ?)',
            [vendor_id, title, file_path, req.session.user.id]
        );

        res.redirect('/contracts');
    } catch (err) {
        console.error('Upload Contract Error:', err);
        res.render('error', { message: 'Database Error: Failed to save contract metadata.' });
    }
}

module.exports = {
    listContracts,
    uploadContract,
    upload
};
