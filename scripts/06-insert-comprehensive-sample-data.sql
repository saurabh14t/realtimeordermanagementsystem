-- Comprehensive sample data for Real-time Order Tracking System
-- Run this in Supabase SQL Editor after creating the schema

-- First, let's clear any existing data
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM inventory_movements;
DELETE FROM customers;
DELETE FROM products;

-- Insert comprehensive product catalog
INSERT INTO products (name, sku, description, price, cost, stock, low_stock_threshold, category, status, weight, dimensions) VALUES

-- Pulses & Lentils (High Volume Items)
('Chana Dal (1 kg)', 'PULSE-CHANA-1KG', 'Premium quality chana dal, split chickpea lentils, rich in protein', 120.00, 95.00, 150, 30, 'Pulses & Lentils', 'active', 1.0, '{"length": 20, "width": 15, "height": 5}'),
('Toor Dal (1 kg)', 'PULSE-TOOR-1KG', 'Fresh toor dal (pigeon pea), essential for daily cooking', 140.00, 115.00, 120, 25, 'Pulses & Lentils', 'active', 1.0, '{"length": 20, "width": 15, "height": 5}'),
('Moong Dal (1 kg)', 'PULSE-MOONG-1KG', 'Yellow moong dal, quick cooking and nutritious', 160.00, 135.00, 100, 20, 'Pulses & Lentils', 'active', 1.0, '{"length": 20, "width": 15, "height": 5}'),
('Masoor Dal (1 kg)', 'PULSE-MASOOR-1KG', 'Red lentils, cooks quickly and rich in protein', 130.00, 105.00, 90, 20, 'Pulses & Lentils', 'active', 1.0, '{"length": 20, "width": 15, "height": 5}'),
('Urad Dal (1 kg)', 'PULSE-URAD-1KG', 'Black gram lentils, perfect for South Indian dishes', 180.00, 150.00, 80, 18, 'Pulses & Lentils', 'active', 1.0, '{"length": 20, "width": 15, "height": 5}'),

-- Rice & Grains (Staple Items)
('Basmati Rice (5 kg)', 'RICE-BASMATI-5KG', 'Premium long grain basmati rice, aromatic and fluffy', 450.00, 380.00, 80, 15, 'Rice & Grains', 'active', 5.0, '{"length": 40, "width": 25, "height": 8}'),
('Regular Rice (5 kg)', 'RICE-REGULAR-5KG', 'Daily use rice, good quality and affordable', 280.00, 240.00, 120, 25, 'Rice & Grains', 'active', 5.0, '{"length": 40, "width": 25, "height": 8}'),
('Wheat Flour (5 kg)', 'FLOUR-WHEAT-5KG', 'Fresh wheat flour (atta) for making rotis and bread', 280.00, 240.00, 90, 20, 'Rice & Grains', 'active', 5.0, '{"length": 35, "width": 25, "height": 8}'),
('Poha (1 kg)', 'GRAIN-POHA-1KG', 'Flattened rice flakes, perfect for breakfast and snacks', 85.00, 65.00, 60, 15, 'Rice & Grains', 'active', 1.0, '{"length": 25, "width": 20, "height": 5}'),
('Semolina/Suji (1 kg)', 'GRAIN-SUJI-1KG', 'Fine semolina for making upma, halwa and other dishes', 75.00, 55.00, 70, 18, 'Rice & Grains', 'active', 1.0, '{"length": 22, "width": 18, "height": 5}'),

-- Cooking Oils (Essential Items)
('Sunflower Oil (1 Liter)', 'OIL-SUNFLOWER-1L', 'Pure sunflower cooking oil, heart healthy and light', 180.00, 155.00, 75, 15, 'Cooking Oils', 'active', 0.9, '{"length": 25, "width": 8, "height": 8}'),
('Mustard Oil (1 Liter)', 'OIL-MUSTARD-1L', 'Pure mustard oil, traditional cooking oil with strong flavor', 220.00, 190.00, 50, 12, 'Cooking Oils', 'active', 0.9, '{"length": 25, "width": 8, "height": 8}'),
('Coconut Oil (500ml)', 'OIL-COCONUT-500ML', 'Pure coconut oil, ideal for South Indian cooking', 250.00, 210.00, 40, 10, 'Cooking Oils', 'active', 0.45, '{"length": 20, "width": 6, "height": 6}'),
('Groundnut Oil (1 Liter)', 'OIL-GROUNDNUT-1L', 'Pure groundnut oil, excellent for deep frying', 200.00, 170.00, 45, 12, 'Cooking Oils', 'active', 0.9, '{"length": 25, "width": 8, "height": 8}'),

-- Spices & Condiments (High Turnover)
('Turmeric Powder (100g)', 'SPICE-TURMERIC-100G', 'Pure turmeric powder, essential spice for Indian cooking', 45.00, 32.00, 8, 50, 'Spices & Condiments', 'active', 0.1, '{"length": 12, "width": 8, "height": 3}'),
('Red Chili Powder (100g)', 'SPICE-CHILI-100G', 'Hot red chili powder, adds heat and flavor to dishes', 55.00, 40.00, 180, 45, 'Spices & Condiments', 'active', 0.1, '{"length": 12, "width": 8, "height": 3}'),
('Garam Masala (50g)', 'SPICE-GARAM-50G', 'Authentic garam masala blend, aromatic spice mix', 65.00, 45.00, 120, 30, 'Spices & Condiments', 'active', 0.05, '{"length": 10, "width": 6, "height": 3}'),
('Cumin Seeds (100g)', 'SPICE-CUMIN-100G', 'Whole cumin seeds, essential for tempering and spice blends', 80.00, 60.00, 150, 35, 'Spices & Condiments', 'active', 0.1, '{"length": 12, "width": 8, "height": 3}'),
('Coriander Powder (100g)', 'SPICE-CORIANDER-100G', 'Ground coriander seeds, mild and aromatic spice', 50.00, 35.00, 160, 40, 'Spices & Condiments', 'active', 0.1, '{"length": 12, "width": 8, "height": 3}'),

-- Tea & Beverages
('Tea Leaves (250g)', 'BEV-TEA-250G', 'Premium Assam tea leaves, strong and flavorful', 95.00, 75.00, 90, 20, 'Tea & Beverages', 'active', 0.25, '{"length": 15, "width": 10, "height": 5}'),
('Coffee Powder (200g)', 'BEV-COFFEE-200G', 'Filter coffee powder, South Indian style', 180.00, 145.00, 60, 15, 'Tea & Beverages', 'active', 0.2, '{"length": 14, "width": 9, "height": 4}'),

-- Sugar & Sweeteners
('Sugar (1 kg)', 'SWEET-SUGAR-1KG', 'Pure white sugar crystals for cooking and beverages', 50.00, 42.00, 150, 30, 'Sugar & Sweeteners', 'active', 1.0, '{"length": 20, "width": 15, "height": 5}'),
('Jaggery (500g)', 'SWEET-JAGGERY-500G', 'Pure jaggery (gur), natural sweetener rich in minerals', 70.00, 55.00, 80, 18, 'Sugar & Sweeteners', 'active', 0.5, '{"length": 15, "width": 12, "height": 4}'),

-- Salt & Seasonings
('Rock Salt (1 kg)', 'SEASON-SALT-1KG', 'Pure rock salt, natural and unrefined', 35.00, 25.00, 100, 25, 'Salt & Seasonings', 'active', 1.0, '{"length": 18, "width": 12, "height": 4}'),
('Black Pepper Powder (50g)', 'SEASON-PEPPER-50G', 'Freshly ground black pepper, adds heat and aroma', 120.00, 95.00, 80, 20, 'Salt & Seasonings', 'active', 0.05, '{"length": 10, "width": 6, "height": 3}');

-- Insert sample customers
INSERT INTO customers (name, email, phone, address, city, state, zip_code, country) VALUES
('Ravi Kumar', 'ravi.kumar@gmail.com', '+91-9876543210', 'A-123, Sector 15, Noida', 'Noida', 'Uttar Pradesh', '201301', 'India'),
('Sunita Devi', 'sunita.devi@yahoo.com', '+91-9876543211', 'B-456, Koramangala, Bangalore', 'Bangalore', 'Karnataka', '560034', 'India'),
('Anil Sharma', 'anil.sharma@hotmail.com', '+91-9876543212', 'C-789, Bandra West, Mumbai', 'Mumbai', 'Maharashtra', '400050', 'India'),
('Priya Patel', 'priya.patel@gmail.com', '+91-9876543213', 'D-321, Satellite, Ahmedabad', 'Ahmedabad', 'Gujarat', '380015', 'India'),
('Rajesh Singh', 'rajesh.singh@outlook.com', '+91-9876543214', 'E-654, Civil Lines, Delhi', 'Delhi', 'Delhi', '110054', 'India'),
('Meera Gupta', 'meera.gupta@gmail.com', '+91-9876543215', 'F-987, Jubilee Hills, Hyderabad', 'Hyderabad', 'Telangana', '500033', 'India'),
('Vikram Reddy', 'vikram.reddy@yahoo.com', '+91-9876543216', 'G-147, Anna Nagar, Chennai', 'Chennai', 'Tamil Nadu', '600040', 'India'),
('Kavita Joshi', 'kavita.joshi@gmail.com', '+91-9876543217', 'H-258, Shivaji Nagar, Pune', 'Pune', 'Maharashtra', '411005', 'India');

-- Now let's create orders using the create_order_with_items function
-- We need to get the actual product IDs first, so let's create a more complex script

-- Sample Order 1: Ravi Kumar - Large Family Order
DO $$
DECLARE
    order_id UUID;
    chana_dal_id UUID;
    basmati_rice_id UUID;
    sunflower_oil_id UUID;
    turmeric_id UUID;
BEGIN
    -- Get product IDs
    SELECT id INTO chana_dal_id FROM products WHERE sku = 'PULSE-CHANA-1KG';
    SELECT id INTO basmati_rice_id FROM products WHERE sku = 'RICE-BASMATI-5KG';
    SELECT id INTO sunflower_oil_id FROM products WHERE sku = 'OIL-SUNFLOWER-1L';
    SELECT id INTO turmeric_id FROM products WHERE sku = 'SPICE-TURMERIC-100G';
    
    -- Create order
    SELECT create_order_with_items(
        'Ravi Kumar',
        'ravi.kumar@gmail.com',
        '+91-9876543210',
        '{"street": "A-123, Sector 15, Noida", "city": "Noida", "state": "Uttar Pradesh", "zipCode": "201301", "country": "India"}',
        850.00,
        76.50,
        60.00,
        986.50,
        jsonb_build_array(
            jsonb_build_object('productId', chana_dal_id, 'name', 'Chana Dal (1 kg)', 'sku', 'PULSE-CHANA-1KG', 'quantity', 2, 'price', 120.00, 'total', 240.00),
            jsonb_build_object('productId', basmati_rice_id, 'name', 'Basmati Rice (5 kg)', 'sku', 'RICE-BASMATI-5KG', 'quantity', 1, 'price', 450.00, 'total', 450.00),
            jsonb_build_object('productId', sunflower_oil_id, 'name', 'Sunflower Oil (1 Liter)', 'sku', 'OIL-SUNFLOWER-1L', 'quantity', 1, 'price', 180.00, 'total', 180.00)
        )
    ) INTO order_id;
END $$;

-- Sample Order 2: Sunita Devi - Spices and Essentials
DO $$
DECLARE
    order_id UUID;
    turmeric_id UUID;
    chili_id UUID;
    tea_id UUID;
    sugar_id UUID;
BEGIN
    SELECT id INTO turmeric_id FROM products WHERE sku = 'SPICE-TURMERIC-100G';
    SELECT id INTO chili_id FROM products WHERE sku = 'SPICE-CHILI-100G';
    SELECT id INTO tea_id FROM products WHERE sku = 'BEV-TEA-250G';
    SELECT id INTO sugar_id FROM products WHERE sku = 'SWEET-SUGAR-1KG';
    
    SELECT create_order_with_items(
        'Sunita Devi',
        'sunita.devi@yahoo.com',
        '+91-9876543211',
        '{"street": "B-456, Koramangala, Bangalore", "city": "Bangalore", "state": "Karnataka", "zipCode": "560034", "country": "India"}',
        345.00,
        31.05,
        40.00,
        416.05,
        jsonb_build_array(
            jsonb_build_object('productId', turmeric_id, 'name', 'Turmeric Powder (100g)', 'sku', 'SPICE-TURMERIC-100G', 'quantity', 3, 'price', 45.00, 'total', 135.00),
            jsonb_build_object('productId', chili_id, 'name', 'Red Chili Powder (100g)', 'sku', 'SPICE-CHILI-100G', 'quantity', 2, 'price', 55.00, 'total', 110.00),
            jsonb_build_object('productId', tea_id, 'name', 'Tea Leaves (250g)', 'sku', 'BEV-TEA-250G', 'quantity', 1, 'price', 95.00, 'total', 95.00)
        )
    ) INTO order_id;
    
    -- Update this order to confirmed status
    UPDATE orders SET status = 'confirmed', fulfillment_status = 'picking' WHERE id = order_id;
END $$;

-- Sample Order 3: Anil Sharma - Mixed Grocery Order
DO $$
DECLARE
    order_id UUID;
    wheat_flour_id UUID;
    mustard_oil_id UUID;
    garam_masala_id UUID;
    jaggery_id UUID;
BEGIN
    SELECT id INTO wheat_flour_id FROM products WHERE sku = 'FLOUR-WHEAT-5KG';
    SELECT id INTO mustard_oil_id FROM products WHERE sku = 'OIL-MUSTARD-1L';
    SELECT id INTO garam_masala_id FROM products WHERE sku = 'SPICE-GARAM-50G';
    SELECT id INTO jaggery_id FROM products WHERE sku = 'SWEET-JAGGERY-500G';
    
    SELECT create_order_with_items(
        'Anil Sharma',
        'anil.sharma@hotmail.com',
        '+91-9876543212',
        '{"street": "C-789, Bandra West, Mumbai", "city": "Mumbai", "state": "Maharashtra", "zipCode": "400050", "country": "India"}',
        635.00,
        57.15,
        50.00,
        742.15,
        jsonb_build_array(
            jsonb_build_object('productId', wheat_flour_id, 'name', 'Wheat Flour (5 kg)', 'sku', 'FLOUR-WHEAT-5KG', 'quantity', 1, 'price', 280.00, 'total', 280.00),
            jsonb_build_object('productId', mustard_oil_id, 'name', 'Mustard Oil (1 Liter)', 'sku', 'OIL-MUSTARD-1L', 'quantity', 1, 'price', 220.00, 'total', 220.00),
            jsonb_build_object('productId', garam_masala_id, 'name', 'Garam Masala (50g)', 'sku', 'SPICE-GARAM-50G', 'quantity', 2, 'price', 65.00, 'total', 130.00)
        )
    ) INTO order_id;
    
    -- Update this order to processing status
    UPDATE orders SET status = 'processing', fulfillment_status = 'packing' WHERE id = order_id;
END $$;

-- Sample Order 4: Priya Patel - Dal and Rice Order
DO $$
DECLARE
    order_id UUID;
    toor_dal_id UUID;
    moong_dal_id UUID;
    regular_rice_id UUID;
    salt_id UUID;
BEGIN
    SELECT id INTO toor_dal_id FROM products WHERE sku = 'PULSE-TOOR-1KG';
    SELECT id INTO moong_dal_id FROM products WHERE sku = 'PULSE-MOONG-1KG';
    SELECT id INTO regular_rice_id FROM products WHERE sku = 'RICE-REGULAR-5KG';
    SELECT id INTO salt_id FROM products WHERE sku = 'SEASON-SALT-1KG';
    
    SELECT create_order_with_items(
        'Priya Patel',
        'priya.patel@gmail.com',
        '+91-9876543213',
        '{"street": "D-321, Satellite, Ahmedabad", "city": "Ahmedabad", "state": "Gujarat", "zipCode": "380015", "country": "India"}',
        715.00,
        64.35,
        55.00,
        834.35,
        jsonb_build_array(
            jsonb_build_object('productId', toor_dal_id, 'name', 'Toor Dal (1 kg)', 'sku', 'PULSE-TOOR-1KG', 'quantity', 2, 'price', 140.00, 'total', 280.00),
            jsonb_build_object('productId', moong_dal_id, 'name', 'Moong Dal (1 kg)', 'sku', 'PULSE-MOONG-1KG', 'quantity', 1, 'price', 160.00, 'total', 160.00),
            jsonb_build_object('productId', regular_rice_id, 'name', 'Regular Rice (5 kg)', 'sku', 'RICE-REGULAR-5KG', 'quantity', 1, 'price', 280.00, 'total', 280.00)
        )
    ) INTO order_id;
    
    -- Update this order to shipped status
    UPDATE orders SET 
        status = 'shipped', 
        fulfillment_status = 'shipped',
        tracking_number = 'TRK' || EXTRACT(EPOCH FROM NOW())::bigint || 'IN',
        shipping_date = NOW()
    WHERE id = order_id;
END $$;

-- Sample Order 5: Rajesh Singh - Cooking Essentials
DO $$
DECLARE
    order_id UUID;
    coconut_oil_id UUID;
    cumin_id UUID;
    coriander_id UUID;
    coffee_id UUID;
BEGIN
    SELECT id INTO coconut_oil_id FROM products WHERE sku = 'OIL-COCONUT-500ML';
    SELECT id INTO cumin_id FROM products WHERE sku = 'SPICE-CUMIN-100G';
    SELECT id INTO coriander_id FROM products WHERE sku = 'SPICE-CORIANDER-100G';
    SELECT id INTO coffee_id FROM products WHERE sku = 'BEV-COFFEE-200G';
    
    SELECT create_order_with_items(
        'Rajesh Singh',
        'rajesh.singh@outlook.com',
        '+91-9876543214',
        '{"street": "E-654, Civil Lines, Delhi", "city": "Delhi", "state": "Delhi", "zipCode": "110054", "country": "India"}',
        560.00,
        50.40,
        45.00,
        655.40,
        jsonb_build_array(
            jsonb_build_object('productId', coconut_oil_id, 'name', 'Coconut Oil (500ml)', 'sku', 'OIL-COCONUT-500ML', 'quantity', 1, 'price', 250.00, 'total', 250.00),
            jsonb_build_object('productId', cumin_id, 'name', 'Cumin Seeds (100g)', 'sku', 'SPICE-CUMIN-100G', 'quantity', 1, 'price', 80.00, 'total', 80.00),
            jsonb_build_object('productId', coriander_id, 'name', 'Coriander Powder (100g)', 'sku', 'SPICE-CORIANDER-100G', 'quantity', 1, 'price', 50.00, 'total', 50.00),
            jsonb_build_object('productId', coffee_id, 'name', 'Coffee Powder (200g)', 'sku', 'BEV-COFFEE-200G', 'quantity', 1, 'price', 180.00, 'total', 180.00)
        )
    ) INTO order_id;
    
    -- Update this order to delivered status
    UPDATE orders SET 
        status = 'delivered', 
        fulfillment_status = 'delivered',
        tracking_number = 'TRK' || EXTRACT(EPOCH FROM NOW())::bigint || 'DL'
    WHERE id = order_id;
END $$;

-- Sample Order 6: Recent Order - Meera Gupta
DO $$
DECLARE
    order_id UUID;
    poha_id UUID;
    pepper_id UUID;
    groundnut_oil_id UUID;
BEGIN
    SELECT id INTO poha_id FROM products WHERE sku = 'GRAIN-POHA-1KG';
    SELECT id INTO pepper_id FROM products WHERE sku = 'SEASON-PEPPER-50G';
    SELECT id INTO groundnut_oil_id FROM products WHERE sku = 'OIL-GROUNDNUT-1L';
    
    SELECT create_order_with_items(
        'Meera Gupta',
        'meera.gupta@gmail.com',
        '+91-9876543215',
        '{"street": "F-987, Jubilee Hills, Hyderabad", "city": "Hyderabad", "state": "Telangana", "zipCode": "500033", "country": "India"}',
        405.00,
        36.45,
        40.00,
        481.45,
        jsonb_build_array(
            jsonb_build_object('productId', poha_id, 'name', 'Poha (1 kg)', 'sku', 'GRAIN-POHA-1KG', 'quantity', 1, 'price', 85.00, 'total', 85.00),
            jsonb_build_object('productId', pepper_id, 'name', 'Black Pepper Powder (50g)', 'sku', 'SEASON-PEPPER-50G', 'quantity', 1, 'price', 120.00, 'total', 120.00),
            jsonb_build_object('productId', groundnut_oil_id, 'name', 'Groundnut Oil (1 Liter)', 'sku', 'OIL-GROUNDNUT-1L', 'quantity', 1, 'price', 200.00, 'total', 200.00)
        )
    ) INTO order_id;
END $$;

-- Add some inventory movements for demonstration
INSERT INTO inventory_movements (product_id, movement_type, quantity, reference_type, notes, created_by) 
SELECT 
    id,
    'in',
    50,
    'purchase',
    'Initial stock replenishment',
    'system'
FROM products 
WHERE stock < low_stock_threshold;

-- Update some timestamps to show recent activity
UPDATE orders SET created_at = NOW() - INTERVAL '2 hours' WHERE customer_email = 'meera.gupta@gmail.com';
UPDATE orders SET created_at = NOW() - INTERVAL '1 day' WHERE customer_email = 'rajesh.singh@outlook.com';
UPDATE orders SET created_at = NOW() - INTERVAL '2 days' WHERE customer_email = 'priya.patel@gmail.com';
UPDATE orders SET created_at = NOW() - INTERVAL '3 days' WHERE customer_email = 'anil.sharma@hotmail.com';
UPDATE orders SET created_at = NOW() - INTERVAL '4 days' WHERE customer_email = 'sunita.devi@yahoo.com';
UPDATE orders SET created_at = NOW() - INTERVAL '5 days' WHERE customer_email = 'ravi.kumar@gmail.com';
