import type { Meta, StoryObj } from '@storybook/react';
import { FractionVisual } from './FractionVisual';

const meta = {
  title: 'Features/Fraction/FractionVisual',
  component: FractionVisual,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    shapeType: {
      control: 'select',
      options: ['circle', 'rectangle'],
    },
  },
} satisfies Meta<typeof FractionVisual>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CircleProperFraction: Story = {
  args: {
    fraction: { numerator: 3, denominator: 4 },
    shapeType: 'circle',
  },
};

export const CircleImproperFraction: Story = {
  args: {
    fraction: { numerator: 7, denominator: 4 },
    shapeType: 'circle',
  },
};

export const CircleWholeNumber: Story = {
  args: {
    fraction: { numerator: 8, denominator: 4 },
    shapeType: 'circle',
  },
};

export const RectangleProperFraction: Story = {
  args: {
    fraction: { numerator: 2, denominator: 5 },
    shapeType: 'rectangle',
  },
};

export const RectangleImproperFraction: Story = {
  args: {
    fraction: { numerator: 11, denominator: 4 },
    shapeType: 'rectangle',
  },
};

export const LargeDenominator: Story = {
  args: {
    fraction: { numerator: 17, denominator: 8 },
    shapeType: 'circle',
  },
};
