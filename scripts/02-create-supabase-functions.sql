-- Create database functions for better performance
-- Run this in Supabase SQL Editor after creating tables

-- Function to update product stock
CREATE OR REPLACE FUNCTION update_product_stock(product_id UUID, quantity_change INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE products 
    SET stock = stock + quantity_change,
        updated_at = NOW()
    WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get low stock products
CREATE OR REPLACE FUNCTION get_low_stock_products()
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    sku VARCHAR(100),
    stock INTEGER,
    low_stock_threshold INTEGER,
    category VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.name, p.sku, p.stock, p.low_stock_threshold, p.category
    FROM products p
    WHERE p.stock <= p.low_stock_threshold
    AND p.status = 'active'
    ORDER BY p.category, p.name;
END;
$$ LANGUAGE plpgsql;

-- Function to get order statistics
CREATE OR REPLACE FUNCTION get_order_stats()
RETURNS TABLE (
    total_orders BIGINT,
    pending_orders BIGINT,
    processing_orders BIGINT,
    shipped_orders BIGINT,
    total_revenue DECIMAL(12,2),
    today_orders BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
        COUNT(*) FILTER (WHERE status = 'processing') as processing_orders,
        COUNT(*) FILTER (WHERE status = 'shipped') as shipped_orders,
        COALESCE(SUM(total), 0) as total_revenue,
        COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as today_orders
    FROM orders;
END;
$$ LANGUAGE plpgsql;

-- Function to create order with items
CREATE OR REPLACE FUNCTION create_order_with_items(
    p_customer_name VARCHAR(255),
    p_customer_email VARCHAR(255),
    p_customer_phone VARCHAR(20),
    p_shipping_address JSONB,
    p_subtotal DECIMAL(10,2),
    p_tax DECIMAL(10,2),
    p_shipping DECIMAL(10,2),
    p_total DECIMAL(10,2),
    p_items JSONB
)
RETURNS UUID AS $$
DECLARE
    order_id UUID;
    item JSONB;
BEGIN
    -- Generate order number
    INSERT INTO orders (
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        subtotal,
        tax,
        shipping,
        total,
        status,
        payment_status,
        fulfillment_status,
        estimated_delivery
    ) VALUES (
        'ORD-' || EXTRACT(EPOCH FROM NOW())::bigint || '-' || LPAD(FLOOR(RANDOM() * 1000)::text, 3, '0'),
        p_customer_name,
        p_customer_email,
        p_customer_phone,
        p_shipping_address,
        p_subtotal,
        p_tax,
        p_shipping,
        p_total,
        'pending',
        'paid',
        'pending',
        NOW() + INTERVAL '3 days'
    ) RETURNING id INTO order_id;

    -- Insert order items and update inventory
    FOR item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            product_sku,
            quantity,
            unit_price,
            total_price
        ) VALUES (
            order_id,
            (item->>'productId')::UUID,
            item->>'name',
            item->>'sku',
            (item->>'quantity')::INTEGER,
            (item->>'price')::DECIMAL(10,2),
            (item->>'total')::DECIMAL(10,2)
        );

        -- Update product stock
        PERFORM update_product_stock((item->>'productId')::UUID, -(item->>'quantity')::INTEGER);

        -- Record inventory movement
        INSERT INTO inventory_movements (
            product_id,
            movement_type,
            quantity,
            reference_type,
            reference_id
        ) VALUES (
            (item->>'productId')::UUID,
            'out',
            (item->>'quantity')::INTEGER,
            'order',
            order_id
        );
    END LOOP;

    RETURN order_id;
END;
$$ LANGUAGE plpgsql;
