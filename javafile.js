// API Endpoints
const API_ENDPOINTS = {
    allPlants: 'https://openapi.programming-hero.com/api/plants',
    allCategories: 'https://openapi.programming-hero.com/api/categories',
    plantsByCategory: (id) => `https://openapi.programming-hero.com/api/category/${id}`,
    plantDetail: (id) => `https://openapi.programming-hero.com/api/plant/${id}`,
};

// Fallback/Dummy Data for plants and categories in case API fails
const fallbackCategories = [
    { category_id: "1", category_name: "Fruit Trees" },
    { category_id: "2", category_name: "Flowering Trees" },
    { category_id: "3", category_name: "Medicinal Trees" },
    { category_id: "4", category_name: "Shade Trees" },
    { category_id: "5", category_name: "Timber Trees" },
    { category_id: "6", category_name: "Evergreen Trees" },
    { category_id: "7", category_name: "Ornamental Plants" },
    { category_id: "8", category_name: "Bamboo" },
    { category_id: "9", category_name: "Climbers" },
    { category_id: "10", category_name: "Aquatic Plants" }
];

const fallbackTrees = [
    {
        plant_id: 1,
        plant_name: "Mango Tree",
        short_description: "A fast-growing tropical tree that produces delicious, juicy mangoes during summer. Its dense green",
        image_url: "https://i.ibb.co/6PqjJ7F/mango-tree.png",
        price: 500,
        category: "Fruit Tree"
    },
    {
        plant_id: 2,
        plant_name: "Guava Tree",
        short_description: "A small tropical tree that bears edible oval fruit with a strong, sweet scent. Guava is rich in vitamins.",
        image_url: "https://i.ibb.co/3WfK9c4/guava-tree.png",
        price: 450,
        category: "Fruit Tree"
    },
    {
        plant_id: 3,
        plant_name: "Neem Tree",
        short_description: "A fast-growing, evergreen tree known for its medicinal properties. Its leaves and seeds are used for.",
        image_url: "https://i.ibb.co/r7X9m1V/neem-tree.png",
        price: 600,
        category: "Medicinal Tree"
    },
    {
        plant_id: 4,
        plant_name: "Jacaranda Tree",
        short_description: "A stunning ornamental tree with vibrant purple flowers that bloom in spring. It adds a beautiful touch.",
        image_url: "https://i.ibb.co/Wc6K88z/jacaranda-tree.png",
        price: 750,
        category: "Flowering Tree"
    },
    {
        plant_id: 5,
        plant_name: "Oak Tree",
        short_description: "A common tree in temperate forests, known for its strong wood and longevity. Its acorns are a food source for wildlife.",
        image_url: "https://i.ibb.co/3k8t11c/oak-tree.png",
        price: 850,
        category: "Shade Tree"
    },
    {
        plant_id: 6,
        plant_name: "Pine Tree",
        short_description: "An evergreen conifer with needle-like leaves and pine cones. It is a symbol of Christmas and is known for its fragrant wood.",
        image_url: "https://i.ibb.co/Qd1n83D/pine-tree.png",
        price: 700,
        category: "Evergreen Tree"
    },
    {
        plant_id: 7,
        plant_name: "Rose Bush",
        short_description: "A flowering plant with thorny stems and fragrant flowers of various colors. It is a symbol of love and beauty.",
        image_url: "https://i.ibb.co/N1XwR2j/rose-bush.png",
        price: 350,
        category: "Flowering Tree"
    }
];

// Default placeholder image
const placeholderImage = 'https://i.ibb.co/k2c5g9T/placeholder.png'; // একটি নতুন প্লেসহোল্ডার ছবির URL

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

// Fetch Categories and load them
const loadCategories = async () => {
    try {
        const res = await fetch(API_ENDPOINTS.allCategories);
        const data = await res.json();
        if (data.data && data.data.length > 0) {
            displayCategories(data.data);
        } else {
            console.warn("API returned no categories. Using fallback data.");
            displayCategories(fallbackCategories);
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        displayCategories(fallbackCategories);
    }
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
        categoryBtn.textContent = category.category_name;
        categoryBtn.setAttribute('data-id', category.category_id);
        categoryBtn.addEventListener('click', () => {
            loadTreesByCategory(category.category_id);
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
        const res = await fetch(API_ENDPOINTS.allPlants);
        const data = await res.json();
        if (data.data && data.data.length > 0) {
            displayTrees(data.data);
        } else {
            console.warn("API returned no plants. Using fallback data.");
            displayTrees(fallbackTrees);
        }
    } catch (error) {
        console.error('Error fetching all plants:', error);
        displayTrees(fallbackTrees);
    } finally {
        toggleSpinner(false);
    }
};

// Fetch Trees by Category ID and display
const loadTreesByCategory = async (categoryId) => {
    toggleSpinner(true);
    treeContainer.innerHTML = '';
    try {
        const res = await fetch(API_ENDPOINTS.plantsByCategory(categoryId));
        const data = await res.json();
        if (data.data && data.data.length > 0) {
            displayTrees(data.data);
        } else {
            treeContainer.innerHTML = '<p class="text-center text-gray-500 text-lg col-span-full">No trees found for this category.</p>';
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
        // Use placeholder image if image_url is missing or broken
        const imageUrl = tree.image_url && tree.image_url.startsWith('http') ? tree.image_url : placeholderImage;

        const treeCard = document.createElement('div');
        treeCard.classList.add('card', 'bg-base-100', 'shadow-xl');
        treeCard.innerHTML = `
            <figure class="h-48 overflow-hidden">
                <img src="${imageUrl}" alt="${tree.plant_name}" class="w-full h-full object-cover">
            </figure>
            <div class="card-body">
                <h3 class="card-title text-green-700 cursor-pointer" onclick="showPlantDetails(${tree.plant_id})">${tree.plant_name}</h3>
                <p class="text-sm text-gray-500">${tree.short_description}</p>
                <div class="badge badge-primary badge-outline text-xs">${tree.category}</div>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-xl font-bold text-green-600">৳ ${tree.price}</span>
                    <button class="btn btn-success text-white btn-sm" onclick="addToCart('${tree.plant_name}', ${tree.price})">Add to Cart</button>
                </div>
            </div>
        `;
        treeContainer.appendChild(treeCard);
    });
};

// Show plant details in a modal
const showPlantDetails = async (plantId) => {
    try {
        const res = await fetch(API_ENDPOINTS.plantDetail(plantId));
        const data = await res.json();
        const plant = data.data;

        // Use placeholder image if image_url is missing or broken for modal
        const imageUrl = plant.image_url && plant.image_url.startsWith('http') ? plant.image_url : placeholderImage;

        modalContent.innerHTML = `
            <figure class="mb-4">
                <img src="${imageUrl}" alt="${plant.plant_name}" class="w-full h-auto rounded-lg">
            </figure>
            <h3 class="font-bold text-2xl mb-2 text-green-700">${plant.plant_name}</h3>
            <p class="text-gray-600 mb-4">${plant.description}</p>
            <p class="text-lg font-semibold">Price: <span class="text-green-600">৳ ${plant.price}</span></p>
            <div class="space-y-1 mt-4">
                <p><strong>Category:</strong> ${plant.category}</p>
                <p><strong>Care Instructions:</strong> ${plant.care_instructions}</p>
                <p><strong>Planting Season:</strong> ${plant.planting_season}</p>
                <p><strong>Size:</strong> ${plant.size}</p>
            </div>
        `;

        plant_modal.showModal();
    } catch (error) {
        console.error('Error fetching plant details:', error);
    }
};

// Add to Cart Functionality
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
        itemElement.classList.add('flex', 'justify-between', 'items-center');
        const totalPrice = item.price * item.quantity;
        itemElement.innerHTML = `
            <div>
                <span class="font-medium">${item.name}</span>
                <span class="text-sm text-gray-500 block">৳ ${item.price} x ${item.quantity}</span>
            </div>
            <div class="flex items-center space-x-2">
                <span class="text-green-600 font-semibold">৳ ${totalPrice}</span>
                <button class="btn btn-ghost btn-sm btn-circle" onclick="removeFromCart(${index})">❌</button>
            </div>
        `;
        cartList.appendChild(itemElement);
        cartTotal += totalPrice;
    });
    cartTotalElement.textContent = `৳ ${cartTotal}`;
};

// Remove from Cart Functionality
const removeFromCart = (index) => {
    cartItems.splice(index, 1);
    updateCartDisplay();
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
});