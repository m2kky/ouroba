CREATE TYPE "public"."BannerType" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."OrderStatus" AS ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."RequestStatus" AS ENUM('UNREAD', 'READ', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."Role" AS ENUM('USER', 'ADMIN', 'EDITOR');--> statement-breakpoint
CREATE TABLE "AboutBuilding" (
	"id" text PRIMARY KEY NOT NULL,
	"titleEn" text NOT NULL,
	"titleAr" text NOT NULL,
	"descriptionEn" text,
	"descriptionAr" text,
	"image" text,
	"number" integer DEFAULT 999,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "AboutFeature" (
	"id" text PRIMARY KEY NOT NULL,
	"titleEn" text NOT NULL,
	"titleAr" text NOT NULL,
	"descriptionEn" text,
	"descriptionAr" text,
	"image" text,
	"number" integer DEFAULT 999,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "AboutProductionStep" (
	"id" text PRIMARY KEY NOT NULL,
	"textEn" text NOT NULL,
	"textAr" text NOT NULL,
	"image" text,
	"number" integer DEFAULT 999,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "AboutSection" (
	"id" text PRIMARY KEY NOT NULL,
	"titleEn" text NOT NULL,
	"titleAr" text NOT NULL,
	"textEn" text NOT NULL,
	"textAr" text NOT NULL,
	"number" integer DEFAULT 999,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Banner" (
	"id" text PRIMARY KEY NOT NULL,
	"titleEn" text NOT NULL,
	"titleAr" text NOT NULL,
	"type" "BannerType" DEFAULT 'image',
	"image" text,
	"imageEn" text,
	"videoLink" text,
	"videoLinkEn" text,
	"smallImg" text,
	"smallImgEn" text,
	"smallVideo" text,
	"smallVideoEn" text,
	"number" integer DEFAULT 999,
	"isHidden" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Brand" (
	"id" text PRIMARY KEY NOT NULL,
	"nameEn" text NOT NULL,
	"nameAr" text NOT NULL,
	"number" integer DEFAULT 999,
	"image" text,
	"imageMain" text,
	"imageSmall" text,
	"imageSmallMain" text,
	"colorBrand" text,
	"colorHover" text,
	"descriptionEn" text,
	"descriptionAr" text,
	"brandTextEn" text,
	"brandTextAr" text,
	"videoUrl" text,
	"videoUrlEn" text,
	"isHidden" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Category" (
	"id" text PRIMARY KEY NOT NULL,
	"nameEn" text NOT NULL,
	"nameAr" text NOT NULL,
	"descriptionEn" text,
	"descriptionAr" text,
	"image" text,
	"imageEn" text,
	"number" integer DEFAULT 999,
	"isHidden" boolean DEFAULT false,
	"brandId" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "CategoryProduct" (
	"id" text PRIMARY KEY NOT NULL,
	"categoryId" text,
	"productId" text,
	"isHidden" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "CategoryTypeCategory" (
	"id" text PRIMARY KEY NOT NULL,
	"categoryId" text,
	"categoryTypeId" text,
	"image" text,
	"number" integer DEFAULT 999,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "CategoryType" (
	"id" text PRIMARY KEY NOT NULL,
	"titleEn" text NOT NULL,
	"titleAr" text NOT NULL,
	"descriptionEn" text,
	"descriptionAr" text,
	"image" text,
	"number" integer DEFAULT 999,
	"isHidden" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Certificate" (
	"id" text PRIMARY KEY NOT NULL,
	"image" text NOT NULL,
	"isHidden" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Food" (
	"id" text PRIMARY KEY NOT NULL,
	"nameEn" text,
	"nameAr" text,
	"image" text,
	"number" integer DEFAULT 999,
	"brandId" text,
	"isHidden" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ProductImage" (
	"id" text PRIMARY KEY NOT NULL,
	"productId" text,
	"url" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ProductType" (
	"id" text PRIMARY KEY NOT NULL,
	"nameEn" text NOT NULL,
	"nameAr" text NOT NULL,
	"number" integer DEFAULT 999,
	"brandId" text,
	"isHidden" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Product" (
	"id" text PRIMARY KEY NOT NULL,
	"nameEn" text NOT NULL,
	"nameAr" text NOT NULL,
	"descriptionEn" text,
	"descriptionAr" text,
	"color" text DEFAULT '#ffffff',
	"number" integer DEFAULT 999,
	"isHidden" boolean DEFAULT false,
	"typeId" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "RecipeCategory" (
	"id" text PRIMARY KEY NOT NULL,
	"nameEn" text NOT NULL,
	"nameAr" text NOT NULL,
	"image" text,
	"number" integer DEFAULT 999,
	"isHidden" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "RecipeCategoryFood" (
	"id" text PRIMARY KEY NOT NULL,
	"recipeCategoryId" text,
	"foodId" text
);
--> statement-breakpoint
CREATE TABLE "RecipeFood" (
	"id" text PRIMARY KEY NOT NULL,
	"recipeId" text,
	"foodId" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "RecipeImage" (
	"id" text PRIMARY KEY NOT NULL,
	"recipeId" text,
	"url" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "RecipeProperty" (
	"id" text PRIMARY KEY NOT NULL,
	"recipeId" text,
	"icon" text,
	"titleEn" text NOT NULL,
	"titleAr" text NOT NULL,
	"textEn" text NOT NULL,
	"textAr" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "RecipeStep" (
	"id" text PRIMARY KEY NOT NULL,
	"recipeId" text,
	"stepEn" text NOT NULL,
	"stepAr" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Recipe" (
	"id" text PRIMARY KEY NOT NULL,
	"nameEn" text,
	"nameAr" text,
	"descriptionEn" text,
	"descriptionAr" text,
	"videoLink" text,
	"internalImage" text,
	"number" integer DEFAULT 999,
	"isHidden" boolean DEFAULT false,
	"tagAr" text,
	"tagEn" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "SiteSetting" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"valueEn" text,
	"valueAr" text,
	"description" text,
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "SiteSetting_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	"password" text,
	"phone" text,
	"role" "Role" DEFAULT 'USER',
	"permissions" text[],
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "Category" ADD CONSTRAINT "Category_brandId_Brand_id_fk" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CategoryProduct" ADD CONSTRAINT "CategoryProduct_categoryId_Category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CategoryProduct" ADD CONSTRAINT "CategoryProduct_productId_Product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CategoryTypeCategory" ADD CONSTRAINT "CategoryTypeCategory_categoryId_Category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CategoryTypeCategory" ADD CONSTRAINT "CategoryTypeCategory_categoryTypeId_CategoryType_id_fk" FOREIGN KEY ("categoryTypeId") REFERENCES "public"."CategoryType"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Food" ADD CONSTRAINT "Food_brandId_Brand_id_fk" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_Product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProductType" ADD CONSTRAINT "ProductType_brandId_Brand_id_fk" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Product" ADD CONSTRAINT "Product_typeId_ProductType_id_fk" FOREIGN KEY ("typeId") REFERENCES "public"."ProductType"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "RecipeCategoryFood" ADD CONSTRAINT "RecipeCategoryFood_recipeCategoryId_RecipeCategory_id_fk" FOREIGN KEY ("recipeCategoryId") REFERENCES "public"."RecipeCategory"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "RecipeCategoryFood" ADD CONSTRAINT "RecipeCategoryFood_foodId_Food_id_fk" FOREIGN KEY ("foodId") REFERENCES "public"."Food"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "RecipeFood" ADD CONSTRAINT "RecipeFood_recipeId_Recipe_id_fk" FOREIGN KEY ("recipeId") REFERENCES "public"."Recipe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "RecipeFood" ADD CONSTRAINT "RecipeFood_foodId_Food_id_fk" FOREIGN KEY ("foodId") REFERENCES "public"."Food"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "RecipeImage" ADD CONSTRAINT "RecipeImage_recipeId_Recipe_id_fk" FOREIGN KEY ("recipeId") REFERENCES "public"."Recipe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "RecipeProperty" ADD CONSTRAINT "RecipeProperty_recipeId_Recipe_id_fk" FOREIGN KEY ("recipeId") REFERENCES "public"."Recipe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "RecipeStep" ADD CONSTRAINT "RecipeStep_recipeId_Recipe_id_fk" FOREIGN KEY ("recipeId") REFERENCES "public"."Recipe"("id") ON DELETE cascade ON UPDATE no action;