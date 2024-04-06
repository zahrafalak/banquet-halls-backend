exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("menu_packages").del();
  await knex("menu_packages").insert([
    {
      title: "Classic Elegance",
      description:
        "A timeless selection of our most beloved dishes, perfect for any occasion.",
      price_per_head: 75.0,
      contents: JSON.stringify({
        appetizers: ["Caesar Salad", "Bruschetta"],
        mains: ["Grilled Salmon with Lemon Butter", "Beef Wellington"],
        desserts: ["Tiramisu", "Crème Brûlée"],
      }),
    },
    {
      title: "Modern Fusion",
      description:
        "A contemporary twist on classic flavors, offering a unique dining experience.",
      price_per_head: 85.0,
      contents: JSON.stringify({
        appetizers: [
          "Seared Scallops on Sweet Corn Puree",
          "Avocado and Mango Salad",
        ],
        mains: [
          "Duck Breast with Cherry Sauce",
          "Quinoa and Black Bean Stuffed Peppers",
        ],
        desserts: ["Matcha Green Tea Cake", "Lemon Sorbet with Mint"],
      }),
    },
    {
      title: "Vegetarian Delight",
      description:
        "A gourmet selection of vegetarian dishes, crafted with the freshest seasonal ingredients.",
      price_per_head: 65.0,
      contents: JSON.stringify({
        appetizers: ["Caprese Salad with Balsamic Glaze", "Stuffed Mushrooms"],
        mains: ["Eggplant Parmesan", "Thai Green Curry with Tofu"],
        desserts: ["Apple Pie", "Chocolate Lava Cake"],
      }),
    },
  ]);
};
