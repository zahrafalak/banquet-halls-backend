exports.seed = async function (knex) {
  await knex("halls").del();
  await knex("halls").insert([
    {
      name: "Emerald Banquet Hall",
      capacity: 300,
      description:
        "Our largest hall, adorned with crystal chandeliers and a classic decor. Perfect for weddings and large corporate events.",
      price: 5000,
      hallImage_url: `${process.env.BASE_URL}/hall1.jpg`,
    },
    {
      name: "Sapphire Conference Room",
      capacity: 150,
      description:
        "A modern, tech-equipped space ideal for conferences, presentations, and workshops.",
      price: 2000,
      hallImage_url: `${process.env.BASE_URL}/hall2.jpg`,
    },
    {
      name: "Ruby Lounge",
      capacity: 75,
      description:
        "An intimate setting with luxurious furnishings for high-profile meetings and small gatherings.",
      price: 950,
      hallImage_url: `${process.env.BASE_URL}/hall3.jpg`,
    },
  ]);
};