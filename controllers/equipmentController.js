const db = require('../config/db');
const { isRequired, isPositiveNumber, isValidDate, sanitize } = require('../middleware/validate');

// Equipment Dashboard - Member D
async function listEquipment(req, res) {
    try {
        const [equipment] = await db.query(`
            SELECT e.*, p.name as project_name 
            FROM equipment e
            LEFT JOIN projects p ON e.current_project_id = p.id
            ORDER BY e.status ASC, e.name ASC
        `);

        const [maintenance] = await db.query(`
            SELECT ms.*, e.name as equipment_name, e.equipment_code, e.current_project_id, p.name as project_name, u.name as creator_name
            FROM maintenance_schedules ms
            JOIN equipment e ON ms.equipment_id = e.id
            LEFT JOIN projects p ON e.current_project_id = p.id
            LEFT JOIN users u ON ms.created_by = u.id
            ORDER BY 
                CASE ms.status WHEN 'In Progress' THEN 1 WHEN 'Scheduled' THEN 2 WHEN 'Overdue' THEN 3 ELSE 4 END, 
                ms.scheduled_date ASC
        `);

        res.render('equipment/index', { title: 'Equipment Maintenance Scheduler', equipment, maintenance, user: req.session.user });
    } catch (err) {
        console.error('List Equipment Error:', err);
        res.render('equipment/index', { title: 'Equipment Maintenance Scheduler', equipment: [], maintenance: [], user: req.session.user, error: 'Could not load equipment inventory.' });
    }
}

// Show Create Equipment Form
async function showCreateForm(req, res) {
    try {
        const [projects] = await db.query('SELECT id, name FROM projects ORDER BY name ASC');
        res.render('equipment/create_equipment', { projects, title: 'Register New Heavy Machinery' });
    } catch (err) {
        console.error('Show Create Equipment Form Error:', err);
        res.render('error', { message: 'Database Error: Could not load projects for equipment registration.' });
    }
}

// Create Equipment (Raw SQL with Validation)
async function createEquipment(req, res) {
    const name = sanitize(req.body.name);
    const equipment_code = sanitize(req.body.equipment_code);
    const category = sanitize(req.body.category) || 'Heavy Machinery';
    const rawProjectId = req.body.current_project_id;
    const status = sanitize(req.body.status) || 'Available';
    const purchase_date = req.body.purchase_date;
    const projectVal = req.body.current_project_id ? parseInt(req.body.current_project_id, 10) : null;

    const validStatuses = ['Operational', 'Available', 'In Use', 'Under Maintenance', 'Out of Service', 'Decommissioned'];

    // Validation
    if (!isRequired(name) || name.length < 2) {
        return res.render('error', { message: 'Validation Error: Equipment name is required.' });
    }
    if (!isRequired(equipment_code) || equipment_code.length < 2) {
        return res.render('error', { message: 'Validation Error: Unique equipment asset code is required (e.g. EXC-001).' });
    }
    if (!validStatuses.includes(status)) {
        return res.render('error', { message: 'Validation Error: Invalid equipment operational status.' });
    }
    if (purchase_date && !isValidDate(purchase_date)) {
        return res.render('error', { message: 'Validation Error: Invalid purchase date format.' });
    }

    try {
        await db.query(
            'INSERT INTO equipment (name, equipment_code, category, current_project_id, status, purchase_date) VALUES (?, ?, ?, ?, ?, ?)',
            [name, equipment_code, category, projectVal && !isNaN(projectVal) ? projectVal : null, status, purchase_date || null]
        );
        res.redirect('/equipment');
    } catch (err) {
        console.error('Create Equipment Error:', err);
        res.render('error', { message: 'Database Error: Failed to register equipment asset. Asset code may already exist.' });
    }
}

// Show Schedule Maintenance Form
async function showScheduleForm(req, res) {
    try {
        const rawEquipmentId = req.query.equipment_id;
        const [equipmentList] = await db.query('SELECT id, name, equipment_code, status FROM equipment ORDER BY name ASC');
        res.render('equipment/schedule_maintenance', { equipmentList, selectedEquipmentId: rawEquipmentId || '', title: 'Schedule Machinery Maintenance' });
    } catch (err) {
        console.error('Show Schedule Maintenance Form Error:', err);
        res.render('error', { message: 'Database Error: Could not load machinery list for maintenance schedule.' });
    }
}

// Schedule Maintenance (Raw SQL with Transaction & Validation)
async function scheduleMaintenance(req, res) {
    const equipment_id = parseInt(req.body.equipment_id, 10);
    const scheduled_date = req.body.scheduled_date;
    const maintenance_type = sanitize(req.body.maintenance_type) || 'Routine Check-up';
    const description = sanitize(req.body.description);
    const assigned_to = sanitize(req.body.assigned_to);
    const cost_estimate = req.body.cost_estimate;
    const notes = sanitize(req.body.notes);
    const created_by = req.session.user.id;

    // Validation
    if (isNaN(equipment_id)) {
        return res.render('error', { message: 'Validation Error: Please select an equipment asset to schedule.' });
    }
    if (!scheduled_date || !isValidDate(scheduled_date)) {
        return res.render('error', { message: 'Validation Error: A valid future maintenance schedule date is required.' });
    }
    if (!isRequired(description) || description.length < 3) {
        return res.render('error', { message: 'Validation Error: Please provide a description of the planned maintenance service.' });
    }
    if (cost_estimate && (!isPositiveNumber(cost_estimate) || parseFloat(cost_estimate) < 0)) {
        return res.render('error', { message: 'Validation Error: Estimated maintenance service cost cannot be negative.' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query(
            'INSERT INTO maintenance_schedules (equipment_id, scheduled_date, maintenance_type, description, assigned_to, cost_estimate, notes, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [equipment_id, scheduled_date, maintenance_type, description, assigned_to || null, parseFloat(cost_estimate || 0.00), notes || null, created_by]
        );
        if (maintenance_type === 'Repair' || maintenance_type === 'Overhaul') {
            await connection.query('UPDATE equipment SET status = ? WHERE id = ?', ['Under Maintenance', equipment_id]);
        }
        await connection.commit();
        res.redirect('/equipment');
    } catch (err) {
        await connection.rollback();
        console.error('Schedule Maintenance Transaction Error:', err);
        res.render('error', { message: 'Database Error: Could not schedule equipment maintenance. Changes were rolled back.' });
    } finally {
        connection.release();
    }
}

// Update Maintenance Status (Raw SQL with Transaction & Validation)
async function updateMaintenanceStatus(req, res) {
    const maintenanceId = parseInt(req.params.id, 10);
    const equipment_id = parseInt(req.body.equipment_id, 10);
    const { status } = req.body;
    const validStatuses = ['Scheduled', 'In Progress', 'Completed', 'Overdue'];

    if (isNaN(maintenanceId) || !validStatuses.includes(status)) {
        return res.render('error', { message: 'Validation Error: Invalid maintenance schedule ID or status.' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        let completedDateSql = status === 'Completed' ? new Date().toISOString().split('T')[0] : null;
        await connection.query('UPDATE maintenance_schedules SET status = ?, completed_date = ? WHERE id = ?', [status, completedDateSql, maintenanceId]);

        if (!isNaN(equipment_id)) {
            if (status === 'Completed') {
                await connection.query('UPDATE equipment SET status = ? WHERE id = ?', ['Operational', equipment_id]);
            } else if (status === 'In Progress') {
                await connection.query('UPDATE equipment SET status = ? WHERE id = ?', ['Under Maintenance', equipment_id]);
            }
        }
        await connection.commit();
        res.redirect('/equipment');
    } catch (err) {
        await connection.rollback();
        console.error('Update Maintenance Status Error:', err);
        res.render('error', { message: 'Database Error: Failed to update maintenance status. Transaction rolled back.' });
    } finally {
        connection.release();
    }
}

module.exports = {
    listEquipment,
    showCreateForm,
    createEquipment,
    showScheduleForm,
    scheduleMaintenance,
    updateMaintenanceStatus
};
