import preview from "../../../.storybook/preview";

const meta = preview.meta({
  title: "UI/RecipeListItem",
  component: RecipeListItem,
  tags: ["autodocs"],
});

import { RecipeListItem } from "./recipe-list-item";

const imageUrl =
  "https://res.cloudinary.com/dddjfvneq/image/fetch/f_auto,c_limit,w_800,q_auto/https://media.graphassets.com/bVmSWqhQOuOiBenDcvQO";

export default meta;

export const Primary = meta.story({
  args: {
    href: "/",
    title: "Spaghetti",
    coverImage: imageUrl,
  },
});
