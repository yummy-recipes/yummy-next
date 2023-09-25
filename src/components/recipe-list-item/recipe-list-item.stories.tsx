import type { Meta, StoryObj } from '@storybook/react';

import { RecipeListItem } from './recipe-list-item';

const imageUrl = 'https://res.cloudinary.com/dddjfvneq/image/fetch/f_auto,c_limit,w_800,q_auto/https://media.graphassets.com/bVmSWqhQOuOiBenDcvQO'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'UI/RecipeListItem',
  component: RecipeListItem,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],

} satisfies Meta<typeof RecipeListItem>;


export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    href: '/',
    title: 'Spaghetti',
    coverImage: imageUrl,
  },
};
