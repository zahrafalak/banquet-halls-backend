const knex = require("knex")(require("../knexfile"));

const getMenuPackages = async (_req, res) => {
  try {
    const data = await knex("menu_packages");
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Menu: ${err}`);
  }
};

module.exports = {
  getMenuPackages,
};
