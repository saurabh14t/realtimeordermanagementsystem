-- Setup script for office staples inventory
-- This initializes your organization with essential office supplies

-- Office Paper Products
INSERT INTO inventory (name, sku, description, price_inr, cost_inr, stock, low_stock_threshold, category, status) VALUES
('A4 Copy Paper (500 sheets)', 'PAPER-A4-500', 'High-quality white A4 copy paper, 80 GSM', 450.00, 280.00, 200, 50, 'Paper Products', 'active'),
('Sticky Notes (Pack of 12)', 'STICKY-3X3-12PK', '3x3 inch sticky notes, assorted colors', 240.00, 140.00, 180, 40, 'Paper Products', 'active'),
('Envelope Pack (100 pieces)', 'ENV-A4-100PK', 'White business envelopes, A4 size', 380.00, 230.00, 75, 20, 'Paper Products', 'active');

-- Writing Instruments
INSERT INTO inventory (name, sku, description, price_inr, cost_inr, stock, low_stock_threshold, category, status) VALUES
('Ballpoint Pens (Pack of 10)', 'PEN-BP-10PK', 'Blue ink ballpoint pens, smooth writing', 120.00, 75.00, 150, 30, 'Writing Instruments', 'active'),
('Whiteboard Markers (Set of 4)', 'MARKER-WB-4SET', 'Dry erase markers, assorted colors', 180.00, 110.00, 90, 20, 'Writing Instruments', 'active'),
('Correction Tape (Pack of 5)', 'CORR-TAPE-5PK', 'White correction tape, 5mm width', 200.00, 120.00, 100, 25, 'Writing Instruments', 'active');

-- Office Tools
INSERT INTO inventory (name, sku, description, price_inr, cost_inr, stock, low_stock_threshold, category, status) VALUES
('Stapler with Staples', 'STAPLER-STD-001', 'Standard desktop stapler with 1000 staples', 350.00, 200.00, 80, 20, 'Office Tools', 'active'),
('Calculator (12-digit)', 'CALC-12DIG-001', 'Desktop calculator with 12-digit display', 850.00, 520.00, 45, 10, 'Office Tools', 'active'),
('Desk Organizer Tray', 'ORGANIZER-DESK-001', 'Multi-compartment desk organizer', 680.00, 400.00, 35, 10, 'Office Tools', 'active'),
('Paper Clips (Box of 1000)', 'CLIP-PAPER-1000', 'Standard paper clips, 28mm, galvanized steel', 150.00, 90.00, 200, 50, 'Office Tools', 'active');

-- Filing Supplies
INSERT INTO inventory (name, sku, description, price_inr, cost_inr, stock, low_stock_threshold, category, status) VALUES
('File Folders (Pack of 25)', 'FOLDER-A4-25PK', 'Manila file folders, A4 size', 280.00, 160.00, 120, 25, 'Filing', 'active'),
('Ring Binder A4 (2 inch)', 'BINDER-A4-2IN', 'Heavy-duty ring binder, A4 size, 2-inch capacity', 320.00, 190.00, 60, 15, 'Filing', 'active');

-- Sample Customer Orders for Testing
INSERT INTO orders (customer_name, customer_email, customer_phone, items, total_inr, status, payment_status, created_at) VALUES
('Rajesh Kumar', 'rajesh.kumar@company.in', '+91-9876543210', 
 '[{"name":"A4 Copy Paper (500 sheets)","sku":"PAPER-A4-500","quantity":5,"price":450.00,"total":2250.00}]', 
 2250.00, 'pending', 'paid', NOW()),
 
('Priya Sharma', 'priya.sharma@office.co.in', '+91-9876543211', 
 '[{"name":"Ballpoint Pens (Pack of 10)","sku":"PEN-BP-10PK","quantity":3,"price":120.00,"total":360.00},{"name":"Stapler with Staples","sku":"STAPLER-STD-001","quantity":1,"price":350.00,"total":350.00}]', 
 710.00, 'confirmed', 'paid', NOW()),
 
('Amit Patel', 'amit.patel@enterprise.in', '+91-9876543212', 
 '[{"name":"File Folders (Pack of 25)","sku":"FOLDER-A4-25PK","quantity":2,"price":280.00,"total":560.00},{"name":"Calculator (12-digit)","sku":"CALC-12DIG-001","quantity":1,"price":850.00,"total":850.00}]', 
 1410.00, 'processing', 'paid', NOW());
