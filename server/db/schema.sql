
DROP TABLE IF EXISTS "invites" CASCADE;
DROP TABLE IF EXISTS "country_contacts" CASCADE;
DROP TABLE IF EXISTS "settings" CASCADE;
DROP TABLE IF EXISTS "messages" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "products_ingredients" CASCADE;
DROP TABLE IF EXISTS "ingredients" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Users Table
CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL, -- In real app, this should be hashed. Mocking plain for now as per prior context or standard dev.
    "name" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) DEFAULT 'public', -- 'admin', 'dealer', 'public'
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "is_approved" BOOLEAN DEFAULT TRUE -- Defaults to true for normal users, Owner will be handled specifically
);

-- Categories
CREATE TABLE "categories" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) UNIQUE NOT NULL,
    "icon" VARCHAR(50)
);

-- Products
CREATE TABLE "products" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "making_price" DECIMAL(10,2),
    "category_id" INTEGER REFERENCES "categories"("id"),
    "images" TEXT[], -- Array of image URLs
    "tags" TEXT[], -- Array of tags
    "languages" TEXT[], -- Array of language codes
    "regions" TEXT[] -- Array of region codes
);

-- Ingredients
CREATE TABLE "ingredients" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "unit" VARCHAR(50) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "stock" DECIMAL(10,2) DEFAULT 0
);

-- Products <-> Ingredients (Many-to-Many)
CREATE TABLE "products_ingredients" (
    "product_id" INTEGER REFERENCES "products"("id") ON DELETE CASCADE,
    "ingredient_id" INTEGER REFERENCES "ingredients"("id") ON DELETE CASCADE,
    "quantity" DECIMAL(10,2) NOT NULL,
    PRIMARY KEY ("product_id", "ingredient_id")
);

-- Orders
CREATE TABLE "orders" (
    "id" VARCHAR(50) PRIMARY KEY, -- Using string IDs to match frontend generated IDs usually
    "user_id" INTEGER REFERENCES "users"("id"),
    "items" JSONB NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(50) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
    "shipping_address" JSONB,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invites
CREATE TABLE "invites" (
    "id" SERIAL PRIMARY KEY,
    "token" VARCHAR(100) UNIQUE NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255),
    "used" BOOLEAN DEFAULT FALSE,
    "expires_at" TIMESTAMP NOT NULL
);

-- Messages
CREATE TABLE "messages" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(50) DEFAULT 'unread' -- unread, read
);

-- Settings
CREATE TABLE "settings" (
    "id" SERIAL PRIMARY KEY,
    "key" VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'general', 'currency'
    "value" JSONB NOT NULL
);

-- Country Contacts
CREATE TABLE "country_contacts" (
    "id" SERIAL PRIMARY KEY,
    "country_code" VARCHAR(10) UNIQUE NOT NULL,
    "country_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(50),
    "message" TEXT,
    "is_default" BOOLEAN DEFAULT FALSE
);
