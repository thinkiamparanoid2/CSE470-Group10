-- Database creation
CREATE DATABASE IF NOT EXISTS `smarstruction_db`;
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
    `status` ENUM('Requested', 'Approved', 'In Transit', 'Completed') DEFAULT 'Requested',
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

-- Sample Data Seeding
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Super Admin', 'admin@smarstruction.bd', '$2a$10$wT3G/VvO1o9.j.P3r7YVMeD9nC8p3/2N.dGZ3a3.F1/b6G9N0Wn1i', 'SuperAdmin'),
('Project Manager John', 'pm@smarstruction.bd', '$2a$10$wT3G/VvO1o9.j.P3r7YVMeD9nC8p3/2N.dGZ3a3.F1/b6G9N0Wn1i', 'Project Manager'),
('Site Eng. Rahat', 'engineer@smarstruction.bd', '$2a$10$wT3G/VvO1o9.j.P3r7YVMeD9nC8p3/2N.dGZ3a3.F1/b6G9N0Wn1i', 'Site Engineer'),
('BSRM Steels Ltd', 'vendor@bsrm.bd', '$2a$10$wT3G/VvO1o9.j.P3r7YVMeD9nC8p3/2N.dGZ3a3.F1/b6G9N0Wn1i', 'Vendor')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO `materials` (`name`, `category`, `unit`, `current_stock`, `reorder_level`, `unit_price_est`) VALUES
('Portland Cement', 'Cement', 'Bags', 500.00, 100.00, 560.00),
('Deformed Bar 60G (16mm Rod)', 'Steel/Rod', 'Tons', 45.50, 10.00, 98000.00),
('First Class Red Bricks', 'Bricks', 'Pcs', 25000.00, 5000.00, 12.50),
('Coarse Sand (Sylhet)', 'Sand', 'Cft', 1200.00, 300.00, 65.00)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO `vendors` (`company_name`, `contact_person`, `email`, `phone`, `material_category`, `rating`, `user_id`) VALUES
('BSRM Steels Bangladesh', 'Mr. Tanvir', 'sales@bsrm.bd', '+8801700000001', 'Steel/Rod', 4.90, 4),
('Seven Rings Cement', 'Mr. Karim', 'orders@sevenrings.bd', '+8801800000002', 'Cement', 4.70, NULL),
('Bengal Auto Bricks', 'Mr. Hafiz', 'info@bengalbricks.bd', '+8801900000003', 'Bricks', 4.50, NULL),
('Anwar Ispat', 'Mr. Rahim', 'sales@anwar.bd', '+8801700000005', 'Steel/Rod', 4.60, NULL),
('Crown Cement', 'Mr. Hasan', 'info@crowncement.bd', '+8801800000006', 'Cement', 4.80, NULL)
ON DUPLICATE KEY UPDATE user_id=VALUES(user_id);

INSERT INTO `projects` (`name`, `location`, `budget`, `status`, `start_date`, `target_completion_date`) VALUES
('Dhanmondi High-Rise Tower (15-Story)', 'Dhanmondi 27, Dhaka', 120000000.00, 'Ongoing', '2026-01-10', '2027-12-30'),
('Uttara Residential Villa Project', 'Sector 11, Uttara, Dhaka', 35000000.00, 'Ongoing', '2026-03-01', '2027-04-15')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO `vendor_quotations` (`vendor_id`, `material_id`, `price`) VALUES
(1, 2, 98000.00), -- BSRM for Rod
(4, 2, 96500.00), -- Anwar for Rod
(2, 1, 560.00),   -- Seven Rings for Cement
(5, 1, 550.00),   -- Crown for Cement
(3, 3, 12.50)     -- Bengal for Bricks
ON DUPLICATE KEY UPDATE id=id;
