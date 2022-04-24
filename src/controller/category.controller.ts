import { DeleteCategoryInput, ReadCategoryInput } from "./../schema/category.schema";
import { createCategory, findCategory, findCategories, findAndUpdateCategory, updateCategory, deleteCategory } from "./../service/category.service";
import { Request, Response } from "express";
import logger from "../utils/logger";
import { createClient } from "redis";
import config from "config";

const redisClient = createClient();
redisClient.connect();

const DEFAULT_EXPIRATION = config.get<number>("redis_EXP");

export const createCategoryHandler = async (req: Request, res: Response) => {
  try {
    logger.info(req.body);
    const category = await createCategory(req.body);
    await redisClient.del(["activeCategories", "deActiveCategories"]);
    return res.send({ message: "Category created successfully!", data: category });
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
};

export const updateCategoryHandler = async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;
  const update = req.body;
  try {
    const category = await findCategory({ _id: categoryId });

    if (!category) {
      return res.sendStatus(404);
    }

    const updatedCategory = await findAndUpdateCategory({ _id: categoryId }, update, { new: true });

    await redisClient.del([`category_${categoryId}`, "activeCategories", "deActiveCategories"]);

    return res.send({ message: "Category updated successfully!", data: updatedCategory });
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
};

export const getCategoryHandler = async (req: Request<ReadCategoryInput["params"]>, res: Response) => {
  try {
    const categoryId = req.params.categoryId;
    try {
      const categoryData = await redisClient.get(`category_${categoryId}`);
      if (categoryData != null) return res.send(JSON.parse(categoryData));
    } catch (error) {
      logger.error(error);
    }
    const category = await findCategory({ _id: categoryId });
    if (!category) {
      return res.sendStatus(404);
    }
    await redisClient.setEx(`category_${categoryId}`, DEFAULT_EXPIRATION, JSON.stringify(category));
    return res.send(category);
  } catch (e: any) {
    logger.error(e);
    return res.status(500).send(e.message);
  }
};

export const getActiveCategoriesHandler = async (_req: Request<ReadCategoryInput["params"]>, res: Response) => {
  try {
    try {
      const categoryData = await redisClient.get("activeCategories");
      if (categoryData != null) return res.send(JSON.parse(categoryData));
    } catch (error) {
      logger.error(error);
    }

    const categories = await findCategories({ active: true });
    await redisClient.setEx("activeCategories", DEFAULT_EXPIRATION, JSON.stringify(categories));
    return res.send(categories);
  } catch (e: any) {
    logger.error(e);
    return res.status(500).send(e.message);
  }
};

export const getDeActiveCategoriesHandler = async (_req: Request<ReadCategoryInput["params"]>, res: Response) => {
  try {
    try {
      const categoryData = await redisClient.get("deActiveCategories");
      if (categoryData != null) return res.send(JSON.parse(categoryData));
    } catch (error) {
      logger.error(error);
    }
    const categories = await findCategories({ active: false });
    await redisClient.setEx("deActiveCategories", DEFAULT_EXPIRATION, JSON.stringify(categories));
    return res.send(categories);
  } catch (e: any) {
    logger.error(e);
    return res.status(500).send(e.message);
  }
};

export const changeActiveStatusHandler = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId;
    const { active } = req.body;

    const category = await findCategory({ _id: categoryId });

    if (!category) {
      return res.sendStatus(404);
    }

    await updateCategory({ _id: categoryId }, { active });

    await redisClient.del([`category_${categoryId}`, "activeCategories", "deActiveCategories"]);

    return res.send(`Category ${active ? "activated" : "deactivated"} successfully!`);
  } catch (e: any) {
    logger.error(e);
    return res.status(500).send(e.message);
  }
};

export const deleteCategoryHandler = async (req: Request<DeleteCategoryInput["params"]>, res: Response) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await findCategory({ _id: categoryId });

    if (!category) {
      return res.sendStatus(404);
    }

    await deleteCategory({ _id: category._id });

    await redisClient.del([`category_${categoryId}`, "activeCategories", "deActiveCategories"]);

    return res.sendStatus(200);
  } catch (e: any) {
    logger.error(e);
    return res.status(500).send(e.message);
  }
};
