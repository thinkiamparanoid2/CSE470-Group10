-- Database creation
DROP DATABASE IF EXISTS `smarstruction_db`;
CREATE DATABASE `smarstruction_db`;
USE `smarstruction_db`;

-- Member D: Users & Role-Based Access Control (RBAC)
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('SuperAdmin', 'Project Manager', 'Site Engineer', 'Vendor') NOT NULL DEFAULT 'Site Engineer',
    `phone` VARCHAR(20),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Member D: Notice / Announcement Board & CMS content
CREATE TABLE IF NOT EXISTS `notices` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `priority` ENUM('Normal', 'High', 'Emergency') DEFAULT 'Normal',
    `created_by` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Member A: Material Stock Tracking
CREATE TABLE IF NOT EXISTS `materials` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL, -- e.g., Cement (Bags), Rod 500W (Tons), Bricks (Pcs)
    `category` VARCHAR(50) DEFAULT 'General',
    `unit` VARCHAR(20) NOT NULL,
    `current_stock` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `reorder_level` DECIMAL(10, 2) NOT NULL DEFAULT 10.00,
    `unit_price_est` DECIMAL(10, 2) DEFAULT 0.00,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Member B: Vendor Directory & Rating
CREATE TABLE IF NOT EXISTS `vendors` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `company_name` VARCHAR(150) NOT NULL,
    `contact_person` VARCHAR(100),
    `email` VARCHAR(100),
    `phone` VARCHAR(20) NOT NULL,
    `address` TEXT,
    `material_category` VARCHAR(100), -- e.g., Rod Supplier, Cement Dealer
    `rating` DECIMAL(3, 2) DEFAULT 5.00,
    `user_id` INT UNIQUE, -- Link to user account if vendor logs in
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Member C: Projects & Milestone Tracker
CREATE TABLE IF NOT EXISTS `projects` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `location` VARCHAR(255),
    `budget` DECIMAL(15, 2) DEFAULT 0.00,
    `status` ENUM('Planning', 'Ongoing', 'Completed', 'On Hold') DEFAULT 'Ongoing',
    `start_date` DATE,
    `target_completion_date` DATE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `milestones` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT,
    `status` ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    `due_date` DATE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
);

-- Sprint 2: Purchase Order System (Member A)
CREATE TABLE IF NOT EXISTS `purchase_orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `vendor_id` INT NOT NULL,
    `status` ENUM('Pending', 'Approved', 'Shipped', 'Delivered') DEFAULT 'Pending',
    `total_amount` DECIMAL(15, 2) DEFAULT 0.00,
    `expected_date` DATE,
    `created_by` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `purchase_order_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `po_id` INT NOT NULL,
    `material_id` INT NOT NULL,
    `quantity` DECIMAL(10, 2) NOT NULL,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (`po_id`) REFERENCES `purchase_orders`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`material_id`) REFERENCES `materials`(`id`) ON DELETE CASCADE
);

-- Sprint 2: Delivery Scheduling (Member B)
CREATE TABLE IF NOT EXISTS `deliveries` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `po_id` INT NOT NULL,
    `status` ENUM('Pending', 'In Transit', 'Delivered') DEFAULT 'Pending',
    `delivery_date` DATE,
    `received_by` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`po_id`) REFERENCES `purchase_orders`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`received_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Sprint 2: Labor Attendance & Cost Log (Member C)
CREATE TABLE IF NOT EXISTS `labor_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `log_date` DATE NOT NULL,
    `headcount` INT NOT NULL DEFAULT 0,
    `total_cost` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `notes` TEXT,
    `created_by` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Sprint 2: Site-wise Inventory Transfer (Member A)
CREATE TABLE IF NOT EXISTS `inventory_transfers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `material_id` INT NOT NULL,
    `from_project_id` INT NOT NULL,
    `to_project_id` INT NOT NULL,
    `quantity` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('Requested', 'Approved', 'In Transit', 'Completed', 'Rejected') DEFAULT 'Requested',
    `created_by` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`material_id`) REFERENCES `materials`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`from_project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`to_project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Sprint 3: Price Comparison Engine (Member B)
CREATE TABLE IF NOT EXISTS `vendor_quotations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `vendor_id` INT NOT NULL,
    `material_id` INT NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`material_id`) REFERENCES `materials`(`id`) ON DELETE CASCADE
);

-- Sprint 3: Emergency Material Request (Member D)
CREATE TABLE IF NOT EXISTS `material_requests` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `material_id` INT NOT NULL,
    `quantity` DECIMAL(10, 2) NOT NULL,
    `priority` ENUM('Normal', 'High', 'Emergency') DEFAULT 'Normal',
    `status` ENUM('Pending', 'Approved', 'Fulfilled', 'Rejected') DEFAULT 'Pending',
    `requested_by` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`material_id`) REFERENCES `materials`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`requested_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Sprint 3: Material Waste Log (Member A)
CREATE TABLE IF NOT EXISTS `material_waste_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `material_id` INT NOT NULL,
    `waste_quantity` DECIMAL(10, 2) NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `logged_by` INT,
    `log_date` DATE NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`material_id`) REFERENCES `materials`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`logged_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Sprint 3: Contract Document Upload (Member B)
CREATE TABLE IF NOT EXISTS `vendor_contracts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `vendor_id` INT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `uploaded_by` INT,
    `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Sprint 4: Bill of Quantities (BOQ) Generator (Member A)
CREATE TABLE IF NOT EXISTS `boqs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `notes` TEXT,
    `created_by` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `boq_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `boq_id` INT NOT NULL,
    `material_name` VARCHAR(150) NOT NULL,
    `unit` VARCHAR(20) NOT NULL,
    `quantity_estimated` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `unit_price_estimated` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `item_category` VARCHAR(100) DEFAULT 'Material',
    FOREIGN KEY (`boq_id`) REFERENCES `boqs`(`id`) ON DELETE CASCADE
);

-- Sprint 4: Vendor Payment Tracker (Member B)
CREATE TABLE IF NOT EXISTS `vendor_payments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `vendor_id` INT NOT NULL,
    `po_id` INT DEFAULT NULL,
    `amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `payment_type` ENUM('Advance', 'Milestone Payment', 'Final Clearance', 'Refund') DEFAULT 'Advance',
    `payment_method` ENUM('Bank Transfer', 'Cheque', 'Cash') DEFAULT 'Bank Transfer',
    `reference_no` VARCHAR(100),
    `payment_date` DATE NOT NULL,
    `notes` TEXT,
    `recorded_by` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`po_id`) REFERENCES `purchase_orders`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`recorded_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Sprint 4: Daily Site Report (Member C)
CREATE TABLE IF NOT EXISTS `daily_site_reports` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `report_date` DATE NOT NULL,
    `weather_condition` VARCHAR(100) DEFAULT 'Sunny & Clear',
    `general_progress` TEXT,
    `safety_incidents` TEXT,
    `site_engineer_id` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`site_engineer_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Sprint 4: Equipment Maintenance Scheduler (Member D)
CREATE TABLE IF NOT EXISTS `equipment` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `equipment_code` VARCHAR(50) NOT NULL UNIQUE,
    `category` VARCHAR(100) DEFAULT 'Heavy Machinery',
    `current_project_id` INT DEFAULT NULL,
    `status` ENUM('Operational', 'Under Maintenance', 'Out of Service', 'Available', 'In Use', 'Decommissioned') DEFAULT 'Available',
    `purchase_date` DATE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`current_project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `maintenance_schedules` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `equipment_id` INT NOT NULL,
    `scheduled_date` DATE NOT NULL,
    `maintenance_type` ENUM('Routine Check-up', 'Preventive Maintenance', 'Repair', 'Overhaul') DEFAULT 'Routine Check-up',
    `description` TEXT NOT NULL,
    `assigned_to` VARCHAR(150),
    `status` ENUM('Scheduled', 'In Progress', 'Completed', 'Overdue') DEFAULT 'Scheduled',
    `cost_estimate` DECIMAL(12, 2) DEFAULT 0.00,
    `completed_date` DATE DEFAULT NULL,
    `notes` TEXT,
    `created_by` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Sample Data Seeding
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Super Admin', 'admin@smarstruction.bd', '$2a$10$gifD7bp.pEYzKSasAhJ4j.h21nIeZ1orsrhVzu0uUdMITtwabRteu', 'SuperAdmin'),
(2, 'Project Manager John', 'pm@smarstruction.bd', '$2a$10$gifD7bp.pEYzKSasAhJ4j.h21nIeZ1orsrhVzu0uUdMITtwabRteu', 'Project Manager'),
(3, 'Site Eng. Rahat', 'engineer@smarstruction.bd', '$2a$10$gifD7bp.pEYzKSasAhJ4j.h21nIeZ1orsrhVzu0uUdMITtwabRteu', 'Site Engineer'),
(4, 'BSRM Steels Ltd', 'vendor@bsrm.bd', '$2a$10$gifD7bp.pEYzKSasAhJ4j.h21nIeZ1orsrhVzu0uUdMITtwabRteu', 'Vendor')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO `materials` (`id`, `name`, `category`, `unit`, `current_stock`, `reorder_level`, `unit_price_est`) VALUES
(1, 'Portland Cement', 'Cement', 'Bags', 500.00, 100.00, 560.00),
(2, 'Deformed Bar 60G (16mm Rod)', 'Steel/Rod', 'Tons', 45.50, 10.00, 98000.00),
(3, 'First Class Red Bricks', 'Bricks', 'Pcs', 25000.00, 5000.00, 12.50),
(4, 'Coarse Sand (Sylhet)', 'Sand', 'Cft', 1200.00, 300.00, 65.00)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO `vendors` (`id`, `company_name`, `contact_person`, `email`, `phone`, `material_category`, `rating`, `user_id`) VALUES
(1, 'BSRM Steels Bangladesh', 'Mr. Tanvir', 'sales@bsrm.bd', '+8801700000001', 'Steel/Rod', 4.90, 4),
(2, 'Seven Rings Cement', 'Mr. Karim', 'orders@sevenrings.bd', '+8801800000002', 'Cement', 4.70, NULL),
(3, 'Bengal Auto Bricks', 'Mr. Hafiz', 'info@bengalbricks.bd', '+8801900000003', 'Bricks', 4.50, NULL),
(4, 'Anwar Ispat', 'Mr. Rahim', 'sales@anwar.bd', '+8801700000005', 'Steel/Rod', 4.60, NULL),
(5, 'Crown Cement', 'Mr. Hasan', 'info@crowncement.bd', '+8801800000006', 'Cement', 4.80, NULL)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO `projects` (`id`, `name`, `location`, `budget`, `status`, `start_date`, `target_completion_date`) VALUES
(1, 'Dhanmondi High-Rise Tower (15-Story)', 'Dhanmondi 27, Dhaka', 120000000.00, 'Ongoing', '2026-01-10', '2027-12-30'),
(2, 'Uttara Residential Villa Project', 'Sector 11, Uttara, Dhaka', 35000000.00, 'Ongoing', '2026-03-01', '2027-04-15')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO `milestones` (`id`, `project_id`, `title`, `due_date`, `status`, `description`) VALUES
(1, 1, 'Soil Excavation & Foundation Piling', '2026-03-30', 'Completed', 'Deep foundation bore piling completed.'),
(2, 1, 'Basement 1 & 2 RCC Casting', '2026-06-15', 'Completed', 'Basement walls and slab casting done.'),
(3, 1, 'Superstructure Floors 1 to 5', '2026-11-30', 'In Progress', 'Column casting active on 3rd floor.'),
(4, 1, 'Interior Electrical & Plumbing', '2027-08-15', 'Pending', 'Concealed wiring and piping installation.'),
(5, 2, 'Boundary Wall & Site Leveling', '2026-04-10', 'Completed', 'Perimeter secured and leveled.'),
(6, 2, 'Ground Floor Brick Masonry', '2026-07-20', 'Completed', 'First class red brick walls completed.'),
(7, 2, 'First Floor Slab Casting', '2026-08-15', 'Completed', 'Roof slab casting cured and inspected.'),
(8, 2, 'Interior Paint & Finishing', '2026-12-01', 'In Progress', 'Plastering and primer coating underway.')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO `vendor_quotations` (`vendor_id`, `material_id`, `price`) VALUES
(1, 2, 98000.00), -- BSRM for Rod
(4, 2, 96500.00), -- Anwar for Rod
(2, 1, 560.00),   -- Seven Rings for Cement
(5, 1, 550.00),   -- Crown for Cement
(3, 3, 12.50)     -- Bengal for Bricks
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO `purchase_orders` (`id`, `vendor_id`, `status`, `total_amount`, `expected_date`, `created_by`) VALUES
(1, 1, 'Approved', 4900000.00, '2026-08-15', 2), -- BSRM Steels (50 Tons Rod)
(2, 2, 'Delivered', 1120000.00, '2026-07-25', 2), -- Seven Rings Cement (2000 Bags)
(3, 3, 'Approved', 625000.00, '2026-08-20', 2),  -- Bengal Auto Bricks (50000 Pcs)
(4, 4, 'Shipped', 2895000.00, '2026-08-10', 2),   -- Anwar Ispat (30 Tons Rod)
(5, 5, 'Approved', 550000.00, '2026-08-18', 2)    -- Crown Cement (1000 Bags)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO `purchase_order_items` (`id`, `po_id`, `material_id`, `quantity`, `unit_price`) VALUES
(1, 1, 2, 50.00, 98000.00),
(2, 2, 1, 2000.00, 560.00),
(3, 3, 3, 50000.00, 12.50),
(4, 4, 2, 30.00, 96500.00),
(5, 5, 1, 1000.00, 550.00)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO `boqs` (`id`, `project_id`, `title`, `notes`, `created_by`) VALUES
(1, 1, 'Dhanmondi Tower Phase 1 - Foundation & Superstructure BOQ', 'Comprehensive forecast of rod, cement, and concrete piles needed for underground and first 5 floors.', 2),
(2, 2, 'Uttara Villa Primary Materials BOQ', 'Estimated baseline requirement for residential brick work and finishing.', 2)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO `boq_items` (`id`, `boq_id`, `material_name`, `unit`, `quantity_estimated`, `unit_price_estimated`, `item_category`) VALUES
(1, 1, 'Deformed Bar 60G (16mm Rod)', 'Tons', 50.00, 98000.00, 'Steel/Rod'),
(2, 1, 'Portland Cement', 'Bags', 2000.00, 560.00, 'Cement'),
(3, 1, 'Coarse Sand (Sylhet)', 'Cft', 5000.00, 65.00, 'Sand'),
(4, 2, 'First Class Red Bricks', 'Pcs', 45000.00, 12.50, 'Bricks'),
(5, 2, 'Portland Cement', 'Bags', 600.00, 560.00, 'Cement')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO `vendor_payments` (`id`, `vendor_id`, `po_id`, `amount`, `payment_type`, `payment_method`, `reference_no`, `payment_date`, `notes`, `recorded_by`) VALUES
(1, 1, NULL, 1500000.00, 'Advance', 'Bank Transfer', 'TXN-8849302', '2026-07-15', 'Initial supplier advance payment against annual supply contract.', 2),
(2, 2, NULL, 350000.00, 'Milestone Payment', 'Cheque', 'CHQ-559201', '2026-07-20', 'Payment against July cement shipment batches.', 2)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO `labor_logs` (`id`, `project_id`, `log_date`, `headcount`, `total_cost`, `notes`, `created_by`) VALUES
(1, 1, CURDATE(), 65, 52000.00, 'Foundation RCC casting team & iron rod binding crew working on 1st basement level. High productivity recorded.', 3),
(2, 1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 50, 40000.00, 'Excavation and soil grading labor workforce completed trench alignments.', 3),
(3, 2, CURDATE(), 28, 22400.00, 'Masonry brickwork and plastering team active on Ground & 1st floor villa perimeter wall.', 3)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO `inventory_transfers` (`id`, `material_id`, `from_project_id`, `to_project_id`, `quantity`, `status`, `created_by`, `created_at`) VALUES
(1, 2, 2, 1, 10.00, 'Completed', 2, NOW()),
(2, 1, 1, 2, 200.00, 'Completed', 2, NOW())
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO `daily_site_reports` (`id`, `project_id`, `report_date`, `weather_condition`, `general_progress`, `safety_incidents`, `site_engineer_id`) VALUES
(1, 1, '2026-08-01', 'Sunny (32°C)', 'Completed foundation piling inspection and cast 4 central columns on Ground Floor. Material cranes operating smoothly.', 'None. Zero harm reported on site.', 3),
(2, 2, '2026-08-01', 'Light Rain in evening', 'Brick foundation leveling completed on east boundary wall. Sand shipments sorted.', 'Minor slip hazard near gate due to rain; sand spread immediately.', 3)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO `equipment` (`id`, `name`, `equipment_code`, `category`, `current_project_id`, `status`, `purchase_date`) VALUES
(1, 'LIEBHERR Tower Crane 150T', 'CRN-01', 'Cranes', 1, 'Operational', '2024-05-12'),
(2, 'Caterpillar Heavy Concrete Mixer', 'MIX-04', 'Mixers', 1, 'Operational', '2025-01-20'),
(3, 'Perkins 150 kVA Diesel Generator', 'GEN-02', 'Power Generators', 2, 'Under Maintenance', '2023-11-05'),
(4, 'Komatsu Excavator PC200', 'EXC-01', 'Heavy Machinery', 2, 'Available', '2024-08-15')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO `maintenance_schedules` (`id`, `equipment_id`, `scheduled_date`, `maintenance_type`, `description`, `assigned_to`, `status`, `cost_estimate`, `completed_date`, `notes`, `created_by`) VALUES
(1, 1, '2026-08-10', 'Routine Check-up', 'Check hydraulic pressure, tension cables, and brakes before upper story crane lifts.', 'Mech. Engr. Shafiq', 'Scheduled', 25000.00, NULL, 'Urgent checklist per safety protocols.', 1),
(2, 3, '2026-08-02', 'Repair', 'Replace oil filters and repair alternator loop after voltage drop reported.', 'PowerTech Services BD', 'In Progress', 45000.00, NULL, 'Parts ordered from vendor, waiting installation.', 1)
ON DUPLICATE KEY UPDATE id=id;
