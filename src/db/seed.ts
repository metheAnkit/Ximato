import "dotenv/config";
import { categories, ensureIndexes, menuItems } from "./index";

const img = {
  pizza1: "https://images.pexels.com/photos/17932142/pexels-photo-17932142.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  pizza2: "https://images.pexels.com/photos/9685234/pexels-photo-9685234.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  pizza3: "https://images.pexels.com/photos/8471699/pexels-photo-8471699.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  pizza4: "https://images.pexels.com/photos/34675725/pexels-photo-34675725.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  burger1: "https://images.pexels.com/photos/7479003/pexels-photo-7479003.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  burger2: "https://images.pexels.com/photos/3504876/pexels-photo-3504876.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  burger3: "https://images.pexels.com/photos/17095274/pexels-photo-17095274.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  burger4: "https://images.pexels.com/photos/7479006/pexels-photo-7479006.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  sushi1: "https://images.pexels.com/photos/15433933/pexels-photo-15433933.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  sushi2: "https://images.pexels.com/photos/37260671/pexels-photo-37260671.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  sushi3: "https://images.pexels.com/photos/38485707/pexels-photo-38485707.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  pasta1: "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  pasta2: "https://images.pexels.com/photos/37726976/pexels-photo-37726976.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  pasta3: "https://images.pexels.com/photos/3214160/pexels-photo-3214160.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  salad1: "https://images.pexels.com/photos/842545/pexels-photo-842545.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  salad2: "https://images.pexels.com/photos/2291344/pexels-photo-2291344.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  salad3: "https://images.pexels.com/photos/13630358/pexels-photo-13630358.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  indian1: "https://images.pexels.com/photos/28674660/pexels-photo-28674660.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  indian2: "https://images.pexels.com/photos/4439740/pexels-photo-4439740.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  indian3: "https://images.pexels.com/photos/35267280/pexels-photo-35267280.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  indian4: "https://images.pexels.com/photos/37883423/pexels-photo-37883423.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  dessert1: "https://images.pexels.com/photos/12927134/pexels-photo-12927134.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  dessert2: "https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  dessert3: "https://images.pexels.com/photos/9501658/pexels-photo-9501658.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  dessert4: "https://images.pexels.com/photos/3740237/pexels-photo-3740237.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  drink1: "https://images.pexels.com/photos/7690452/pexels-photo-7690452.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  drink2: "https://images.pexels.com/photos/2693404/pexels-photo-2693404.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  drink3: "https://images.pexels.com/photos/8394976/pexels-photo-8394976.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
};

const categoryData = [
  { name: "Pizza", slug: "pizza", emoji: "🍕", sortOrder: 1, description: "Hand-stretched dough, wood-fired to order." },
  { name: "Burgers", slug: "burgers", emoji: "🍔", sortOrder: 2, description: "Juicy patties stacked high with the good stuff." },
  { name: "Sushi & Bowls", slug: "sushi", emoji: "🍣", sortOrder: 3, description: "Fresh rolls and vibrant rice bowls." },
  { name: "Pasta", slug: "pasta", emoji: "🍝", sortOrder: 4, description: "Comforting Italian classics, al dente." },
  { name: "Salads", slug: "salads", emoji: "🥗", sortOrder: 5, description: "Crisp, colorful and full of crunch." },
  { name: "Indian Mains", slug: "indian", emoji: "🍛", sortOrder: 6, description: "Rich curries and fragrant biryanis." },
  { name: "Desserts", slug: "desserts", emoji: "🍰", sortOrder: 7, description: "Something sweet to finish it off." },
  { name: "Drinks & Shakes", slug: "drinks", emoji: "🥤", sortOrder: 8, description: "Ice-cold refreshments and creamy shakes." },
];

type ItemSeed = {
  categorySlug: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  imageUrl: string;
  emoji: string;
  isVegetarian: boolean;
  prepTimeMinutes: number;
  isFeatured?: boolean;
};

const itemData: ItemSeed[] = [
  { categorySlug: "pizza", name: "Margherita Pizza", slug: "margherita-pizza", description: "San Marzano tomato, fresh mozzarella and basil on a blistered crust.", price: "12.99", imageUrl: img.pizza1, emoji: "🍕", isVegetarian: true, prepTimeMinutes: 18, isFeatured: true },
  { categorySlug: "pizza", name: "Pepperoni Classic", slug: "pepperoni-classic", description: "Crispy pepperoni cups, mozzarella and oregano.", price: "14.99", imageUrl: img.pizza2, emoji: "🍕", isVegetarian: false, prepTimeMinutes: 20 },
  { categorySlug: "pizza", name: "BBQ Chicken Pizza", slug: "bbq-chicken-pizza", description: "Smoky BBQ sauce, grilled chicken, red onion and cilantro.", price: "15.99", imageUrl: img.pizza3, emoji: "🍕", isVegetarian: false, prepTimeMinutes: 22 },
  { categorySlug: "pizza", name: "Veggie Supreme", slug: "veggie-supreme", description: "Peppers, mushrooms, olives, red onion and artichoke.", price: "13.99", imageUrl: img.pizza4, emoji: "🍕", isVegetarian: true, prepTimeMinutes: 20 },
  { categorySlug: "burgers", name: "Classic Cheeseburger", slug: "classic-cheeseburger", description: "Smash patty, American cheese, pickles and house sauce.", price: "11.99", imageUrl: img.burger1, emoji: "🍔", isVegetarian: false, prepTimeMinutes: 15 },
  { categorySlug: "burgers", name: "Double Bacon Smash", slug: "double-bacon-smash", description: "Two smashed patties, bacon, cheddar and caramelized onion.", price: "13.99", imageUrl: img.burger2, emoji: "🍔", isVegetarian: false, prepTimeMinutes: 18, isFeatured: true },
  { categorySlug: "burgers", name: "Crispy Chicken Burger", slug: "crispy-chicken-burger", description: "Buttermilk fried chicken, slaw and spicy mayo.", price: "12.49", imageUrl: img.burger3, emoji: "🍔", isVegetarian: false, prepTimeMinutes: 16 },
  { categorySlug: "burgers", name: "Plant-Based Burger", slug: "plant-based-burger", description: "Grilled plant patty, vegan cheese, lettuce and tomato.", price: "12.99", imageUrl: img.burger4, emoji: "🍔", isVegetarian: true, prepTimeMinutes: 15 },
  { categorySlug: "sushi", name: "California Roll (8pc)", slug: "california-roll", description: "Crab, avocado and cucumber rolled in sushi rice.", price: "10.99", imageUrl: img.sushi1, emoji: "🍣", isVegetarian: false, prepTimeMinutes: 15 },
  { categorySlug: "sushi", name: "Salmon Nigiri Set", slug: "salmon-nigiri-set", description: "Six pieces of fresh salmon nigiri with wasabi.", price: "14.99", imageUrl: img.sushi2, emoji: "🍣", isVegetarian: false, prepTimeMinutes: 15 },
  { categorySlug: "sushi", name: "Veggie Rainbow Roll", slug: "veggie-rainbow-roll", description: "Avocado, cucumber and mango with sesame.", price: "11.49", imageUrl: img.sushi3, emoji: "🍣", isVegetarian: true, prepTimeMinutes: 18 },
  { categorySlug: "pasta", name: "Fettuccine Alfredo", slug: "fettuccine-alfredo", description: "Silky parmesan cream sauce with fresh fettuccine.", price: "13.99", imageUrl: img.pasta1, emoji: "🍝", isVegetarian: true, prepTimeMinutes: 18, isFeatured: true },
  { categorySlug: "pasta", name: "Spaghetti Bolognese", slug: "spaghetti-bolognese", description: "Slow-simmered beef and tomato ragù.", price: "14.49", imageUrl: img.pasta2, emoji: "🍝", isVegetarian: false, prepTimeMinutes: 20 },
  { categorySlug: "pasta", name: "Penne Arrabbiata", slug: "penne-arrabbiata", description: "Spicy tomato, garlic and chili flakes.", price: "11.99", imageUrl: img.pasta3, emoji: "🍝", isVegetarian: true, prepTimeMinutes: 16 },
  { categorySlug: "salads", name: "Caesar Salad", slug: "caesar-salad", description: "Romaine, shaved parmesan, croutons and Caesar dressing.", price: "9.99", imageUrl: img.salad1, emoji: "🥗", isVegetarian: false, prepTimeMinutes: 10 },
  { categorySlug: "salads", name: "Greek Garden Salad", slug: "greek-garden-salad", description: "Tomato, cucumber, olives, feta and oregano vinaigrette.", price: "9.49", imageUrl: img.salad2, emoji: "🥗", isVegetarian: true, prepTimeMinutes: 10 },
  { categorySlug: "salads", name: "Grilled Chicken Cobb", slug: "grilled-chicken-cobb", description: "Grilled chicken, egg, avocado, bacon and blue cheese.", price: "12.49", imageUrl: img.salad3, emoji: "🥗", isVegetarian: false, prepTimeMinutes: 12 },
  { categorySlug: "indian", name: "Chicken Biryani", slug: "chicken-biryani", description: "Fragrant basmati layered with spiced chicken.", price: "14.99", imageUrl: img.indian1, emoji: "🍛", isVegetarian: false, prepTimeMinutes: 25, isFeatured: true },
  { categorySlug: "indian", name: "Paneer Tikka Masala", slug: "paneer-tikka-masala", description: "Charred paneer in a creamy tomato masala.", price: "13.99", imageUrl: img.indian2, emoji: "🍛", isVegetarian: true, prepTimeMinutes: 22 },
  { categorySlug: "indian", name: "Butter Chicken", slug: "butter-chicken", description: "Tandoori chicken in a rich, buttery tomato gravy.", price: "15.99", imageUrl: img.indian3, emoji: "🍛", isVegetarian: false, prepTimeMinutes: 25 },
  { categorySlug: "indian", name: "Dal Makhani", slug: "dal-makhani", description: "Black lentils simmered overnight with butter and cream.", price: "11.99", imageUrl: img.indian4, emoji: "🍛", isVegetarian: true, prepTimeMinutes: 20 },
  { categorySlug: "desserts", name: "Berry Cheesecake", slug: "berry-cheesecake", description: "Baked cheesecake topped with fresh berries.", price: "8.99", imageUrl: img.dessert1, emoji: "🍰", isVegetarian: true, prepTimeMinutes: 12 },
  { categorySlug: "desserts", name: "Molten Chocolate Cake", slug: "molten-chocolate-cake", description: "Warm chocolate cake with a gooey center.", price: "7.99", imageUrl: img.dessert2, emoji: "🍰", isVegetarian: true, prepTimeMinutes: 12, isFeatured: true },
  { categorySlug: "desserts", name: "Salted Caramel Brownie", slug: "salted-caramel-brownie", description: "Fudgy brownie drizzled with salted caramel.", price: "6.99", imageUrl: img.dessert3, emoji: "🍰", isVegetarian: true, prepTimeMinutes: 12 },
  { categorySlug: "desserts", name: "Chocolate Truffle Slice", slug: "chocolate-truffle-slice", description: "Layered chocolate cake with a silky ganache.", price: "8.49", imageUrl: img.dessert4, emoji: "🍰", isVegetarian: true, prepTimeMinutes: 12 },
  { categorySlug: "drinks", name: "Strawberry Milkshake", slug: "strawberry-milkshake", description: "Real strawberries blended with vanilla ice cream.", price: "5.99", imageUrl: img.drink1, emoji: "🥤", isVegetarian: true, prepTimeMinutes: 5 },
  { categorySlug: "drinks", name: "Mango Lassi", slug: "mango-lassi", description: "Sweet mango blended with creamy yogurt.", price: "4.99", imageUrl: img.drink2, emoji: "🥤", isVegetarian: true, prepTimeMinutes: 5 },
  { categorySlug: "drinks", name: "Mixed Berry Smoothie", slug: "mixed-berry-smoothie", description: "Strawberry, blueberry and raspberry, chilled.", price: "5.49", imageUrl: img.drink3, emoji: "🥤", isVegetarian: true, prepTimeMinutes: 5 },
];

async function main() {
  console.log("Seeding database…");
  await ensureIndexes();
  await categories.deleteMany({});
  await menuItems.deleteMany({});
  await categories.insertMany(categoryData.map((category, index) => ({
    ...category,
    id: index + 1,
    description: category.description ?? null,
    createdAt: new Date(),
  })));
  const catRows = await categories.find({}, { projection: { id: 1, slug: 1 } }).toArray();
  const idBySlug = new Map(catRows.map((c) => [c.slug, c.id]));

  await menuItems.insertMany(
    itemData.map(({ categorySlug, isFeatured, ...rest }, index) => ({
      ...rest,
      isFeatured: isFeatured ?? false,
      categoryId: idBySlug.get(categorySlug)!,
      id: index + 1,
      price: Number(rest.price),
      description: rest.description ?? null,
      imageUrl: rest.imageUrl ?? null,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  );

  console.log(`Seeded ${categoryData.length} categories and ${itemData.length} menu items.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
