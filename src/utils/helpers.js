// Helper function to calculate cost from ingredients
export const calculateCostPrice = (product, ingredients) => {
  const ingredientsCost = product.ingredients?.reduce((sum, ing) => {
    const ingredient = ingredients.find(i => i.id === ing.id);
    return sum + (ingredient?.price || 0) * (ing.quantity || 0);
  }, 0) || 0;
  return ingredientsCost + (product.making_price || 0);
};
