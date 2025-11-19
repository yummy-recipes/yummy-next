import preview from "../../../.storybook/preview";
import { Recipe } from "./recipe";

const meta = preview.meta({
  title: "UI/Recipe",
  component: Recipe,
  tags: ["autodocs"],
});

const imageUrl =
  "https://res.cloudinary.com/dddjfvneq/image/fetch/f_auto,c_limit,w_800,q_auto/https://media.graphassets.com/bVmSWqhQOuOiBenDcvQO";

export default meta;

export const Primary = meta.story({
  args: {
    slug: "example-recipe",
    categorySlug: "desserts",
    title: "Delicious Chocolate Cake",
    coverImage: imageUrl,
    coverImageBlurDataUrl: null,
    ingredients: [
      {
        id: 1,
        content:
          "## Ingredients\n\n- 2 cups flour\n- 1 cup sugar\n- 3/4 cup cocoa powder\n- 2 eggs\n- 1 teaspoon baking powder\n- 1/2 cup butter",
      },
    ],
    instructions: [
      {
        id: 1,
        content:
          "## Instructions\n\nPreheat oven to 350°F (175°C).\n\nMix all dry ingredients in a large bowl.\n\nAdd eggs and melted butter, mix well.\n\nPour into greased pan and bake for 30 minutes.",
      },
    ],
    galleryImages: [
      {
        id: 1,
        imageUrl: imageUrl,
        blurDataUrl: null,
      },
      {
        id: 2,
        imageUrl: imageUrl,
        blurDataUrl: null,
      },
    ],
  },
});
