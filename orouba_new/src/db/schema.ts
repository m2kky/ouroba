import { pgTable, text, timestamp, boolean, integer, json, real, primaryKey, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const roleEnum = pgEnum('Role', ['USER', 'ADMIN', 'EDITOR']);
export const bannerTypeEnum = pgEnum('BannerType', ['image', 'video']);
export const requestStatusEnum = pgEnum('RequestStatus', ['UNREAD', 'READ', 'ARCHIVED']);
export const orderStatusEnum = pgEnum('OrderStatus', ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']);

export const users = pgTable('User', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified'),
  image: text('image'),
  password: text('password'),
  phone: text('phone'),
  role: roleEnum('role').default('USER'),
  permissions: text('permissions').array(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const brands = pgTable('Brand', {
  id: text('id').primaryKey(),
  nameEn: text('nameEn').notNull(),
  nameAr: text('nameAr').notNull(),
  number: integer('number').default(999),
  image: text('image'),
  imageMain: text('imageMain'),
  imageSmall: text('imageSmall'),
  imageSmallMain: text('imageSmallMain'),
  colorBrand: text('colorBrand'),
  colorHover: text('colorHover'),
  descriptionEn: text('descriptionEn'),
  descriptionAr: text('descriptionAr'),
  brandTextEn: text('brandTextEn'),
  brandTextAr: text('brandTextAr'),
  videoUrl: text('videoUrl'),
  videoUrlEn: text('videoUrlEn'),
  isHidden: boolean('isHidden').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const products = pgTable('Product', {
  id: text('id').primaryKey(),
  nameEn: text('nameEn').notNull(),
  nameAr: text('nameAr').notNull(),
  descriptionEn: text('descriptionEn'),
  descriptionAr: text('descriptionAr'),
  color: text('color').default('#ffffff'),
  number: integer('number').default(999),
  isHidden: boolean('isHidden').default(false),
  typeId: text('typeId').references(() => productTypes.id),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const productImages = pgTable('ProductImage', {
  id: text('id').primaryKey(),
  productId: text('productId').references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const categories = pgTable('Category', {
  id: text('id').primaryKey(),
  nameEn: text('nameEn').notNull(),
  nameAr: text('nameAr').notNull(),
  descriptionEn: text('descriptionEn'),
  descriptionAr: text('descriptionAr'),
  image: text('image'),
  imageEn: text('imageEn'),
  number: integer('number').default(999),
  isHidden: boolean('isHidden').default(false),
  brandId: text('brandId').references(() => brands.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const categoryProducts = pgTable('CategoryProduct', {
  id: text('id').primaryKey(),
  categoryId: text('categoryId').references(() => categories.id, { onDelete: 'cascade' }),
  productId: text('productId').references(() => products.id, { onDelete: 'cascade' }),
  isHidden: boolean('isHidden').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const productTypes = pgTable('ProductType', {
  id: text('id').primaryKey(),
  nameEn: text('nameEn').notNull(),
  nameAr: text('nameAr').notNull(),
  number: integer('number').default(999),
  brandId: text('brandId').references(() => brands.id),
  isHidden: boolean('isHidden').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const recipes = pgTable('Recipe', {
  id: text('id').primaryKey(),
  nameEn: text('nameEn'),
  nameAr: text('nameAr'),
  descriptionEn: text('descriptionEn'),
  descriptionAr: text('descriptionAr'),
  videoLink: text('videoLink'),
  internalImage: text('internalImage'),
  number: integer('number').default(999),
  isHidden: boolean('isHidden').default(false),
  tagAr: text('tagAr'),
  tagEn: text('tagEn'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const recipeImages = pgTable('RecipeImage', {
  id: text('id').primaryKey(),
  recipeId: text('recipeId').references(() => recipes.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const recipeCategories = pgTable('RecipeCategory', {
  id: text('id').primaryKey(),
  nameEn: text('nameEn').notNull(),
  nameAr: text('nameAr').notNull(),
  image: text('image'),
  number: integer('number').default(999),
  isHidden: boolean('isHidden').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const banners = pgTable('Banner', {
  id: text('id').primaryKey(),
  titleEn: text('titleEn').notNull(),
  titleAr: text('titleAr').notNull(),
  type: bannerTypeEnum('type').default('image'),
  image: text('image'),
  imageEn: text('imageEn'),
  videoLink: text('videoLink'),
  videoLinkEn: text('videoLinkEn'),
  smallImg: text('smallImg'),
  smallImgEn: text('smallImgEn'),
  smallVideo: text('smallVideo'),
  smallVideoEn: text('smallVideoEn'),
  number: integer('number').default(999),
  isHidden: boolean('isHidden').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const certificates = pgTable('Certificate', {
  id: text('id').primaryKey(),
  image: text('image').notNull(),
  isHidden: boolean('isHidden').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const siteSettings = pgTable('SiteSetting', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  valueEn: text('valueEn'),
  valueAr: text('valueAr'),
  description: text('description'),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// Relationships






export const foods = pgTable('Food', {
  id: text('id').primaryKey(),
  nameEn: text('nameEn'),
  nameAr: text('nameAr'),
  image: text('image'),
  number: integer('number').default(999),
  brandId: text('brandId').references(() => brands.id),
  isHidden: boolean('isHidden').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const recipeFoods = pgTable('RecipeFood', {
  id: text('id').primaryKey(),
  recipeId: text('recipeId').references(() => recipes.id, { onDelete: 'cascade' }),
  foodId: text('foodId').references(() => foods.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const recipeCategoryFoods = pgTable('RecipeCategoryFood', {
  id: text('id').primaryKey(),
  recipeCategoryId: text('recipeCategoryId').references(() => recipeCategories.id, { onDelete: 'cascade' }),
  foodId: text('foodId').references(() => foods.id, { onDelete: 'cascade' }),
});



export const recipeProperties = pgTable('RecipeProperty', {
  id: text('id').primaryKey(),
  recipeId: text('recipeId').references(() => recipes.id, { onDelete: 'cascade' }),
  icon: text('icon'),
  titleEn: text('titleEn').notNull(),
  titleAr: text('titleAr').notNull(),
  textEn: text('textEn').notNull(),
  textAr: text('textAr').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const recipeSteps = pgTable('RecipeStep', {
  id: text('id').primaryKey(),
  recipeId: text('recipeId').references(() => recipes.id, { onDelete: 'cascade' }),
  stepEn: text('stepEn').notNull(),
  stepAr: text('stepAr').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});



export const recommendedRecipes = pgTable('RecommendedRecipe', {
  id: text('id').primaryKey(),
  productId: text('productId').references(() => products.id, { onDelete: 'cascade' }),
  recipeId: text('recipeId').references(() => recipes.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});


export const categoryTypes = pgTable('CategoryType', {
  id: text('id').primaryKey(),
  titleEn: text('titleEn').notNull(),
  titleAr: text('titleAr').notNull(),
  descriptionEn: text('descriptionEn'),
  descriptionAr: text('descriptionAr'),
  image: text('image'),
  number: integer('number').default(999),
  isHidden: boolean('isHidden').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const categoryTypeCategories = pgTable('CategoryTypeCategory', {
  id: text('id').primaryKey(),
  categoryId: text('categoryId').references(() => categories.id, { onDelete: 'cascade' }),
  categoryTypeId: text('categoryTypeId').references(() => categoryTypes.id, { onDelete: 'cascade' }),
  image: text('image'),
  number: integer('number').default(999),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});


export const aboutSections = pgTable('SectionText', {
  id: text('id').primaryKey(),
  titleEn: text('titleEn').notNull(),
  titleAr: text('titleAr').notNull(),
  textEn: text('textEn').notNull(),
  textAr: text('textAr').notNull(),
  number: integer('number').default(999),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const aboutBuildings = pgTable('Building', {
  id: text('id').primaryKey(),
  titleEn: text('titleEn').notNull(),
  titleAr: text('titleAr').notNull(),
  descriptionEn: text('descriptionEn'),
  descriptionAr: text('descriptionAr'),
  image: text('image'),
  isHidden: boolean('isHidden').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const aboutProductionSteps = pgTable('ProductionStep', {
  id: text('id').primaryKey(),
  textEn: text('textEn').notNull(),
  textAr: text('textAr').notNull(),
  image: text('image'),
  number: integer('number').default(999),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const aboutFeatures = pgTable('Feature', {
  id: text('id').primaryKey(),
  titleEn: text('titleEn').notNull(),
  titleAr: text('titleAr').notNull(),
  descriptionEn: text('descriptionEn'),
  descriptionAr: text('descriptionAr'),
  image: text('image'),
  isHidden: boolean('isHidden').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});
export const certificateValues = pgTable('Value', {
  id: text('id').primaryKey(),
  titleEn: text('titleEn').notNull(),
  titleAr: text('titleAr').notNull(),
  descriptionEn: text('descriptionEn'),
  descriptionAr: text('descriptionAr'),
  image: text('image'),
  number: integer('number').default(999),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});
export const socialParents = pgTable('SocialParent', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  image: text('image'),
  number: integer('number').default(999),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const socials = pgTable('Social', {
  id: text('id').primaryKey(),
  parentId: text('parentId').references(() => socialParents.id),
  name: text('name').notNull(),
  image: text('image'),
  link: text('link'),
  number: integer('number').default(999),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});
export const contacts = pgTable('Contact', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  typeInquiry: text('typeInquiry').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const exportContinents = pgTable('ExportContinent', {
  id: text('id').primaryKey(),
  nameEn: text('nameEn').notNull(),
  nameAr: text('nameAr').notNull(),
  hidden: integer('hidden').default(0),
  number: integer('number').default(999),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const exportStandards = pgTable('ExportStandard', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  descriptionEn: text('descriptionEn'),
  descriptionAr: text('descriptionAr'),
  image: text('image'),
  number: integer('number').default(999),
  createdAt: timestamp('createdAt').defaultNow(),
});
export const collaborates = pgTable('Collaborate', {
  id: text('id').primaryKey(),
  firstName: text('firstName').notNull(),
  lastName: text('lastName').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  position: text('position'),
  request: text('request').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});

// Relations
export const productRelations = relations(products, ({ many, one }) => ({
  images: many(productImages),
  categories: many(categoryProducts),
  type: one(productTypes, {
    fields: [products.typeId],
    references: [productTypes.id],
  }),
  recommendedRecipes: many(recommendedRecipes),
}));
export const productImageRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));
export const recipeRelations = relations(recipes, ({ many }) => ({
  images: many(recipeImages),
  foods: many(recipeFoods),
  properties: many(recipeProperties),
  steps: many(recipeSteps),
  recommendedWith: many(recommendedRecipes),
}));
export const recipeImageRelations = relations(recipeImages, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeImages.recipeId],
    references: [recipes.id],
  }),
}));
export const brandRelations = relations(brands, ({ many }) => ({
  categories: many(categories),
  productTypes: many(productTypes),
}));
export const categoryRelations = relations(categories, ({ one, many }) => ({
  brand: one(brands, {
    fields: [categories.brandId],
    references: [brands.id],
  }),
  products: many(categoryProducts),
}));
export const categoryProductRelations = relations(categoryProducts, ({ one }) => ({
  product: one(products, {
    fields: [categoryProducts.productId],
    references: [products.id],
  }),
  category: one(categories, {
    fields: [categoryProducts.categoryId],
    references: [categories.id],
  }),
}));
export const foodRelations = relations(foods, ({ many }) => ({
  recipes: many(recipeFoods),
  recipeCategories: many(recipeCategoryFoods),
}));
export const recipeFoodRelations = relations(recipeFoods, ({ one }) => ({
  recipe: one(recipes, { fields: [recipeFoods.recipeId], references: [recipes.id] }),
  food: one(foods, { fields: [recipeFoods.foodId], references: [foods.id] }),
}));
export const recipeCategoryFoodRelations = relations(recipeCategoryFoods, ({ one }) => ({
  recipeCategory: one(recipeCategories, { fields: [recipeCategoryFoods.recipeCategoryId], references: [recipeCategories.id] }),
  food: one(foods, { fields: [recipeCategoryFoods.foodId], references: [foods.id] }),
}));
export const recipeCategoryRelations = relations(recipeCategories, ({ many }) => ({
  foods: many(recipeCategoryFoods),
}));
export const recipePropertyRelations = relations(recipeProperties, ({ one }) => ({
  recipe: one(recipes, { fields: [recipeProperties.recipeId], references: [recipes.id] }),
}));
export const recipeStepRelations = relations(recipeSteps, ({ one }) => ({
  recipe: one(recipes, { fields: [recipeSteps.recipeId], references: [recipes.id] }),
}));
export const recommendedRecipeRelations = relations(recommendedRecipes, ({ one }) => ({
  product: one(products, { fields: [recommendedRecipes.productId], references: [products.id] }),
  recipe: one(recipes, { fields: [recommendedRecipes.recipeId], references: [recipes.id] }),
}));
export const categoryTypeRelations = relations(categoryTypes, ({ many }) => ({
  categories: many(categoryTypeCategories),
}));
export const categoryTypeCategoryRelations = relations(categoryTypeCategories, ({ one }) => ({
  category: one(categories, { fields: [categoryTypeCategories.categoryId], references: [categories.id] }),
  categoryType: one(categoryTypes, { fields: [categoryTypeCategories.categoryTypeId], references: [categoryTypes.id] }),
}));
export const socialParentsRelations = relations(socialParents, ({ many }) => ({
  socials: many(socials),
}));
export const socialsRelations = relations(socials, ({ one }) => ({
  parent: one(socialParents, {
    fields: [socials.parentId],
    references: [socialParents.id],
  }),
}));