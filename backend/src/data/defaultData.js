export const defaultUsers = [
  {
    name: "Admin User",
    email: "admin@nrdryfruit.com",
    password: "Admin@123",
    role: "admin",
    address: {
      fullName: "Admin User",
      phone: "9999999999",
      line1: "Bapu Bazaar",
      city: "Jaipur",
      state: "Rajasthan",
      postalCode: "302003",
      country: "India"
    }
  },
  {
    name: "Aisha Khan",
    email: "aisha@example.com",
    password: "Customer@123",
    role: "customer",
    address: {
      fullName: "Aisha Khan",
      phone: "8888888888",
      line1: "Malviya Nagar",
      city: "Jaipur",
      state: "Rajasthan",
      postalCode: "302017",
      country: "India"
    }
  }
];

export const defaultProducts = [
  {
    name: "Royal Kashmiri Almonds",
    category: "Almonds",
    price: 799,
    description: "Crunchy premium almonds packed with natural oils, protein, and a clean buttery finish.",
    stock: 40,
    images: [
      "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=900&q=80"
    ],
    isFeatured: true,
    averageRating: 4.7,
    numReviews: 2,
    tags: ["premium", "protein", "daily-use"]
  },
  {
    name: "Iranian Pistachios",
    category: "Pistachios",
    price: 1125,
    description: "Roasted and lightly salted pistachios with rich flavor and bright green kernels.",
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1615485737651-964c4e693831?auto=format&fit=crop&w=900&q=80"
    ],
    isFeatured: true,
    averageRating: 4.8,
    numReviews: 1,
    tags: ["gourmet", "gift", "snack"]
  },
  {
    name: "Afghani Raisins Gold",
    category: "Raisins",
    price: 399,
    description: "Naturally sweet seedless raisins ideal for desserts, breakfast bowls, and festive gifting.",
    stock: 60,
    images: [
      "https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=900&q=80"
    ],
    isFeatured: true,
    averageRating: 4.4,
    numReviews: 1,
    tags: ["sweet", "baking", "healthy"]
  },
  {
    name: "Desi Cashew Whole",
    category: "Cashews",
    price: 945,
    description: "Creamy and smooth full-bodied cashews with a rich bite, perfect for snacking or curry bases.",
    stock: 32,
    images: [
      "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?auto=format&fit=crop&w=900&q=80"
    ],
    isFeatured: false,
    averageRating: 4.6,
    numReviews: 0,
    tags: ["kitchen", "snack"]
  }
];

export const defaultShopInfo = {
  shopName: "NR Dry Fruit",
  ownerName: "Naeem Raza",
  ownerPhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
  ownerDescription:
    "NR Dry Fruit curates fresh almonds, pistachios, raisins, cashews, seeds, and gift boxes with a premium neighborhood-store experience.",
  contactDetails: {
    phone: "+91 98765 43210",
    email: "hello@nrdryfruit.com",
    whatsapp: "+91 98765 43210"
  },
  shopAddress: "Main Market, Jaipur, Rajasthan 302003",
  latitude: 26.9124,
  longitude: 75.7873,
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.8042177294336!2d75.78729277551715!3d26.91243397665051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db4084d7c88d5%3A0x6a96a9e31fa8c7c2!2sJaipur!5e0!3m2!1sen!2sin!4v1715434950000!5m2!1sen!2sin"
};

export const defaultCoupons = [
  {
    code: "WELCOME10",
    description: "10% off on first order",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 500,
    isActive: true,
    expiresAt: new Date("2027-12-31")
  },
  {
    code: "NUTS150",
    description: "Flat Rs. 150 off",
    discountType: "fixed",
    discountValue: 150,
    minOrderAmount: 1500,
    isActive: true,
    expiresAt: new Date("2027-12-31")
  }
];
