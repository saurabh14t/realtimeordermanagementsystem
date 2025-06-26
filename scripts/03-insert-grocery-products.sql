-- Insert grocery staples products into Supabase
-- Run this after creating tables and functions

-- Pulses & Lentils
INSERT INTO products (name, sku, description, price, cost, stock, low_stock_threshold, category, status, weight, dimensions) VALUES
('Chana Dal (1 kg)', 'PULSE-CHANA-1KG', 'Premium quality chana dal, split chickpea lentils, rich in protein', 120.00, 95.00, 150, 30, 'Pulses & Lentils', 'active', 1.0, '{"length": 20, "width": 15, "height": 5}'),
('Toor Dal (1 kg)', 'PULSE-TOOR-1KG', 'Fresh toor dal (pigeon pea), essential for daily cooking', 140.00, 115.00, 120, 25, 'Pulses & Lentils', 'active', 1.0, '{"length": 20, "width": 15, "height": 5}'),
('Moong Dal (1 kg)', 'PULSE-MOONG-1KG', 'Yellow moong dal, quick cooking and nutritious', 160.00, 135.00, 100, 20, 'Pulses & Lentils', 'active', 1.0, '{"length": 20, "width": 15, "height": 5}'),
('Masoor Dal (1 kg)', 'PULSE-MASOOR-1KG', 'Red lentils, cooks quickly and rich in protein', 130.00, 105.00, 90, 20, 'Pulses & Lentils', 'active', 1.0, '{"length": 20, "width": 15, "height": 5}');

-- Rice & Grains
INSERT INTO products (name, sku, description, price, cost, stock, low_stock_threshold, category, status, weight, dimensions) VALUES
('Basmati Rice (5 kg)', 'RICE-BASMATI-5KG', 'Premium long grain basmati rice, aromatic and fluffy', 450.00, 380.00, 80, 15, 'Rice & Grains', 'active', 5.0, '{"length": 40, "width": 25, "height": 8}'),
('Wheat Flour (5 kg)', 'FLOUR-WHEAT-5KG', 'Fresh wheat flour (atta) for making rotis and bread', 280.00, 240.00, 90, 20, 'Rice & Grains', 'active', 5.0, '{"length": 35, "width": 25, "height": 8}'),
('Poha (1 kg)', 'GRAIN-POHA-1KG', 'Flattened rice flakes, perfect for breakfast and snacks', 85.00, 65.00, 60, 15, 'Rice & Grains', 'active', 1.0, '{"length": 25, "width": 20, "height": 5}'),
('Semolina/Suji (1 kg)', 'GRAIN-SUJI-1KG', 'Fine semolina for making upma, halwa and other dishes', 75.00, 55.00, 70, 18, 'Rice & Grains', 'active', 1.0, '{"length": 22, "width": 18, "height": 5}');

-- Cooking Oils
INSERT INTO products (name, sku, description, price, cost, stock, low_stock_threshold, category, status, weight, dimensions) VALUES
('Sunflower Oil (1 Liter)', 'OIL-SUNFLOWER-1L', 'Pure sunflower cooking oil, heart healthy and light', 180.00, 155.00, 75, 15, 'Cooking Oils', 'active', 0.9, '{"length": 25, "width": 8, "height": 8}'),
('Mustard Oil (1 Liter)', 'OIL-MUSTARD-1L', 'Pure mustard oil, traditional cooking oil with strong flavor', 220.00, 190.00, 50, 12, 'Cooking Oils', 'active', 0.9, '{"length": 25, "width": 8, "height": 8}'),
('Coconut Oil (500ml)', 'OIL-COCONUT-500ML', 'Pure coconut oil, ideal for South Indian cooking', 250.00, 210.00, 40, 10, 'Cooking Oils', 'active', 0.45, '{"length": 20, "width": 6, "height": 6}');

-- Spices & Condiments
INSERT INTO products (name, sku, description, price, cost, stock, low_stock_threshold, category, status, weight, dimensions) VALUES
('Turmeric Powder (100g)', 'SPICE-TURMERIC-100G', 'Pure turmeric powder, essential spice for Indian cooking', 45.00, 32.00, 200, 50, 'Spices & Condiments', 'active', 0.1, '{"length": 12, "width": 8, "height": 3}'),
('Red Chili Powder (100g)', 'SPICE-CHILI-100G', 'Hot red chili powder, adds heat and flavor to dishes', 55.00, 40.00, 180, 45, 'Spices & Condiments', 'active', 0.1, '{"length": 12, "width": 8, "height": 3}'),
('Garam Masala (50g)', 'SPICE-GARAM-50G', 'Authentic garam masala blend, aromatic spice mix', 65.00, 45.00, 120, 30, 'Spices & Condiments', 'active', 0.05, '{"length": 10, "width": 6, "height": 3}'),
('Cumin Seeds (100g)', 'SPICE-CUMIN-100G', 'Whole cumin seeds, essential for tempering and spice blends', 80.00, 60.00, 150, 35, 'Spices & Condiments', 'active', 0.1, '{"length": 12, "width": 8, "height": 3}'),
('Coriander Powder (100g)', 'SPICE-CORIANDER-100G', 'Ground coriander seeds, mild and aromatic spice', 50.00, 35.00, 160, 40, 'Spices & Condiments', 'active', 0.1, '{"length": 12, "width": 8, "height": 3}');

-- Tea & Beverages
INSERT INTO products (name, sku, description, price, cost, stock, low_stock_threshold, category, status, weight, dimensions) VALUES
('Tea Leaves (250g)', 'BEV-TEA-250G', 'Premium Assam tea leaves, strong and flavorful', 95.00, 75.00, 90, 20, 'Tea & Beverages', 'active', 0.25, '{"length": 15, "width": 10, "height": 5}'),
('Coffee Powder (200g)', 'BEV-COFFEE-200G', 'Filter coffee powder, South Indian style', 180.00, 145.00, 60, 15, 'Tea & Beverages', 'active', 0.2, '{"length": 14, "width": 9, "height": 4}');

-- Sugar & Sweeteners
INSERT INTO products (name, sku, description, price, cost, stock, low_stock_threshold, category, status, weight, dimensions) VALUES
('Sugar (1 kg)', 'SWEET-SUGAR-1KG', 'Pure white sugar crystals for cooking and beverages', 50.00, 42.00, 150, 30, 'Sugar & Sweeteners', 'active', 1.0, '{"length": 20, "width": 15, "height": 5}'),
('Jaggery (500g)', 'SWEET-JAGGERY-500G', 'Pure jaggery (gur), natural sweetener rich in minerals', 70.00, 55.00, 80, 18, 'Sugar & Sweeteners', 'active', 0.5, '{"length": 15, "width": 12, "height": 4}');

-- Salt & Seasonings
INSERT INTO products (name, sku, description, price, cost, stock, low_stock_threshold, category, status, weight, dimensions) VALUES
('Rock Salt (1 kg)', 'SEASON-SALT-1KG', 'Pure rock salt, natural and unrefined', 35.00, 25.00, 100, 25, 'Salt & Seasonings', 'active', 1.0, '{"length": 18, "width": 12, "height": 4}'),
('Black Pepper Powder (50g)', 'SEASON-PEPPER-50G', 'Freshly ground black pepper, adds heat and aroma', 120.00, 95.00, 80, 20, 'Salt & Seasonings', 'active', 0.05, '{"length": 10, "width": 6, "height": 3}');
