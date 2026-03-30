import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "./ProductForm";

const ProductsDashboard = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    try {
      if (selectedProduct) {
        // Update existing product
        await axios.put(`/api/products/${selectedProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Create new product
        await axios.post("/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchProducts();
      setIsFormOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={() => setIsFormOpen(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-xl"
      >
        Add Product
      </button>

      {isFormOpen && (
        <ProductForm
          onSubmit={handleFormSubmit}
          initialData={selectedProduct}
          isLoading={isLoading}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {products.map((p) => (
          <div key={p._id} className="border p-4 rounded-xl shadow-sm">
            <img
              src={p.image}
              className="w-full h-40 object-cover rounded-xl"
            />
            <h3 className="font-bold mt-2">{p.title}</h3>
            <p className="text-gray-500">₹{p.price}</p>
            <button
              onClick={() => {
                setSelectedProduct(p);
                setIsFormOpen(true);
              }}
              className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsDashboard;
