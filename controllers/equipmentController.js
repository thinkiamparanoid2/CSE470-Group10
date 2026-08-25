const db = require('../config/db');

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
        console.error('Error loading equipment dashboard:', err);
        res.render('equipment/index', { title: 'Equipment Maintenance Scheduler', equipment: [], maintenance: [], user: req.session.user });
    }
}

// Show Create Equipment Form
async function showCreateForm(req, res) {
    try {
        const [projects] = await db.query('SELECT id, name FROM projects ORDER BY name ASC');
        res.render('equipment/create_equipment', { projects, title: 'Register New Heavy Machinery' });
    } catch (err) {
        console.error(err);
        res.redirect('/equipment');
    }
}

// Create Equipment (Raw SQL)
async function createEquipment(req, res) {
    const { name, equipment_code, category, current_project_id, status, purchase_date } = req.body;
    const projectVal = (current_project_id && current_project_id !== '') ? current_project_id : null;
    try {
        await db.query(
            'INSERT INTO equipment (name, equipment_code, category, current_project_id, status, purchase_date) VALUES (?, ?, ?, ?, ?, ?)',
            [name, equipment_code, category || 'Heavy Machinery', projectVal, status || 'Available', purchase_date || null]
        );
        res.redirect('/equipment');
    } catch (err) {
        console.error('Error creating equipment:', err);
        res.redirect('/equipment/create');
    }
}

// Show Schedule Maintenance Form
async function showScheduleForm(req, res) {
    try {
        const { equipment_id } = req.query;
        const [equipmentList] = await db.query('SELECT id, name, equipment_code, status FROM equipment ORDER BY name ASC');
        res.render('equipment/schedule_maintenance', { equipmentList, selectedEquipmentId: equipment_id || '', title: 'Schedule Machinery Maintenance' });
    } catch (err) {
        console.error(err);
        res.redirect('/equipment');
    }
}

// Schedule Maintenance (Raw SQL with Transaction)
async function scheduleMaintenance(req, res) {
    const { equipment_id, scheduled_date, maintenance_type, description, assigned_to, cost_estimate, notes } = req.body;
    const created_by = req.session.user.id;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query(
            'INSERT INTO maintenance_schedules (equipment_id, scheduled_date, maintenance_type, description, assigned_to, cost_estimate, notes, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [equipment_id, scheduled_date, maintenance_type || 'Routine Check-up', description, assigned_to, cost_estimate || 0.00, notes, created_by]
        );
        if (maintenance_type === 'Repair' || maintenance_type === 'Overhaul') {
            await connection.query('UPDATE equipment SET status = ? WHERE id = ?', ['Under Maintenance', equipment_id]);
        }
        await connection.commit();
        res.redirect('/equipment');
    } catch (err) {
        await connection.rollback();
        console.error('Error scheduling maintenance:', err);
        res.redirect('/equipment/schedule');
    } finally {
        connection.release();
    }
}

// Update Maintenance Status (Raw SQL with Transaction)
async function updateMaintenanceStatus(req, res) {
    const maintenanceId = req.params.id;
    const { status, equipment_id } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        let completedDateSql = status === 'Completed' ? new Date().toISOString().split('T')[0] : null;
        await connection.query('UPDATE maintenance_schedules SET status = ?, completed_date = ? WHERE id = ?', [status, completedDateSql, maintenanceId]);

        if (status === 'Completed') {
            await connection.query('UPDATE equipment SET status = ? WHERE id = ?', ['Operational', equipment_id]);
        } else if (status === 'In Progress') {
            await connection.query('UPDATE equipment SET status = ? WHERE id = ?', ['Under Maintenance', equipment_id]);
        }
        await connection.commit();
        res.redirect('/equipment');
    } catch (err) {
        await connection.rollback();
        console.error('Error updating maintenance status:', err);
        res.redirect('/equipment');
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
