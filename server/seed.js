import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const seed = async () => {
  const client = await pool.connect();
  try {
    console.log('🌱 Seeding database...');

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('✅ Schema created.');

    // Seed Data
    // Users
    await client.query(`
      INSERT INTO users (email, password, name, role) 
      VALUES ('admin@soulmate.com', 'Admin@2024!', 'Admin', 'admin')
    `);

    // Ingredients
    const ingredients = [
      { id: "ing_flour", name: "Pastry Flour", unit: "kg", price: 1.50, price_per_unit: 1.50 },
      { id: "ing_sugar", name: "Caster Sugar", unit: "kg", price: 1.20, price_per_unit: 1.20 },
      { id: "ing_butter", name: "French Butter", unit: "kg", price: 8.00, price_per_unit: 8.00 },
      { id: "ing_eggs", name: "Free Range Eggs", unit: "doz", price: 4.00, price_per_unit: 4.00 },
      { id: "ing_choc_dark", name: "70% Dark Chocolate", unit: "kg", price: 18.00, price_per_unit: 18.00 },
      { id: "ing_cream", name: "Double Cream", unit: "L", price: 6.00, price_per_unit: 6.00 },
      { id: "ing_gold_leaf", name: "Edible Gold Leaf", unit: "sheet", price: 2.50, price_per_unit: 2.50 },
      { id: "ing_praline", name: "Hazelnut Praline", unit: "kg", price: 22.00, price_per_unit: 22.00 },
      { id: "ing_blueberries", name: "Fresh Blueberries", unit: "kg", price: 12.00, price_per_unit: 12.00 },
      { id: "ing_lavender", name: "Dried Lavender", unit: "g", price: 0.10, price_per_unit: 0.10 },
      { id: "ing_cocoa", name: "Dutch Cocoa", unit: "kg", price: 9.00, price_per_unit: 9.00 },
      { id: "ing_cream_cheese", name: "Cream Cheese", unit: "kg", price: 7.00, price_per_unit: 7.00 },
      { id: "ing_red_dye", name: "Red Gel Coloring", unit: "btl", price: 5.00, price_per_unit: 5.00 },
      { id: "ing_sesame", name: "Black Sesame Paste", unit: "jar", price: 8.50, price_per_unit: 8.50 },
      { id: "ing_charcoal", name: "Bamboo Charcoal", unit: "g", price: 0.20, price_per_unit: 0.20 },
      { id: "ing_matcha", name: "Ceremonial Matcha", unit: "tin", price: 25.00, price_per_unit: 25.00 },
      { id: "ing_adzuki", name: "Red Bean Paste", unit: "kg", price: 6.00, price_per_unit: 6.00 },
      { id: "ing_butterfly_pea", "name": "Butterfly Pea Powder", unit: "pkt", price: 12.00, price_per_unit: 12.00 },
      { id: "ing_coconut", name: "Desiccated Coconut", unit: "kg", price: 5.00, price_per_unit: 5.00 },
      { id: "ing_lemon", name: "Organic Lemons", unit: "kg", price: 3.00, price_per_unit: 3.00 },
      { id: "ing_raspberry", name: "Raspberry Puree", unit: "kg", price: 14.00, price_per_unit: 14.00 },
      { id: "ing_almonds", name: "Almond Meal", unit: "kg", price: 11.00, price_per_unit: 11.00 },
      { id: "ing_gelatin", name: "Leaf Gelatin", unit: "pack", price: 4.00, price_per_unit: 4.00 }
    ];

    for (const ing of ingredients) {
      await client.query(
        'INSERT INTO ingredients (id, name, unit, price, price_per_unit) VALUES ($1, $2, $3, $4, $5)',
        [ing.id, ing.name, ing.unit, ing.price, ing.price_per_unit]
      );
    }
    console.log(`✅ ${ingredients.length} Ingredients inserted.`);

    // Products
    const products = [
       {
        name: "Royal Raspberry Entremet",
        description: "A glossy red mirror-glazed mousse cake featuring layers of raspberry coulis, vanilla bean crème brûlée, and almond sponge.",
        price: 48,
        making_price: 18.50,
        category_id: 4,
        images: [
          "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800&q=80",
          "https://images.unsplash.com/photo-1616541823729-00fe0e24e648?w=800&q=80"
        ],
        tags: ["hero", "signature"],
        ingredients: [
          { ingredient_id: "ing_raspberry", quantity: 2.5 },
          { ingredient_id: "ing_cream", quantity: 1.5 },
          { ingredient_id: "ing_almonds", quantity: 1.0 },
          { ingredient_id: "ing_gelatin", quantity: 0.2 }
        ]
      },
      {
        name: "Triple Chocolate Truffle",
        description: "Decadent dark chocolate sponge layered with white chocolate ganache and milk chocolate hazelnut praline.",
        price: 55,
        making_price: 22.00,
        category_id: 4,
        images: [
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
          "https://images.unsplash.com/photo-1626803775151-61d756612fcd?w=800&q=80",
          "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80"
        ],
        tags: ["bestseller", "premium"],
        ingredients: [
          { ingredient_id: "ing_choc_dark", quantity: 3.0 },
          { ingredient_id: "ing_cream", quantity: 1.0 },
          { ingredient_id: "ing_praline", quantity: 1.0 },
          { ingredient_id: "ing_cocoa", quantity: 0.5 }
        ]
      },
      {
        name: "Sicilian Lemon & Lavender",
        description: "Zesty lemon tart with a hint of lavender, topped with scorched italian meringue peaks.",
        price: 35,
        making_price: 12.50,
        category_id: 4,
        images: [
          "https://images.unsplash.com/photo-1519340333755-56e9c1d023e6?w=800&q=80",
          "https://images.unsplash.com/photo-1488477181946-6428a029177b?w=800&q=80"
        ],
        tags: ["popular", "refreshing"],
        ingredients: [
          { ingredient_id: "ing_lemon", quantity: 3.0 },
          { ingredient_id: "ing_flour", quantity: 1.5 },
          { ingredient_id: "ing_butter", quantity: 1.5 },
          { ingredient_id: "ing_eggs", quantity: 2.0 }
        ]
      },
      {
        name: "Salted Caramel Cheesecake",
        description: "New York style baked cheesecake topped with a generous pool of salted caramel and caramelized pecans.",
        price: 42,
        making_price: 15.00,
        category_id: 4,
        images: [
          "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80",
          "https://images.unsplash.com/photo-1525167086431-15df3324fc28?w=800&q=80"
        ],
        tags: ["classic", "sweet"],
        ingredients: [
          { ingredient_id: "ing_cream_cheese", quantity: 3.0 },
          { ingredient_id: "ing_sugar", quantity: 1.5 },
          { ingredient_id: "ing_butter", quantity: 1.0 },
          { ingredient_id: "ing_eggs", quantity: 1.0 }
        ]
      },
       {
        name: "Pistachio Opera Slice",
        description: "Intricate layers of pistachio sponge, coffee buttercream, and chocolate ganache.",
        price: 28,
        making_price: 9.50,
        category_id: 4,
        images: [
          "https://images.unsplash.com/photo-1586985289906-406988974504?w=800&q=80",
          "https://images.unsplash.com/photo-1588195538326-c5b1e5b80e6d?w=800&q=80"
        ],
        tags: ["nutty", "premium"],
        ingredients: [
          { ingredient_id: "ing_almonds", quantity: 1.0 },
          { ingredient_id: "ing_choc_dark", quantity: 1.0 },
          { ingredient_id: "ing_butter", quantity: 1.0 },
          { ingredient_id: "ing_eggs", quantity: 1.0 }
        ]
      },
      {
        name: "Strawberry Fields Forever",
        description: "Rustic sponge cake overflowing with fresh strawberries and vanilla chantilly cream.",
        price: 36,
        making_price: 13.00,
        category_id: 4,
        images: [
          "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80",
          "https://images.unsplash.com/photo-1565958011062-10a9c528d7e8?w=800&q=80"
        ],
        tags: ["classic", "seasonal"],
        ingredients: [
          { ingredient_id: "ing_flour", quantity: 1.5 },
          { ingredient_id: "ing_sugar", quantity: 1.0 },
          { ingredient_id: "ing_cream", quantity: 1.5 },
          { ingredient_id: "ing_eggs", quantity: 1.0 }
        ]
      }
    ];

    for (const p of products) {
      const res = await client.query(
        'INSERT INTO products (name, description, price, making_price, category_id, images, tags, languages, regions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
        [p.name, p.description, p.price, p.making_price, p.category_id, p.images, p.tags, ['en', 'ru', 'tr', 'tk'], []]
      );
      const pid = res.rows[0].id;
      
      for (const ing of p.ingredients) {
        await client.query(
          'INSERT INTO products_ingredients (product_id, ingredient_id, quantity) VALUES ($1, $2, $3)',
          [pid, ing.ingredient_id, ing.quantity]
        );
      }
    }
    console.log(`✅ ${products.length} Products inserted.`);

    // Settings
    const settings = {
      language: "en",
      currency: "USD",
      currencies: [
        { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
        { code: "TMT", name: "Turkmen Manat", symbol: "TMT", rate: 3.5 },
        { code: "EUR", name: "Euro", symbol: "EUR", rate: 0.92 }
      ],
      contactInfo: { phone: "+1 737 2220947", email: "usa@soulmatedesserts.com" },
      store: { shipping: 10, taxRate: 8.25 }
    };

    await client.query("INSERT INTO settings (key, value) VALUES ('main', $1)", [settings]);

    // Country Contacts
    await client.query(`
      INSERT INTO country_contacts (id, country_code, country_name, email, phone, is_default)
      VALUES 
      ('general', 'GENERAL', 'General', 'hello@soulmatedesserts.com', '+1 (512) 555-CAKE', false),
      ('us', 'US', 'United States', 'usa@soulmatedesserts.com', '+1 737 2220947', true),
      ('tm', 'TM', 'Turkmenistan', 'turkmenistan@soulmatedesserts.com', '+993 65 123456', false)
    `);

    console.log('✅ Seeding complete.');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    client.release();
    pool.end();
  }
};

seed();
