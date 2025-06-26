-- Insert sample customers into Supabase
-- Run this after creating tables

INSERT INTO customers (name, email, phone, address, city, state, zip_code, country) VALUES
('Ravi Kumar', 'ravi.kumar@gmail.com', '+91-9876543210', 'A-123, Sector 15, Noida', 'Noida', 'Uttar Pradesh', '201301', 'India'),
('Sunita Devi', 'sunita.devi@yahoo.com', '+91-9876543211', 'B-456, Koramangala, Bangalore', 'Bangalore', 'Karnataka', '560034', 'India'),
('Anil Sharma', 'anil.sharma@hotmail.com', '+91-9876543212', 'C-789, Bandra West, Mumbai', 'Mumbai', 'Maharashtra', '400050', 'India'),
('Priya Patel', 'priya.patel@gmail.com', '+91-9876543213', 'D-321, Satellite, Ahmedabad', 'Ahmedabad', 'Gujarat', '380015', 'India'),
('Rajesh Singh', 'rajesh.singh@outlook.com', '+91-9876543214', 'E-654, Civil Lines, Delhi', 'Delhi', 'Delhi', '110054', 'India');
