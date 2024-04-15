const knex = require("knex")(require("../knexfile"));

const getMenuPackages = async (_req, res) => {
  try {
    const data = await knex("menu_packages");
    res.status(200).json(data);
  } catch (err) {
    console.error(`Error retrieving Menu Packages: ${err}`);
    res.status(500).send(`Error retrieving Menu Packages: ${err.message}`);
  }
};

module.exports = {
  getMenuPackages,
};
