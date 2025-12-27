
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool, { query } from './db/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OWNER_EMAIL = 'txguna@gmail.com';
const OWNER_PASSWORD = '@Texas2025.';

const seed = async () => {
  try {
    console.log('🌱 Starting seed...');

    // 1. Run Schema
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await query(schemaSql);
    console.log('✅ Schema applied.');

    // 2. Insert Owner (Unapproved)
    console.log('👤 Creating Owner account...');
    await query(
      'INSERT INTO users (name, email, password, role, is_approved) VALUES ($1, $2, $3, $4, $5)',
      ['Owner', OWNER_EMAIL, OWNER_PASSWORD, 'admin', false] // Start unapproved
    );

    // 3. Insert Categories
    console.log('📂 Creating Categories...');
    const cats = [
      { name: 'Birthday Cakes', slug: 'birthday', icon: '🎂' },
      { name: 'Wedding Cakes', slug: 'wedding', icon: '💒' },
      { name: 'Cupcakes', slug: 'cupcakes', icon: '🧁' },
      { name: 'Specialty', slug: 'specialty', icon: '✨' },
    ];
    
    for (const cat of cats) {
      await query('INSERT INTO categories (name, slug, icon) VALUES ($1, $2, $3)', [cat.name, cat.slug, cat.icon]);
    }

    // 4. Insert Ingredients
    console.log('uD83E\uDD58 Creating Ingredients...');
    const ingredients = [
      { name: 'Flour', unit: 'lb', price: 2.50 },
      { name: 'Sugar', unit: 'lb', price: 3.00 },
      { name: 'Butter', unit: 'lb', price: 5.50 },
      { name: 'Eggs', unit: 'dozen', price: 4.50 },
      { name: 'Belgian Chocolate', unit: 'lb', price: 12.00 },
      { name: 'Vanilla Extract', unit: 'oz', price: 8.00 },
      { name: 'Cream Cheese', unit: 'lb', price: 4.50 },
      { name: 'Heavy Cream', unit: 'qt', price: 5.00 },
    ];
    
    for (const ing of ingredients) {
      await query('INSERT INTO ingredients (name, unit, price) VALUES ($1, $2, $3)', [ing.name, ing.unit, ing.price]);
    }

    // 5. Insert Products
    console.log('🍰 Creating Products...');
    // Fetch IDs for relational insert
    const catRes = await query('SELECT id, slug FROM categories');
    const catMap = catRes.rows.reduce((acc, c) => ({ ...acc, [c.slug]: c.id }), {});

    const products = [
      {
        name: 'Classic Chocolate Dream',
        description: 'Rich layers of Belgian chocolate ganache.',
        price: 85.00,
        making_price: 15.00,
        categoryUrl: 'birthday',
        images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600'],
        tags: ['bestseller']
      },
      {
        name: 'Vanilla Cloud',
        description: 'Light Madagascar vanilla with Swiss meringue.',
        price: 75.00,
        making_price: 12.00,
        categoryUrl: 'birthday',
        images: ['https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=600'],
        tags: ['classic']
      },
      {
        name: 'Elegant Tiered Wonder',
        description: 'Three-tier masterpiece with hand-piped details.',
        price: 450.00,
        making_price: 80.00,
        categoryUrl: 'wedding',
        images: ['https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600'],
        tags: ['premium']
      }
    ];

    for (const p of products) {
      await query(
        'INSERT INTO products (name, description, price, making_price, category_id, images, tags) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [p.name, p.description, p.price, p.making_price, catMap[p.categoryUrl], p.images, p.tags]
      );
    }

    // 6. Insert Default Settings
    console.log('⚙️ Creating Default Settings...');
    const defaultSettings = {
        id: 1,
        shippingCost: 50.00,
        taxRate: 8.25,
        defaultCurrency: 'USD',
        currencies: [
            { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0, isBase: true },
            { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rate: 30.0, isBase: false },
            { code: 'TMT', name: 'Turkmen Manat', symbol: 'TMT', rate: 3.5, isBase: false }
        ]
    };
    await query(
      "INSERT INTO settings (key, value) VALUES ('main', $1) ON CONFLICT (key) DO UPDATE SET value = $1", 
      [JSON.stringify(defaultSettings)]
    );

    // 7. Insert Country Contacts
    console.log('🌍 Creating Country Contacts...');
    await query(
        "INSERT INTO country_contacts (country_code, country_name, email, phone, message, is_default) VALUES ($1, $2, $3, $4, $5, $6)",
        ['GENERAL', 'General / International', 'support@soulmatedesserts.com', '+1 555 123 4567', 'We ship worldwide!', true]
    );


    console.log('✨ Seed complete!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();
