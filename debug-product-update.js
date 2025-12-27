
import fetch from 'node-fetch';

const updateProduct = async () => {
  const id = 2; // Testing with ID 2 as per user log
  const body = {
    name: "Debug Product",
    description: "Debug Description",
    price: 100,
    making_price: 20,
    category_id: 1, // Assumption: category 1 exists
    images: ["http://example.com/img.jpg"],
    tags: ["hero"],
    languages: ["en"],
    regions: ["US"],
    ingredients: []
  };

  try {
    const res = await fetch(`http://localhost:3002/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      console.log(`Error Status: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.log("Response Body:", text);
    } else {
      console.log("Update Success:", await res.json());
    }
  } catch (err) {
    console.error("Fetch Error:", err);
  }
};

updateProduct();
