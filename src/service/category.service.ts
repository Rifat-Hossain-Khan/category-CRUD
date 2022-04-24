import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import CategoryModel, { CategoryDocument } from "../models/category.model";

export const createCategory = async (input: DocumentDefinition<Omit<CategoryDocument, "createdAt" | "updatedAt">>) => {
  return CategoryModel.create(input);
};

export const findCategory = async (query: FilterQuery<CategoryDocument>, options: QueryOptions = { lean: true }) => {
  return CategoryModel.findOne(query, {}, options)
    .populate({ path: "parent", populate: { path: "parent", model: "Category" } })
    .lean().exec();
};

export const findCategories = async (query: FilterQuery<CategoryDocument>) => {
  return CategoryModel.find(query)
    .populate({ path: "parent", populate: { path: "parent", model: "Category" } })
    .lean().exec();
};

export const findAndUpdateCategory = async (
  query: FilterQuery<CategoryDocument>,
  update: UpdateQuery<Omit<CategoryDocument, "active">>,
  options: QueryOptions
) => {
  return CategoryModel.findOneAndUpdate(query, update, options);
};

export const updateCategory = async (query: FilterQuery<CategoryDocument>, update: UpdateQuery<CategoryDocument>) => {
  return CategoryModel.updateOne(query, update);
};

export const deleteCategory = async (query: FilterQuery<CategoryDocument>) => {
  return CategoryModel.deleteOne(query);
};
