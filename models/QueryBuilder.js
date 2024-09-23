module.exports = class QueryBuilder {
  #queryObject;
  #filters = {};
  #Model;
  constructor(model, queryObject) {
    this.query = model.find();
    this.#queryObject = queryObject;
    this.#Model = model;
  }

  filter(filters) {
    // Merge new filters with existing ones
    this.#filters = { ...this.#filters, ...filters };
    this.query = this.query.find(this.#filters);
    return this;
  }

  search() {
    const { search, search_field } = this.#queryObject;
    if (search && search_field) {
      this.#filters[search_field] = {
        $regex: search,
      };
      this.query = this.query.find(this.#filters);
    }
    return this;
  }

  sorting() {
    const { sort_order = "asc", sort_by } = this.#queryObject;
    console.log(sort_by);

    if (sort_by) {
      this.query = this.query.sort({
        [sort_by]: sort_order === "asc" ? 1 : -1,
      });
    }
    return this;
  }

  populate(ref, fields) {
    if (ref) {
      this.query = this.query.populate(ref, fields);
    }
    return this;
  }

  customizeFields() {
    let { fields } = this.#queryObject;
    if (fields) {
      fields = fields.split(",").join(" ");
      this.query = this.query.select(fields);
    }
    return this;
  }

  pagination() {
    const { page = 1, limit = 10 } = this.#queryObject;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
  async countAllPages() {
    try {
      const { limit = 10 } = this.#queryObject;
      const totalDocuments = await this.#Model.countDocuments(this.#filters);
      let totalPages = totalDocuments / limit;
      return Math.ceil(totalPages);
    } catch (e) {
      throw e;
    }
  }
  async getAll() {
    try {
      return await this.query.exec();
    } catch (error) {
      // Handle error appropriately
      console.error("Error executing query:", error);
      throw error;
    }
  }
};
