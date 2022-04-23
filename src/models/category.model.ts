import mongoose from "mongoose";

export interface CategoryDocument extends mongoose.Document {
  title: string;
  active: boolean;
  parentId: CategoryDocument["_id"];
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
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre("deleteOne", async function (next) {
  let category = this as CategoryDocument;
  const categories = await this.model.find({ _id: category._id }).distinct("_id");
  categories.forEach(async (id: CategoryDocument["_id"]) => {
    await this.model.deleteOne({ parentId: id });
  });
  next();
});

categorySchema.pre("updateOne", async function (next) {
  let category = this as CategoryDocument;
  const categories = await this.model.find({ _id: category._id }).distinct("_id");
  categories.forEach(async (id: CategoryDocument["_id"]) => {
    if (category.active) await this.model.updateOne({ parentId: id }, { active: !category.active });
  });
  next();
});

const CategoryModel = mongoose.model<CategoryDocument>("Category", categorySchema);

export default CategoryModel;
