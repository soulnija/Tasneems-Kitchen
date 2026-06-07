export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: 'Mains' | 'Snacks' | 'Desserts'
  image: string
  unit?: string
}

export const BUSINESS = {
  name: "Tasneem's Kitchen",
  whatsapp: '27123456789', // Replace with your WhatsApp number
}

export const MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Biryani',
    description: 'Fragrant rice with tender meat and aromatic spices',
    price: 120,
    category: 'Mains',
    image: 'https://raw.githubusercontent.com/soulnija/Tasneems-Kitchen/main/public/images/Unnamed.webp',
  },
  {
    id: '2',
    name: 'Bunny Chow',
    description: 'Hollowed bread loaf filled with curry',
    price: 85,
    category: 'Mains',
    image: 'https://raw.githubusercontent.com/soulnija/Tasneems-Kitchen/main/public/images/Unnamed(1).webp',
  },
  {
    id: '3',
    name: 'Samosa',
    description: 'Crispy pastry filled with spiced potatoes',
    price: 35,
    category: 'Snacks',
    image: 'https://raw.githubusercontent.com/soulnija/Tasneems-Kitchen/main/public/images/Unnamed(2).webp',
    unit: 'per piece',
  },
  {
    id: '4',
    name: 'Gulab Jamun',
    description: 'Soft milk dumplings soaked in rose syrup',
    price: 45,
    category: 'Desserts',
    image: 'https://raw.githubusercontent.com/soulnija/Tasneems-Kitchen/main/public/images/Unnamed(3).webp',
  },
  {
    id: '5',
    name: 'Kebab',
    description: 'Grilled meat skewers with spiced marinade',
    price: 95,
    category: 'Mains',
    image: 'https://raw.githubusercontent.com/soulnija/Tasneems-Kitchen/main/public/images/Unnamed(4).webp',
  },
  {
    id: '6',
    name: 'Dessert Special',
    description: 'Sweet treat to finish your meal',
    price: 50,
    category: 'Desserts',
    image: 'https://raw.githubusercontent.com/soulnija/Tasneems-Kitchen/main/public/images/Unnamed(5).webp',
  },
]