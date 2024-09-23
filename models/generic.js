const excludedFields = [
  "search",
  "search_field",
  "sort_order",
  "sort_by",
  "fields",
  "page",
  "limit",
];

module.exports = class ModelGeneric {
  #Model;

  constructor(model) {
    this.#Model = model;
  }

  // Get all users with optional filters
  //{ref, fields}
  //config
  // async getAll(
  //   queryString,
  //   filters,
  //   populateObj = { ref: "", fields: [] },
  //   sortBy = null,
  //   sortOrder = "asc",
  //   fields = "",
  //   page,
  //   limit
  // ) {
  //   const query = this.#Model.find();

  //   const queryBuilder = new QueryBuilder(query, queryString);
  //   if (filters) {
  //     queryBuilder.filter(filters);
  //   }

  //   if (populateObj.ref) {
  //     query.populate(populateObj.ref, populateObj.fields);
  //   }
  //   if (sortBy) {
  //     query.sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 });
  //   }
  //   if (fields) {
  //     fields = fields.split(",").join(" ");
  //     query.select(fields);
  //   }
  //   if (page && limit) {
  //     //2, 5
  //     const skip = (page - 1) * limit;
  //     query.skip(skip).limit(limit);
  //   }
  //   return await query;
  // }

  async create(data) {
    try {
      const instance = new this.#Model(data);
      return await instance.save();
    } catch (err) {
      throw err;
    }
  }

  // Read a user by ID
  async getById(id, populateObj = { ref: "", fields: [] }) {
    try {
      const query = this.#Model.findById(id);

      if (populateObj.ref) {
        query.populate(populateObj.ref, populateObj.fields);
      }

      return await query;
    } catch (e) {
      throw e;
    }
  }

  // Update a this.#Model by ID
  async update(id, data, populateObj = { ref: "", fields: [] }) {
    try {
      return await this.#Model.findByIdAndUpdate(id, data, { new: true });
    } catch (e) {
      throw e;
    }
  }

  // Delete a this.#Model by ID
  async delete(id) {
    try {
      return await this.#Model.findByIdAndDelete(id);
    } catch (e) {
      throw e;
    }
  }
};
