require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // Needs node-fetch installed or use axios/default fetch if node 18+

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
    console.log('Starting migration...');
    
    // Read db.json
    const dbPath = path.join(__dirname, '../../db.json');
    if (!fs.existsSync(dbPath)) {
        console.error('db.json not found at', dbPath);
        process.exit(1);
    }
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    // Migrate Products
    if (db.products) {
        console.log(`Migrating ${db.products.length} products...`);
        for (const p of db.products) {
            await pool.query(
                `INSERT INTO products (id, name, description, price, making_price, category_id, images, ingredients, languages, tags) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                 ON CONFLICT (id) DO NOTHING`,
                [p.id, p.name, p.description, p.price, p.making_price, p.category_id, JSON.stringify(p.images), JSON.stringify(p.ingredients), JSON.stringify(p.languages), JSON.stringify(p.tags)]
            );
        }
    }

    // Migrate Ingredients
    if (db.ingredients) {
        console.log(`Migrating ${db.ingredients.length} ingredients...`);
        for (const i of db.ingredients) {
            await pool.query(
                `INSERT INTO ingredients (id, name, unit, price, price_per_unit, stock) 
                 VALUES ($1, $2, $3, $4, $5, 0) -- defaulting stock to 0
                 ON CONFLICT (id) DO NOTHING`,
                [i.id, i.name, i.unit, i.price, i.pricePerUnit]
            );
        }
    }

    // Migrate Orders
    if (db.orders) {
        console.log(`Migrating ${db.orders.length} orders...`);
        for (const o of db.orders) {
             await pool.query(
                `INSERT INTO orders (id, status, total, customer_name, customer_email, customer_phone, items, delivery_date, address, notes, created_at) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                 ON CONFLICT (id) DO NOTHING`,
                [o.id, o.status, o.total, o.customerName, o.customerEmail, o.customerPhone, JSON.stringify(o.items), o.deliveryDate, o.address, o.notes, o.createdAt || new Date()]
            );
        }
    }

    // Migrate Settings
    if (db.settings && db.settings.length > 0) {
        console.log('Migrating settings...');
        const s = db.settings[0]; // Assuming only 1 settings object
        await pool.query(
            `INSERT INTO settings (id, language, currency, currencies, contact_info, store) 
             VALUES (1, $1, $2, $3, $4, $5)
             ON CONFLICT (id) DO UPDATE SET 
             language=$1, currency=$2, currencies=$3, contact_info=$4, store=$5`,
            [s.language, s.currency, JSON.stringify(s.currencies), JSON.stringify(s.contactInfo), JSON.stringify(s.store)]
        );
    }
    
    // Migrate Messages
    if (db.messages) {
        console.log(`Migrating ${db.messages.length} messages...`);
        for (const m of db.messages) {
             await pool.query(
                `INSERT INTO messages (id, name, email, phone, message, date) 
                 VALUES ($1, $2, $3, $4, $5, $6)
                 ON CONFLICT (id) DO NOTHING`,
                [m.id, m.name, m.email, m.phone || '', m.message, m.date || new Date()]
            );
        }
    }

    // Migrate Users
    if (db.users) {
        console.log(`Migrating ${db.users.length} users...`);
        for (const u of db.users) {
             await pool.query(
                `INSERT INTO users (id, email, password, name, role) 
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (id) DO NOTHING`,
                [u.id, u.email, u.password, u.name, u.role]
            );
        }
    }

    // Migrate Invites
    if (db.invites) {
        console.log(`Migrating ${db.invites.length} invites...`);
        for (const i of db.invites) {
             await pool.query(
                `INSERT INTO invites (id, token, email, role, used, expires_at) 
                 VALUES ($1, $2, $3, $4, $5, $6)
                 ON CONFLICT (id) DO NOTHING`,
                [i.id, i.token, i.email, i.role, i.used, i.expiresAt]
            );
        }
    }
    
    // Migrate Country Contacts
    if (db.countryContacts) {
        console.log(`Migrating ${db.countryContacts.length} country contacts...`);
        for (const c of db.countryContacts) {
             await pool.query(
                `INSERT INTO country_contacts (id, country, country_code, email, phone, is_default) 
                 VALUES ($1, $2, $3, $4, $5, $6)
                 ON CONFLICT (id) DO NOTHING`,
                [c.id, c.country, c.countryCode, c.email, c.phone, c.isDefault]
            );
        }
    }

    console.log('Migration completed successfully!');
    await pool.end();
}

migrate().catch(e => {
    console.error(e);
    process.exit(1);
});
