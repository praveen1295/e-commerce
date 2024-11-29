// Use the correct database
use("ecommerce");

// Update all documents in the 'products' collection
db.getCollection("products").updateMany(
  {},
  {
    $set: {
      price: 99000,
      discountPercentage: {
        regular: 30,
        gold: 32,
        silver: 40,
        platinum: 50,
      },
      discountPrice: {
        regular: 69300,
        gold: 67320,
        silver: 59400,
        platinum: 49500,
      },
    },
  }
);
