exports.seed = async function (knex) {
  await knex("menu_packages").del();
  await knex("menu_packages").insert([
    {
      title: "Classic Elegance",
      description:
        "A timeless selection of our most beloved dishes, perfect for any occasion.",
      image_url: "https://res.cloudinary.com/dxqnbl6rc/image/upload/v1775514510/classic_vgbcpj.jpg",
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
      image_url: "https://res.cloudinary.com/dxqnbl6rc/image/upload/v1775514532/fusion_k30ynu.jpg",
      price_per_head: 85.0,
      contents: JSON.stringify({
        appetizers: ["Seared Scallops on Sweet Corn Puree", "Avocado and Mango Salad"],
        mains: ["Duck Breast with Cherry Sauce", "Quinoa and Black Bean Stuffed Peppers"],
        desserts: ["Matcha Green Tea Cake", "Lemon Sorbet with Mint"],
      }),
    },
    {
      title: "Vegetarian Delight",
      description:
        "A gourmet selection of vegetarian dishes, crafted with the freshest seasonal ingredients.",
      image_url: "https://res.cloudinary.com/dxqnbl6rc/image/upload/v1775514648/vegetarian_duzzaz.jpg",
      price_per_head: 65.0,
      contents: JSON.stringify({
        appetizers: ["Caprese Salad with Balsamic Glaze", "Stuffed Mushrooms"],
        mains: ["Eggplant Parmesan", "Thai Green Curry with Tofu"],
        desserts: ["Apple Pie", "Chocolate Lava Cake"],
      }),
    },
  ]);
};