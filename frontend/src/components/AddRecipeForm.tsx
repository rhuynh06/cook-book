import { useState } from 'react';
import {
  TextInput,
  NumberInput,
  Select,
  Checkbox,
  Textarea,
  Button,
  Group,
  Stack,
} from '@mantine/core';
import { api } from '../services/api';
import { cuisineOptions } from '../types/recipe';

type MealTime = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

interface AddRecipeFormProps {
  onAdded?: () => void;
}

export function AddRecipeForm({ onAdded }: AddRecipeFormProps) {
  const [form, setForm] = useState({
    name: '',
    price: 0,
    cuisine: '',
    prepTime: 0,
    mealTime: 'LUNCH' as MealTime,
    isVegan: false,
    isVegetarian: false,
    ingredients: '',
    instructions: '',
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addRecipe({
        ...form,
        ingredients: form.ingredients.split(',').map(i => i.trim()),
      });
      // alert('Recipe added!');
      setForm({
        name: '',
        price: 0,
        cuisine: '',
        prepTime: 0,
        mealTime: 'LUNCH',
        isVegan: false,
        isVegetarian: false,
        ingredients: '',
        instructions: '',
      });
      onAdded?.(); // Notify parent to reload recipes and close modal
    } catch (err) {
      console.error(err);
      alert('Failed to add recipe');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="sm">
        <TextInput
          label="Recipe Name"
          placeholder="e.g. Tofu Tacos"
          value={form.name}
          onChange={e => handleChange('name', e.currentTarget.value)}
          required
        />

        <Select
          label="Cuisine"
          placeholder="Select a cuisine"
          value={form.cuisine}
          onChange={val => handleChange('cuisine', val)}
          data={cuisineOptions}
          searchable
          clearable
          required
        />

        <NumberInput
          label="Price ($)"
          value={form.price}
          onChange={val => handleChange('price', val ?? 0)}
          min={0}
          required
        />

        <NumberInput
          label="Prep Time (minutes)"
          value={form.prepTime}
          onChange={val => handleChange('prepTime', val ?? 0)}
          min={0}
          required
        />

        <Select
          label="Meal Time"
          value={form.mealTime}
          onChange={val => handleChange('mealTime', val as MealTime)}
          data={['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']}
          required
        />

        <Group gap="md">
          <Checkbox
            label="Vegan"
            checked={form.isVegan}
            onChange={e => handleChange('isVegan', e.currentTarget.checked)}
          />
          <Checkbox
            label="Vegetarian"
            checked={form.isVegetarian}
            onChange={e => handleChange('isVegetarian', e.currentTarget.checked)}
          />
        </Group>

        <Textarea
          label="Ingredients (comma-separated)"
          placeholder="e.g. tofu, lettuce, tomato"
          value={form.ingredients}
          onChange={e => handleChange('ingredients', e.currentTarget.value)}
          autosize
          required
        />

        <Textarea
          label="Instructions"
          placeholder="Step-by-step preparation instructions"
          value={form.instructions}
          onChange={e => handleChange('instructions', e.currentTarget.value)}
          autosize
          minRows={4}
          required
        />

        <Button type="submit" fullWidth>
          Add Recipe
        </Button>
      </Stack>
    </form>
  );
}