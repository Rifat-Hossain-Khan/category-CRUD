import mongoose from "mongoose";

export interface CategoryDocument extends mongoose.Document {
  title: string;
  active: boolean;
  parent: CategoryDocument["_id"];
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre("deleteOne", async function (next) {
  const categories = await this.model.find({ parent: this._conditions._id }).distinct("_id");
  categories.forEach(async (id: CategoryDocument["_id"]) => {
    await this.model.deleteOne({ _id: id });
  });
  next();
});

categorySchema.pre("updateOne", async function (next) {
  const categories = await this.model.find({ parent: this._conditions._id }).distinct("_id");

  categories.forEach(async (id: CategoryDocument["_id"]) => {
    if (!this._update.active) await this.model.updateOne({ _id: id }, { active: false });
  });
  next();
});

const CategoryModel = mongoose.model<CategoryDocument>("Category", categorySchema);

export default CategoryModel;
