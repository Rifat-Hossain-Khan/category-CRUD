import { object, string, TypeOf, boolean } from "zod";

const payload = {
  body: object({
    title: string({
      required_error: "Title is required",
    }),
    active: boolean().optional(),
    parent: string().optional(),
  }).strict(),
};

const updatePayload = {
  body: object({
    title: string().optional(),
    parent: string().optional(),
  }).strict(),
};

const statusPayload = {
  body: object({
    active: boolean({
      required_error: "active is required",
    }),
  }).strict(),
};

const params = {
  params: object({
    categoryId: string({
      required_error: "categoryId is required",
    }),
  }),
};

export const createCategorySchema = object({
  ...payload,
});

export const updateCategorySchema = object({
  ...updatePayload,
  ...params,
});

export const updateActiveCategoryStatusSchema = object({
  ...statusPayload,
  ...params,
});

export const getCategorySchema = object({
  ...params,
});

export const deleteCategorySchema = object({
  ...params,
});

export type CreateCategoryInput = TypeOf<typeof createCategorySchema>;
export type UpdateCategoryInput = TypeOf<typeof updateCategorySchema>;
export type UpdateActiveCategoryStatusInput = TypeOf<typeof updateActiveCategoryStatusSchema>;
export type ReadCategoryInput = TypeOf<typeof getCategorySchema>;
export type DeleteCategoryInput = TypeOf<typeof deleteCategorySchema>;
