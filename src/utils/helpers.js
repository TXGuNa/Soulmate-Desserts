// Helper function to calculate cost from ingredients
export const calculateCostPrice = (product, ingredients) => {
  const ingredientsCost = product.ingredients?.reduce((sum, ing) => {
    const ingredient = ingredients.find(i => i.id === ing.id);
    const price = parseFloat(ingredient?.price) || 0;
    const quantity = parseFloat(ing.quantity) || 0;
    return sum + (price * quantity);
  }, 0) || 0;
  return ingredientsCost + (parseFloat(product.making_price) || 0);
};
