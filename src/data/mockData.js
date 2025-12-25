export const mockCategories = [
  { id: '1', name: 'Birthday Cakes', slug: 'birthday', icon: '🎂' },
  { id: '2', name: 'Wedding Cakes', slug: 'wedding', icon: '💒' },
  { id: '3', name: 'Cupcakes', slug: 'cupcakes', icon: '🧁' },
  { id: '4', name: 'Specialty', slug: 'specialty', icon: '✨' },
];

export const initialIngredients = [
  { id: 'ing1', name: 'Flour', unit: 'lb', price: 2.50 },
  { id: 'ing2', name: 'Sugar', unit: 'lb', price: 3.00 },
  { id: 'ing3', name: 'Butter', unit: 'lb', price: 5.50 },
  { id: 'ing4', name: 'Eggs', unit: 'dozen', price: 4.50 },
  { id: 'ing5', name: 'Belgian Chocolate', unit: 'lb', price: 12.00 },
  { id: 'ing6', name: 'Vanilla Extract', unit: 'oz', price: 8.00 },
  { id: 'ing7', name: 'Cream Cheese', unit: 'lb', price: 4.50 },
  { id: 'ing8', name: 'Heavy Cream', unit: 'qt', price: 5.00 },
  { id: 'ing9', name: 'Cocoa Powder', unit: 'lb', price: 6.50 },
  { id: 'ing10', name: 'Lemon Juice', unit: 'qt', price: 4.00 },
  { id: 'ing11', name: 'Elderflower Syrup', unit: 'bottle', price: 15.00 },
  { id: 'ing12', name: 'Caramel Sauce', unit: 'jar', price: 7.50 },
  { id: 'ing13', name: 'Sea Salt', unit: 'lb', price: 3.50 },
  { id: 'ing14', name: 'Food Coloring', unit: 'set', price: 12.00 },
  { id: 'ing15', name: 'Fondant', unit: 'lb', price: 8.00 },
];

export const mockProducts = [
  { id: '1', name: 'Classic Chocolate Dream', description: 'Rich layers of Belgian chocolate ganache', price: 85.00, making_price: 15.00, ingredients: [{ id: 'ing1', quantity: 2 }, { id: 'ing2', quantity: 1.5 }, { id: 'ing5', quantity: 1.5 }, { id: 'ing8', quantity: 0.5 }], category_id: '1', images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=60', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=40', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'], tags: ['bestseller'] },
  { id: '2', name: 'Vanilla Cloud', description: 'Light Madagascar vanilla with Swiss meringue', price: 75.00, making_price: 12.00, ingredients: [{ id: 'ing1', quantity: 2 }, { id: 'ing2', quantity: 1.5 }, { id: 'ing6', quantity: 2 }, { id: 'ing4', quantity: 1 }], category_id: '1', images: ['https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=600', 'https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=600&q=80', 'https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=600&q=60', 'https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=800'], tags: ['classic'] },
  { id: '3', name: 'Red Velvet Romance', description: 'Southern-style with cream cheese frosting', price: 90.00, making_price: 18.00, ingredients: [{ id: 'ing1', quantity: 2 }, { id: 'ing2', quantity: 1.5 }, { id: 'ing7', quantity: 1 }, { id: 'ing9', quantity: 0.5 }, { id: 'ing14', quantity: 0.5 }], category_id: '1', images: ['https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600', 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&q=80', 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&q=60', 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&q=40', 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800', 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=900'], tags: ['popular'] },
  { id: '4', name: 'Elegant Tiered Wonder', description: 'Three-tier masterpiece with hand-piped details', price: 450.00, making_price: 80.00, ingredients: [{ id: 'ing1', quantity: 8 }, { id: 'ing2', quantity: 6 }, { id: 'ing3', quantity: 3 }, { id: 'ing4', quantity: 3 }, { id: 'ing15', quantity: 5 }], category_id: '2', images: ['https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&q=80', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&q=60', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=900', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=1000', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=1200'], tags: ['premium'] },
  { id: '5', name: 'Rustic Garden', description: 'Semi-naked cake with fresh flowers', price: 320.00, making_price: 60.00, ingredients: [{ id: 'ing1', quantity: 5 }, { id: 'ing2', quantity: 4 }, { id: 'ing3', quantity: 2 }, { id: 'ing8', quantity: 1 }], category_id: '2', images: ['https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=600', 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=600&q=80', 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=600&q=60', 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800', 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=900'], tags: ['rustic'] },
  { id: '6', name: 'Assorted Cupcake Box', description: 'Dozen cupcakes in seasonal flavors', price: 48.00, making_price: 8.00, ingredients: [{ id: 'ing1', quantity: 1.5 }, { id: 'ing2', quantity: 1 }, { id: 'ing3', quantity: 0.5 }, { id: 'ing4', quantity: 0.5 }], category_id: '3', images: ['https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600', 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&q=80', 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&q=60', 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800'], tags: ['popular'] },
  { id: '7', name: 'Salted Caramel Bliss', description: 'Caramel layers with sea salt buttercream', price: 95.00, making_price: 16.00, ingredients: [{ id: 'ing1', quantity: 2 }, { id: 'ing2', quantity: 1.5 }, { id: 'ing12', quantity: 1 }, { id: 'ing13', quantity: 0.1 }, { id: 'ing8', quantity: 0.5 }], category_id: '4', images: ['https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=60', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=40', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=900'], tags: ['signature'] },
  { id: '8', name: 'Lemon Elderflower', description: 'Zesty lemon with elderflower meringue', price: 88.00, making_price: 14.00, ingredients: [{ id: 'ing1', quantity: 2 }, { id: 'ing2', quantity: 1.5 }, { id: 'ing10', quantity: 0.5 }, { id: 'ing11', quantity: 0.5 }, { id: 'ing4', quantity: 1 }], category_id: '4', images: ['https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=60', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800'], tags: ['seasonal'] },
];

export const ADMIN = { email: 'admin@soulmate.com', password: 'Admin@2024!', name: 'Admin', role: 'admin' };

export const mockInvites = [
  { id: '1', token: 'DEALER2024', email: '', role: 'dealer', used: false, expiresAt: '2025-12-31' },
  { id: '2', token: 'USER2024', email: '', role: 'public', used: false, expiresAt: '2025-12-31' },
];

export const mockUsers = [];
