// New API Endpoint for reliable data with images
const API_ENDPOINT = 'https://fakestoreapi.com/products';

// Fallback/Dummy Data
const fallbackTrees = [
    {
        id: 1,
        title: "Mango Tree",
        category: "Fruit Trees",
        description: "A fast-growing tropical tree that produces delicious, juicy mangoes during summer. Its dense green canopy provides excellent shade.",
        image: "https://openapi.programming-hero.com/api/categories",
        price: 500,
    },
    {
        id: 2,
        title: "Guava Tree",
        category: "Fruit Trees",
        description: "A small tropical tree that bears edible oval fruit with a strong, sweet scent. Guava is rich in vitamins.",
        image: "https://openapi.programming-hero.com/api/category/${id}",
        price: 450,
    },
    {
        id: 3,
        title: "Neem Tree",
        category: "Medicinal Trees",
        description: "A fast-growing, evergreen tree known for its medicinal properties. Its leaves and seeds are used for.",
        image: "https://i.ibb.co/r7X9m1V/neem-tree.png",
        price: 600,
    },
    {
        id: 4,
        title: "Jacaranda Tree",
        category: "Flowering Trees",
        description: "A stunning ornamental tree with vibrant purple flowers that bloom in spring. It adds a beautiful touch.",
        image: "https://i.ibb.co/Wc6K88z/jacaranda-tree.png",
        price: 750,
    },
    {
        id: 5,
        title: "Oak Tree",
        category: "Shade Trees",
        description: "A common tree in temperate forests, known for its strong wood and longevity. Its acorns are a food source for wildlife.",
        image: "https://i.ibb.co/3k8t11c/oak-tree.png",
        price: 850,
    },
    {
        id: 6,
        title: "Pine Tree",
        category: "Evergreen Trees",
        description: "An evergreen conifer with needle-like leaves and pine cones. It is a symbol of Christmas and is known for its fragrant wood.",
        image: "https://i.ibb.co/Qd1n83D/pine-tree.png",
        price: 700,
    },
];

const placeholderImage = 'https://i.ibb.co/k2c5g9T/placeholder.png'; // A new placeholder image URL

// DOM Elements
const categoryContainer = document.getElementById('category-container');
const treeContainer = document.getElementById('tree-container');
const spinner = document.getElementById('spinner');
const cartList = document.getElementById('cart-list');
const cartTotalElement = document.getElementById('cart-total');
const modalContent = document.getElementById('modal-content');

let cartItems = [];
let cartTotal = 0;

// Show/Hide Spinner
const toggleSpinner = (show) => {
    spinner.classList.toggle('hidden', !show);
};

// Fetch and display categories
const loadCategories = async () => {
    toggleSpinner(true);
    try {
        const res = await fetch(`${API_ENDPOINT}/categories`);
        const data = await res.json();
        if (data && data.length > 0) {
            displayCategories(data);
        } else {
            console.warn("API returned no categories. Using fallback data.");
            displayCategories(getFallbackCategories());
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        displayCategories(getFallbackCategories());
    } finally {
        toggleSpinner(false);
    }
};

const getFallbackCategories = () => {
    const categories = [...new Set(fallbackTrees.map(tree => tree.category))];
    return categories.map((cat, index) => ({ id: (index + 1).toString(), category_name: cat }));
};

const displayCategories = (categories) => {
    categoryContainer.innerHTML = '';
    
    // Manually add "All Trees" button first
    const allTreesBtn = document.createElement('button');
    allTreesBtn.classList.add('btn', 'btn-ghost', 'w-full', 'text-left', 'justify-start', 'capitalize', 'btn-active');
    allTreesBtn.textContent = "All Trees";
    allTreesBtn.addEventListener('click', () => {
        loadAllPlants();
        document.querySelectorAll('#category-container .btn').forEach(btn => btn.classList.remove('btn-active'));
        allTreesBtn.classList.add('btn-active');
    });
    categoryContainer.appendChild(allTreesBtn);

    categories.forEach(category => {
        const categoryBtn = document.createElement('button');
        categoryBtn.classList.add('btn', 'btn-ghost', 'w-full', 'text-left', 'justify-start', 'capitalize');
        categoryBtn.textContent = category.category_name || category;
        categoryBtn.setAttribute('data-category', category.category_name || category);
        categoryBtn.addEventListener('click', () => {
            loadTreesByCategory(category.category_name || category);
            document.querySelectorAll('#category-container .btn').forEach(btn => btn.classList.remove('btn-active'));
            categoryBtn.classList.add('btn-active');
        });
        categoryContainer.appendChild(categoryBtn);
    });
    
    // Load all plants by default
    loadAllPlants();
};

const loadAllPlants = async () => {
    toggleSpinner(true);
    treeContainer.innerHTML = '';
    try {
        const res = await fetch(API_ENDPOINT);
        const data = await res.json();
        if (data && data.length > 0) {
            displayTrees(data, true); // true indicates it's from all plants API
        } else {
            console.warn("API returned no plants. Using fallback data.");
            displayTrees(fallbackTrees);
        }
    } catch (error) {
        console.error('Error fetching all plants:', error);
        treeContainer.innerHTML = '<p class="text-center text-red-500 text-lg col-span-full">Failed to load trees. Please try again later.</p>';
        displayTrees(fallbackTrees);
    } finally {
        toggleSpinner(false);
    }
};

const loadTreesByCategory = async (categoryName) => {
    toggleSpinner(true);
    treeContainer.innerHTML = '';
    try {
        const res = await fetch(`${API_ENDPOINT}/category/${encodeURIComponent(categoryName)}`);
        const data = await res.json();
        if (data && data.length > 0) {
            displayTrees(data, true);
        } else {
            // If category API fails, try to filter from fallback data
            const filteredTrees = fallbackTrees.filter(tree => tree.category === categoryName);
            if (filteredTrees.length > 0) {
                displayTrees(filteredTrees);
            } else {
                treeContainer.innerHTML = '<p class="text-center text-gray-500 text-lg col-span-full">No trees found for this category.</p>';
            }
        }
    } catch (error) {
        console.error('Error fetching plants by category:', error);
        treeContainer.innerHTML = '<p class="text-center text-red-500 text-lg col-span-full">Failed to load trees. Please try again later.</p>';
    } finally {
        toggleSpinner(false);
    }
};

const displayTrees = (trees) => {
    treeContainer.innerHTML = '';
    if (trees.length === 0) {
        treeContainer.innerHTML = '<p class="text-center text-gray-500 text-lg col-span-full">No trees found for this category.</p>';
        return;
    }
    trees.forEach(tree => {
        const imageUrl = tree.image && tree.image.startsWith('http') ? tree.image : placeholderImage;
        const treeCard = document.createElement('div');
        treeCard.classList.add('card', 'bg-base-100', 'shadow-xl');
        treeCard.innerHTML = `
            <figure class="h-48 overflow-hidden">
                <img src="${imageUrl}" alt="${tree.title}" class="w-full h-full object-cover">
            </figure>
            <div class="card-body">
                <h3 class="card-title text-green-700 cursor-pointer" onclick="showPlantDetails(${tree.id})">${tree.title}</h3>
                <p class="text-sm text-gray-500">${tree.description || ''}</p>
                <div class="badge badge-primary badge-outline text-xs">${tree.category || ''}</div>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-xl font-bold text-green-600">৳ ${tree.price}</span>
                    <button class="btn btn-success text-white btn-sm" onclick="addToCart('${tree.title}', ${tree.price})">Add to Cart</button>
                </div>
            </div>
        `;
        treeContainer.appendChild(treeCard);
    });
};

const showPlantDetails = async (plantId) => {
    try {
        const res = await fetch(`${API_ENDPOINT}/${plantId}`);
        const plant = await res.json();

        if (!plant || Object.keys(plant).length === 0) {
            modalContent.innerHTML = '<p class="text-center text-red-500">Plant details not found.</p>';
            return;
        }

        const imageUrl = plant.image && plant.image.startsWith('http') ? plant.image : placeholderImage;

        modalContent.innerHTML = `
            <figure class="mb-4">
                <img src="${imageUrl}" alt="${plant.title}" class="w-full h-auto rounded-lg">
            </figure>
            <h3 class="font-bold text-2xl mb-2 text-green-700">${plant.title}</h3>
            <p class="text-gray-600 mb-4">${plant.description || ''}</p>
            <p class="text-lg font-semibold">Price: <span class="text-green-600">৳ ${plant.price}</span></p>
            <div class="space-y-1 mt-4">
                <p><strong>Category:</strong> ${plant.category || ''}</p>
            </div>
        `;

        plant_modal.showModal();
    } catch (error) {
        console.error('Error fetching plant details:', error);
        modalContent.innerHTML = '<p class="text-center text-red-500">Failed to load plant details. Please try again later.</p>';
    }
};

const addToCart = (plantName, price) => {
    const existingItem = cartItems.find(item => item.name === plantName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ name: plantName, price, quantity: 1 });
    }
    updateCartDisplay();
};

const updateCartDisplay = () => {
    cartList.innerHTML = '';
    cartTotal = 0;
    if (cartItems.length === 0) {
        cartList.innerHTML = '<li class="text-gray-500 text-center">Your cart is empty.</li>';
        cartTotalElement.textContent = '৳ 0';
        return;
    }

    cartItems.forEach((item, index) => {
        const itemElement = document.createElement('li');
        itemElement.classList.add('flex', 'justify-between', 'items-center', 'border-b', 'border-gray-200', 'pb-2');
        const totalPrice = item.price * item.quantity;
        cartTotal += totalPrice;
        itemElement.innerHTML = `
            <div class="flex-1">
                <span class="font-medium">${item.name}</span>
                <span class="text-sm text-gray-500 block">৳ ${item.price} × ${item.quantity}</span>
            </div>
            <div class="flex items-center space-x-2">
                <span class="text-green-600 font-semibold">৳ ${totalPrice}</span>
                <button class="btn btn-ghost btn-sm btn-circle" onclick="removeFromCart(${index})">❌</button>
            </div>
        `;
        cartList.appendChild(itemElement);
    });
    cartTotalElement.textContent = `৳ ${cartTotal}`;
};

const removeFromCart = (index) => {
    cartItems.splice(index, 1);
    updateCartDisplay();
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
});