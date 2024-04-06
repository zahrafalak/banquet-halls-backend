exports.seed = async function (knex) {
  await knex("halls").del();
  await knex("halls").insert([
    {
      name: "Emerald Banquet Hall",
      capacity: 150,
      description:
        "Our largest hall, adorned with crystal chandeliers and a classic decor. Perfect for weddings and large corporate events.",
      price: 5000.0,
    },
    {
      name: "Sapphire Conference Room",
      capacity: 40,
      description:
        "A modern, tech-equipped space ideal for conferences, presentations, and workshops.",
      price: 1500.0,
    },
    {
      name: "Ruby Boardroom",
      capacity: 20,
      description:
        "An intimate setting with luxurious furnishings for high-profile meetings and small gatherings.",
      price: 750.0,
    },
  ]);
};
