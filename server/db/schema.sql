-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    making_price NUMERIC(10, 2),
    category_id TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    ingredients JSONB DEFAULT '[]'::jsonb,
    languages JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ingredients Table
CREATE TABLE IF NOT EXISTS ingredients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    unit TEXT,
    price NUMERIC(10, 2) NOT NULL,
    price_per_unit NUMERIC(10, 2),
    stock NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    status TEXT DEFAULT 'Pending',
    total NUMERIC(10, 2) NOT NULL,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    delivery_date TIMESTAMP WITH TIME ZONE,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user',
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    message TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Invites Table
CREATE TABLE IF NOT EXISTS invites (
    id TEXT PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'dealer',
    used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Settings Table (Storing implementation details as JSONB for flexibility)
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    language TEXT DEFAULT 'en',
    currency TEXT DEFAULT 'USD',
    currencies JSONB DEFAULT '[]'::jsonb,
    contact_info JSONB DEFAULT '{}'::jsonb,
    store JSONB DEFAULT '{}'::jsonb
);

-- Country Contacts
CREATE TABLE IF NOT EXISTS country_contacts (
    id TEXT PRIMARY KEY,
    country TEXT NOT NULL,
    country_code TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    is_default BOOLEAN DEFAULT FALSE
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
