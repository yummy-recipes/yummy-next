import type { Meta, StoryObj } from "@storybook/nextjs";

import { RecipeListItem } from "./recipe-list-item";

const imageUrl =
  "https://res.cloudinary.com/dddjfvneq/image/fetch/f_auto,c_limit,w_800,q_auto/https://media.graphassets.com/bVmSWqhQOuOiBenDcvQO";

const meta = {
  title: "UI/RecipeListItem",
  component: RecipeListItem,
  tags: ["autodocs"],
} satisfies Meta<typeof RecipeListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    href: "/",
    title: "Spaghetti",
    coverImage: imageUrl,
  },
};
