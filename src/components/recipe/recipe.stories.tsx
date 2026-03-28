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
    ingredients:
      "<h2 class='text-2xl my-4'>Cake</h2><ul><li class='flex items-center gap-3 mb-2'><div class='w-1.5 h-1.5 bg-gray-300 rounded-full'></div>2 cups flour</li><li class='flex items-center gap-3 mb-2'><div class='w-1.5 h-1.5 bg-gray-300 rounded-full'></div>1 cup sugar</li><li class='flex items-center gap-3 mb-2'><div class='w-1.5 h-1.5 bg-gray-300 rounded-full'></div>3/4 cup cocoa powder</li><li class='flex items-center gap-3 mb-2'><div class='w-1.5 h-1.5 bg-gray-300 rounded-full'></div>2 eggs</li><li class='flex items-center gap-3 mb-2'><div class='w-1.5 h-1.5 bg-gray-300 rounded-full'></div>1 teaspoon baking powder</li><li class='flex items-center gap-3 mb-2'><div class='w-1.5 h-1.5 bg-gray-300 rounded-full'></div>1/2 cup butter</li></ul><h2 class='text-2xl my-4'>Frosting</h2><ul><li class='flex items-center gap-3 mb-2'><div class='w-1.5 h-1.5 bg-gray-300 rounded-full'></div>200 g dark chocolate</li><li class='flex items-center gap-3 mb-2'><div class='w-1.5 h-1.5 bg-gray-300 rounded-full'></div>100 ml cream</li><li class='flex items-center gap-3 mb-2'><div class='w-1.5 h-1.5 bg-gray-300 rounded-full'></div>2 tbsp butter</li></ul>",
    instructions:
      "<h2 class='text-2xl my-4'>Instructions</h2><div class='flex my-4'><span class='font-mono text-gray-400 mr-2'>01</span><p>Preheat oven to 350°F (175°C).</p></div><div class='flex my-4'><span class='font-mono text-gray-400 mr-2'>02</span><p>Mix all dry ingredients in a large bowl.</p></div><div class='flex my-4'><span class='font-mono text-gray-400 mr-2'>03</span><p>Add eggs and melted butter, mix well.</p></div><div class='flex my-4'><span class='font-mono text-gray-400 mr-2'>04</span><p>Pour into greased pan and bake for 30 minutes.</p></div><h2 class='text-2xl my-4'>Frosting</h2><div class='flex my-4'><span class='font-mono text-gray-400 mr-2'>01</span><p>Melt the chocolate gently.</p></div><div class='flex my-4'><span class='font-mono text-gray-400 mr-2'>02</span><p>Stir in the cream and butter until smooth.</p></div>",
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
