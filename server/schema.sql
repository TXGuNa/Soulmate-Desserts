DROP TABLE IF EXISTS "products_ingredients" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "ingredients" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "settings" CASCADE;
DROP TABLE IF EXISTS "country_contacts" CASCADE;
DROP TABLE IF EXISTS "messages" CASCADE;
DROP TABLE IF EXISTS "invites" CASCADE;

CREATE TABLE "categories" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) UNIQUE,
    "icon" VARCHAR(255)
);

CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) DEFAULT 'public',
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "is_approved" BOOLEAN DEFAULT TRUE
);

CREATE TABLE "products" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "making_price" DECIMAL(10,2),
    "category_id" INTEGER,
    "images" TEXT[], 
    "tags" TEXT[],
    "languages" TEXT[], 
    "regions" TEXT[]
);

CREATE TABLE "ingredients" (
    "id" VARCHAR(50) PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "unit" VARCHAR(50),
    "price" DECIMAL(10,2),
    "price_per_unit" DECIMAL(10,2)
);

CREATE TABLE "products_ingredients" (
    "product_id" INTEGER REFERENCES "products"("id") ON DELETE CASCADE,
    "ingredient_id" VARCHAR(50) REFERENCES "ingredients"("id") ON DELETE CASCADE,
    "quantity" DECIMAL(10,2) NOT NULL,
    PRIMARY KEY ("product_id", "ingredient_id")
);

CREATE TABLE "orders" (
    "id" VARCHAR(50) PRIMARY KEY,
    "user_id" INTEGER,
    "items" JSONB,
    "total" DECIMAL(10,2),
    "status" VARCHAR(50),
    "shipping_address" JSONB,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "settings" (
    "id" SERIAL PRIMARY KEY,
    "key" VARCHAR(50) UNIQUE NOT NULL,
    "value" JSONB NOT NULL
);

CREATE TABLE "country_contacts" (
    "id" VARCHAR(50) PRIMARY KEY,
    "country_code" VARCHAR(10) UNIQUE NOT NULL,
    "country_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(50),
    "message" TEXT,
    "is_default" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "messages" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255),
    "email" VARCHAR(255),
    "phone" VARCHAR(50),
    "message" TEXT,
    "status" VARCHAR(50) DEFAULT 'unread',
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "invites" (
    "id" SERIAL PRIMARY KEY,
    "token" VARCHAR(255) UNIQUE NOT NULL,
    "role" VARCHAR(50),
    "email" VARCHAR(255),
    "used" BOOLEAN DEFAULT FALSE,
    "expires_at" TIMESTAMP
);
