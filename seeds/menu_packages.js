exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("menu_packages").del();
  await knex("menu_packages").insert([
    {
      package_id: 1,
      title: "Package 1",
      description: "Short Description",
      price_per_head: 50,
      contents: JSON.stringify({
        appetizer1: "appy1",
        appetizer2: "appy2",
        main1: "main dish 1",
        main2: "main dish 2",
        dessert1: "one dessert",
        dessert2: "other dessert",
      }),
    },
  ]);
};
