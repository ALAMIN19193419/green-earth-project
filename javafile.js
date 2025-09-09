const API_ENDPOINT = 'https://openapi.programming-hero.com/api/plants';
const plantsData = [
    {
        id: 1,
        title: "Mango Tree",
        category: "Fruit Trees",
        description: "A fast-growing tropical tree that produces delicious, juicy mangoes during summer.",
        image: "https://i.ibb.co/6PqjJ7F/mango-tree.png",
        price: 500,
    },
    {
        id: 2,
        title: "Apple Tree",
        category: "Fruit Trees",
        description: "A deciduous tree known for its sweet, crisp apples.",
        image: "https://i.ibb.co/6PqjJ7F/mango-tree.png",
        price: 650,
    },
    {
        id: 3,
        title: "Orange Tree",
        category: "Fruit Trees",
        description: "An evergreen tree that produces the citrus fruit orange.",
        image: "https://i.ibb.co/6PqjJ7F/mango-tree.png",
        price: 550,
    },
    {
        id: 4,
        title: "Rose Tree",
        category: "Flowering Trees",
        description: "A beautiful ornamental tree with thorny stems and fragrant flowers.",
        image: "https://i.ibb.co/Qd1n83D/pine-tree.png",
        price: 400,
    },
    {
        id: 5,
        title: "Cherry Blossom",
        category: "Flowering Trees",
        description: "A stunning ornamental tree with pink and white flowers that symbolize new beginnings.",
        image: "https://i.ibb.co/Qd1n83D/pine-tree.png",
        price: 800,
    },
    {
        id: 6,
        title: "Neem Tree",
        category: "Medicinal Trees",
        description: "A fast-growing evergreen tree known for its medicinal properties.",
        image: "https://i.ibb.co/r7X9m1V/neem-tree.png",
        price: 600,
    },
    {
        id: 7,
        title: "Oak Tree",
        category: "Shade Trees",
        description: "A common tree known for its strong wood and longevity.",
        image: "https://i.ibb.co/3k8t11c/oak-tree.png",
        price: 850,
    },
    {
        id: 8,
        title: "Pine Tree",
        category: "Evergreen Trees",
        description: "An evergreen conifer with needle-like leaves and pine cones.",
        image: "https://i.ibb.co/Qd1n83D/pine-tree.png",
        price: 700,
    },
    {
        id: 9,
        title: "Jacaranda Tree",
        category: "Flowering Trees",
        description: "A stunning ornamental tree with vibrant purple flowers.",
        image: "https://i.ibb.co/Wc6K88z/jacaranda-tree.png",
        price: 750,
    },
    {
        id: 10,
        title: "Bonsai Tree",
        category: "Ornamental Plants",
        description: "A miniature tree cultivated using special techniques.",
        image: "https://i.ibb.co/k2c5g9T/placeholder.png",
        price: 1200,
    }
];

// DOM Elements
const categoryContainer = document.getElementById('category-container');
const treeContainer = document.getElementById('tree-container');
const spinner = document.getElementById('spinner');
const cartList = document.getElementById('cart-list');
const cartTotalElement = document.getElementById('cart-total');
const modalContent = document.getElementById('modal-content');
const plantModal = document.getElementById('plant_modal');

let cartItems = [];
let cartTotal = 0;

// Show/Hide Spinner
const toggleSpinner = (show) => {
    spinner.classList.toggle('hidden', !show);
};

// Fetch and display categories
const loadCategories = () => {
    toggleSpinner(true);
    // Get unique categories from the local data
    const categories = [...new Set(plantsData.map(plant => plant.category))];
    displayCategories(categories);
    toggleSpinner(false);
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
        categoryBtn.textContent = category;
        categoryBtn.setAttribute('data-category', category);
        categoryBtn.addEventListener('click', () => {
            loadTreesByCategory(category);
            document.querySelectorAll('#category-container .btn').forEach(btn => btn.classList.remove('btn-active'));
            categoryBtn.classList.add('btn-active');
        });
        categoryContainer.appendChild(categoryBtn);
    });
    
    // Load all plants by default
    loadAllPlants();
};

const loadAllPlants = () => {
    toggleSpinner(true);
    displayTrees(plantsData);
    toggleSpinner(false);
};

const loadTreesByCategory = (categoryName) => {
    toggleSpinner(true);
    const filteredTrees = plantsData.filter(plant => plant.category === categoryName);
    displayTrees(filteredTrees);
    toggleSpinner(false);
};

const displayTrees = (trees) => {
    treeContainer.innerHTML = '';
    if (trees.length === 0) {
        treeContainer.innerHTML = '<p class="text-center text-gray-500 text-lg col-span-full">No trees found for this category.</p>';
        return;
    }
    trees.forEach(tree => {
        const treeCard = document.createElement('div');
        treeCard.classList.add('card', 'bg-base-100', 'shadow-xl');
        treeCard.innerHTML = `
            <figure class="h-48 overflow-hidden">
                <img src="${tree.image}" alt="${tree.title}" class="w-full h-full object-cover">
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

const showPlantDetails = (plantId) => {
    const plant = plantsData.find(p => p.id === plantId);
    if (!plant) {
        modalContent.innerHTML = '<p class="text-center text-red-500">Plant details not found.</p>';
        return;
    }
    modalContent.innerHTML = `
        <figure class="mb-4">
            <img src="${plant.image}" alt="${plant.title}" class="w-full h-auto rounded-lg">
        </figure>
        <h3 class="font-bold text-2xl mb-2 text-green-700">${plant.title}</h3>
        <p class="text-gray-600 mb-4">${plant.description || ''}</p>
        <p class="text-lg font-semibold">Price: <span class="text-green-600">৳ ${plant.price}</span></p>
        <div class="space-y-1 mt-4">
            <p><strong>Category:</strong> ${plant.category || ''}</p>
        </div>
    `;
    plantModal.showModal();
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