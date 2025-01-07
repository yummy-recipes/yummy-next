-- CreateTable
CREATE TABLE "RecipeGalleryImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "recipeId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "blurDataUrl" TEXT,
    "position" INTEGER NOT NULL,
    CONSTRAINT "RecipeGalleryImage_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
