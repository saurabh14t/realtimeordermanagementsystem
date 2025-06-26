-- Insert sample orders using the create_order_with_items function
-- Run this after inserting products and customers

-- Get some product IDs first (you'll need to replace these with actual UUIDs from your products table)
-- You can get these by running: SELECT id, name, sku FROM products LIMIT 5;

-- Sample Order 1: Ravi Kumar
SELECT create_order_with_items(
    'Ravi Kumar',
    'ravi.kumar@gmail.com',
    '+91-9876543210',
    '{"street": "A-123, Sector 15, Noida", "city": "Noida", "state": "Uttar Pradesh", "zipCode": "201301", "country": "India"}',
    690.00,
    62.10,
    50.00,
    802.10,
    '[
        {"productId": "REPLACE_WITH_CHANA_DAL_ID", "name": "Chana Dal (1 kg)", "sku": "PULSE-CHANA-1KG", "quantity": 2, "price": 120.00, "total": 240.00},
        {"productId": "REPLACE_WITH_BASMATI_RICE_ID", "name": "Basmati Rice (5 kg)", "sku": "RICE-BASMATI-5KG", "quantity": 1, "price": 450.00, "total": 450.00}
    ]'::jsonb
);

-- Sample Order 2: Sunita Devi
SELECT create_order_with_items(
    'Sunita Devi',
    'sunita.devi@yahoo.com',
    '+91-9876543211',
    '{"street": "B-456, Koramangala, Bangalore", "city": "Bangalore", "state": "Karnataka", "zipCode": "560034", "country": "India"}',
    360.00,
    32.40,
    40.00,
    432.40,
    '[
        {"productId": "REPLACE_WITH_SUNFLOWER_OIL_ID", "name": "Sunflower Oil (1 Liter)", "sku": "OIL-SUNFLOWER-1L", "quantity": 2, "price": 180.00, "total": 360.00}
    ]'::jsonb
);

-- Sample Order 3: Anil Sharma
SELECT create_order_with_items(
    'Anil Sharma',
    'anil.sharma@hotmail.com',
    '+91-9876543212',
    '{"street": "C-789, Bandra West, Mumbai", "city": "Mumbai", "state": "Maharashtra", "zipCode": "400050", "country": "India"}',
    475.00,
    42.75,
    60.00,
    577.75,
    '[
        {"productId": "REPLACE_WITH_WHEAT_FLOUR_ID", "name": "Wheat Flour (5 kg)", "sku": "FLOUR-WHEAT-5KG", "quantity": 1, "price": 280.00, "total": 280.00},
        {"productId": "REPLACE_WITH_SUGAR_ID", "name": "Sugar (1 kg)", "sku": "SWEET-SUGAR-1KG", "quantity": 2, "price": 50.00, "total": 100.00},
        {"productId": "REPLACE_WITH_TEA_ID", "name": "Tea Leaves (250g)", "sku": "BEV-TEA-250G", "quantity": 1, "price": 95.00, "total": 95.00}
    ]'::jsonb
);
