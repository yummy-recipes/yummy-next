import { type ReactNode } from "react";
import preview from "../../../.storybook/preview";

const meta = preview.meta({
  title: "UI/RecipeList",
  component: RecipeList,
  tags: ["autodocs"],
});

import { RecipeList } from "./recipe-list";
import { RecipeListItem } from "../recipe-list-item/recipe-list-item";

const imageUrl =
  "https://res.cloudinary.com/dddjfvneq/image/fetch/f_auto,c_limit,w_800,q_auto/https://media.graphassets.com/bVmSWqhQOuOiBenDcvQO";

export default meta;

export const Primary = meta.story({
  args: {
    children: [
      <RecipeListItem
        key={1}
        href="/"
        title="Recipe 1"
        coverImage={imageUrl}
      />,
      <RecipeListItem
        key={2}
        href="/"
        title="Recipe 2"
        coverImage={imageUrl}
      />,
      <RecipeListItem
        key={3}
        href="/"
        title="Recipe 3"
        coverImage={imageUrl}
      />,
      <RecipeListItem
        key={4}
        href="/"
        title="Recipe 4"
        coverImage={imageUrl}
      />,
    ],
  },
});
