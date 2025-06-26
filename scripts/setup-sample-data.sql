-- This script sets up sample data for the organization
-- Run this to populate your Redis database with initial products and test orders

-- Sample Products Data
-- These will be inserted via the API endpoints

-- Electronics Category
INSERT INTO products (name, sku, description, price, cost, stock, category, status) VALUES
('Professional Wireless Headphones', 'WH-PRO-001', 'High-quality noise-canceling wireless headphones for professionals', 299.99, 150.00, 50, 'Electronics', 'active'),
('Smart Fitness Watch', 'SW-FIT-002', 'Advanced fitness tracking with heart rate monitor and GPS', 399.99, 200.00, 25, 'Electronics', 'active'),
('Ergonomic Laptop Stand', 'LS-ERG-003', 'Adjustable aluminum laptop stand for better ergonomics', 89.99, 45.00, 75, 'Office', 'active'),
('USB-C Multi-Port Hub', 'UCH-MP-004', '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card slots', 129.99, 65.00, 40, 'Electronics', 'active');

-- Office Supplies Category
INSERT INTO products (name, sku, description, price, cost, stock, category, status) VALUES
('Premium Desk Organizer', 'DO-PREM-005', 'Bamboo desk organizer with multiple compartments', 49.99, 25.00, 60, 'Office', 'active'),
('Wireless Charging Pad', 'WCP-QI-006', 'Fast wireless charging pad compatible with all Qi devices', 39.99, 20.00, 80, 'Electronics', 'active'),
('Blue Light Blocking Glasses', 'BLG-COMP-007', 'Computer glasses to reduce eye strain and improve sleep', 59.99, 30.00, 35, 'Health', 'active'),
('Portable Phone Stand', 'PPS-ADJ-008', 'Adjustable phone stand for desk and travel use', 24.99, 12.00, 100, 'Office', 'active');

-- Sample Customer Data
INSERT INTO customers (name, email, phone, address) VALUES
('John Smith', 'john.smith@company.com', '+1-555-0101', '123 Business Ave, Suite 100, New York, NY 10001'),
('Sarah Johnson', 'sarah.j@enterprise.com', '+1-555-0102', '456 Corporate Blvd, Floor 5, Los Angeles, CA 90210'),
('Michael Brown', 'mbrown@organization.org', '+1-555-0103', '789 Office Park Dr, Building A, Chicago, IL 60601'),
('Emily Davis', 'emily.davis@company.net', '+1-555-0104', '321 Business Center, Suite 200, Houston, TX 77001');
