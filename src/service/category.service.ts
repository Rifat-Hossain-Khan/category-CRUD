import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import CategoryModel, { CategoryDocument } from "../models/category.model";

export const createCategory = async (input: DocumentDefinition<Omit<CategoryDocument, "createdAt" | "updatedAt">>) => {
  return CategoryModel.create(input);
};

export const findCategory = async (query: FilterQuery<CategoryDocument>, options: QueryOptions = { lean: true }) => {
  return CategoryModel.findOne(query, {}, options).populate("parent").lean();
};

export const findCategories = async (query: FilterQuery<CategoryDocument>) => {
  return CategoryModel.find(query).populate("parent").lean();
};

export const findAndUpdateCategory = async (query: FilterQuery<CategoryDocument>, update: UpdateQuery<CategoryDocument>, options: QueryOptions) => {
  return CategoryModel.findOneAndUpdate(query, update, options);
};

export const updateCategory = async (query: FilterQuery<CategoryDocument>, update: UpdateQuery<CategoryDocument>) => {
  return CategoryModel.updateOne(query, update);
};

export const deleteCategory = async (query: FilterQuery<CategoryDocument>) => {
  return CategoryModel.deleteOne(query);
};
