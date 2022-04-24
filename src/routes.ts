import {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema,
  updateActiveCategoryStatusSchema,
  deleteCategorySchema,
} from "./schema/category.schema";
import {
  createCategoryHandler,
  updateCategoryHandler,
  getCategoryHandler,
  getActiveCategoriesHandler,
  getDeActiveCategoriesHandler,
  changeActiveStatusHandler,
  deleteCategoryHandler,
} from "./controller/category.controller";
import { Express, Request, Response } from "express";
import validate from "./middleware/validate";

const routes = (app: Express) => {
  app.get("/health-check", (_req: Request, res: Response) => res.sendStatus(200));

  app.get("/api/categories/active", getActiveCategoriesHandler);
  app.get("/api/categories/de-active", getDeActiveCategoriesHandler);
  app.get("/api/category/:categoryId", validate(getCategorySchema), getCategoryHandler);

  app.post("/api/create/category", validate(createCategorySchema), createCategoryHandler);
  app.put("/api/update/category/:categoryId", validate(updateCategorySchema), updateCategoryHandler);
  app.patch("/api/update/category/status/:categoryId", validate(updateActiveCategoryStatusSchema), changeActiveStatusHandler);

  app.delete("/api/category/:categoryId", validate(deleteCategorySchema), deleteCategoryHandler);
};

export default routes;
