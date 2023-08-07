import type { Meta, StoryObj } from '@storybook/react';

import { RecipeList } from './recipe-list';
import { RecipeListItem } from '../recipe-list-item/recipe-list-item';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'UI/RecipeList',
  component: RecipeList,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],

} satisfies Meta<typeof RecipeList>;


export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    children: [
      <RecipeListItem href='/' title='Recipe 1' />,
      <RecipeListItem href='/' title='Recipe 2' />,
      <RecipeListItem href='/' title='Recipe 3' />,
      <RecipeListItem href='/' title='Recipe 4' />,
    ]
  },
};
