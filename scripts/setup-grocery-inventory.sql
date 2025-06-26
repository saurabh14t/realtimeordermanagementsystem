-- Setup script for grocery staples inventory
-- This initializes your organization with essential grocery items

-- Clear existing data
DELETE FROM inventory;
DELETE FROM orders;

-- Pulses & Lentils
INSERT INTO inventory (name, sku, description, price_inr, cost_inr, stock, low_stock_threshold, category, status) VALUES
('Chana Dal (1 kg)', 'PULSE-CHANA-1KG', 'Premium quality chana dal, split chickpea lentils', 120.00, 95.00, 150, 30, 'Pulses & Lentils', 'active'),
('Toor Dal (1 kg)', 'PULSE-TOOR-1KG', 'Fresh toor dal (pigeon pea), essential for daily cooking', 140.00, 115.00, 120, 25, 'Pulses & Lentils', 'active'),
('Moong Dal (1 kg)', 'PULSE-MOONG-1KG', 'Yellow moong dal, quick cooking and nutritious', 160.00, 135.00, 100, 20, 'Pulses & Lentils', 'active');

-- Rice & Grains  
INSERT INTO inventory (name, sku, description, price_inr, cost_inr, stock, low_stock_threshold, category, status) VALUES
('Basmati Rice (5 kg)', 'RICE-BASMATI-5KG', 'Premium long grain basmati rice, aromatic and fluffy', 450.00, 380.00, 80, 15, 'Rice & Grains', 'active'),
('Wheat Flour (5 kg)', 'FLOUR-WHEAT-5KG', 'Fresh wheat flour (atta) for making rotis and bread', 280.00, 240.00, 90, 20, 'Rice & Grains', 'active'),
('Poha (1 kg)', 'GRAIN-POHA-1KG', 'Flattened rice flakes, perfect for breakfast and snacks', 85.00, 65.00, 60, 15, 'Rice & Grains', 'active');

-- Cooking Oils
INSERT INTO inventory (name, sku, description, price_inr, cost_inr, stock, low_stock_threshold, category, status) VALUES
('Sunflower Oil (1 Liter)', 'OIL-SUNFLOWER-1L', 'Pure sunflower cooking oil, heart healthy and light', 180.00, 155.00, 75, 15, 'Cooking Oils', 'active'),
('Mustard Oil (1 Liter)', 'OIL-MUSTARD-1L', 'Pure mustard oil, traditional cooking oil', 220.00, 190.00, 50, 12, 'Cooking Oils', 'active');

-- Spices & Condiments
INSERT INTO inventory (name, sku, description, price_inr, cost_inr, stock, low_stock_threshold, category, status) VALUES
('Turmeric Powder (100g)', 'SPICE-TURMERIC-100G', 'Pure turmeric powder, essential spice for Indian cooking', 45.00, 32.00, 200, 50, 'Spices & Condiments', 'active'),
('Red Chili Powder (100g)', 'SPICE-CHILI-100G', 'Hot red chili powder, adds heat and flavor', 55.00, 40.00, 180, 45, 'Spices & Condiments', 'active'),
('Garam Masala (50g)', 'SPICE-GARAM-50G', 'Authentic garam masala blend, aromatic spice mix', 65.00, 45.00, 120, 30, 'Spices & Condiments', 'active');

-- Tea & Beverages
INSERT INTO inventory (name, sku, description, price_inr, cost_inr, stock, low_stock_threshold, category, status) VALUES
('Tea Leaves (250g)', 'BEV-TEA-250G', 'Premium Assam tea leaves, strong and flavorful', 95.00, 75.00, 90, 20, 'Tea & Beverages', 'active');

-- Sugar & Sweeteners
INSERT INTO inventory (name, sku, description, price_inr, cost_inr, stock, low_stock_threshold, category, status) VALUES
('Sugar (1 kg)', 'SWEET-SUGAR-1KG', 'Pure white sugar crystals for cooking and beverages', 50.00, 42.00, 150, 30, 'Sugar & Sweeteners', 'active'),
('Jaggery (500g)', 'SWEET-JAGGERY-500G', 'Pure jaggery (gur), natural sweetener rich in minerals', 70.00, 55.00, 80, 18, 'Sugar & Sweeteners', 'active');

-- Salt & Seasonings
INSERT INTO inventory (name, sku, description, price_inr, cost_inr, stock, low_stock_threshold, category, status) VALUES
('Rock Salt (1 kg)', 'SEASON-SALT-1KG', 'Pure rock salt, natural and unrefined', 35.00, 25.00, 100, 25, 'Salt & Seasonings', 'active');

-- Sample Customer Orders with Grocery Items
INSERT INTO orders (customer_name, customer_email, customer_phone, items, total_inr, status, payment_status, created_at) VALUES
('Ravi Kumar', 'ravi.kumar@gmail.com', '+91-9876543210', 
 '[{"name":"Chana Dal (1 kg)","sku":"PULSE-CHANA-1KG","quantity":2,"price":120.00,"total":240.00},{"name":"Basmati Rice (5 kg)","sku":"RICE-BASMATI-5KG","quantity":1,"price":450.00,"total":450.00}]', 
 690.00, 'pending', 'paid', NOW()),
 
('Sunita Devi', 'sunita.devi@yahoo.com', '+91-9876543211', 
 '[{"name":"Turmeric Powder (100g)","sku":"SPICE-TURMERIC-100G","quantity":3,"price":45.00,"total":135.00},{"name":"Sunflower Oil (1 Liter)","sku":"OIL-SUNFLOWER-1L","quantity":2,"price":180.00,"total":360.00}]', 
 495.00, 'confirmed', 'paid', NOW()),
 
('Anil Sharma', 'anil.sharma@hotmail.com', '+91-9876543212', 
 '[{"name":"Wheat Flour (5 kg)","sku":"FLOUR-WHEAT-5KG","quantity":1,"price":280.00,"total":280.00},{"name":"Sugar (1 kg)","sku":"SWEET-SUGAR-1KG","quantity":2,"price":50.00,"total":100.00},{"name":"Tea Leaves (250g)","sku":"BEV-TEA-250G","quantity":1,"price":95.00,"total":95.00}]', 
 475.00, 'processing', 'paid', NOW());
