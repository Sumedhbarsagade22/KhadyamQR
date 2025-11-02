// React import not needed with jsx runtime
import ScrollList from '@/components/ui/scroll-list';
import { motion } from 'framer-motion';

// Define the type for menu items
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

// Sample menu data - replace with your actual menu data
const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    image: '/images/margherita.jpg',
    category: 'Pizza'
  },
  {
    id: '2',
    name: 'Pasta Carbonara',
    description: 'Spaghetti with creamy egg sauce, pancetta, and parmesan',
    price: 14.99,
    image: '/images/carbonara.jpg',
    category: 'Pasta'
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, croutons, parmesan, with Caesar dressing',
    price: 9.99,
    image: '/images/caesar.jpg',
    category: 'Salad'
  },
  {
    id: '4',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
    price: 7.99,
    image: '/images/tiramisu.jpg',
    category: 'Dessert'
  },
  {
    id: '5',
    name: 'Grilled Salmon',
    description: 'Fresh salmon fillet with lemon butter sauce and seasonal vegetables',
    price: 18.99,
    image: '/images/salmon.jpg',
    category: 'Main Course'
  },
];

const MenuPage = () => {
  // Render function for each menu item
  const renderMenuItem = (item: MenuItem) => (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative h-48 bg-gray-200">
        {/* Replace with your actual image component */}
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-500">Image: {item.name}</span>
        </div>
        <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
          ${item.price.toFixed(2)}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {item.category}
          </span>
        </div>
        <p className="mt-2 text-gray-600 text-sm">{item.description}</p>
        <button 
          className="mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors"
          onClick={() => console.log('Added to cart:', item.name)}
        >
          Add to Order
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Menu</h1>
          <p className="text-lg text-gray-600">Swipe to browse our delicious offerings</p>
        </div>
        
        <ScrollList
          data={menuItems}
          renderItem={renderMenuItem}
          itemHeight={400} // Adjust based on your card height
        />
        
        <div className="mt-8 text-center">
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-full text-lg">
            View Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
