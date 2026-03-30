import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../services/productApi";
import ProductForm from "../../components/ProductForm";
import {
  LogOut,
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const productsPerPage = 6;
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      // Ensure images have full URL
      const productsWithFullUrl = res.data.map((p) => ({
        ...p,
        image:
          p.image && !p.image.startsWith("http")
            ? `${BACKEND_URL}${p.image}`
            : p.image || null,
      }));
      setProducts(productsWithFullUrl);
      setFilteredProducts(productsWithFullUrl);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      showToast("Failed to fetch products", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = products.filter((p) => {
      return (
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, products]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const showToast = (message, type = "success") => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 1500);
  };

  // Create product
  const handleCreate = async (formData) => {
    try {
      const res = await createProduct(formData);
      // Fix image URL for frontend
      const productWithUrl = {
        ...res.data,
        image:
          res.data.image && !res.data.image.startsWith("http")
            ? `${BACKEND_URL}${res.data.image}`
            : res.data.image || null,
      };
      setProducts((prev) => [...prev, productWithUrl]);
      showToast("Product created successfully!");
    } catch (err) {
      console.error("Failed to create product:", err);
      showToast(
        err.response?.data?.message || "Failed to create product",
        "error",
      );
    }
  };

  // Update product
  const handleUpdate = async (formData) => {
    try {
      const res = await updateProduct(editProduct._id, formData);
      const updatedProduct = {
        ...res.data,
        image:
          res.data.image && !res.data.image.startsWith("http")
            ? `${BACKEND_URL}${res.data.image}`
            : res.data.image || null,
      };
      setProducts((prev) =>
        prev.map((p) => (p._id === editProduct._id ? updatedProduct : p)),
      );
      setEditProduct(null);
      showToast("Product updated successfully!");
    } catch (err) {
      console.error("Failed to update product:", err);
      showToast(
        err.response?.data?.message || "Failed to update product",
        "error",
      );
    }
  };

  // Delete product
  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete);
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete));
      setShowConfirmDialog(false);
      setProductToDelete(null);
      showToast("Product deleted successfully!");
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast(
        err.response?.data?.message || "Failed to delete product",
        "error",
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 rounded-full p-2">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Confirm Delete
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Welcome back, {user.name || "Admin"}!
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-red-100"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProductForm
          key={editProduct ? editProduct._id : "new"}
          initialData={editProduct}
          onSubmit={editProduct ? handleUpdate : handleCreate}
        />

        <div className="mt-8">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-12 text-center border border-gray-200">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "No products match your search"
                  : "Add your first product above"}
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {currentProducts.map((product) => (
                <div
                  key={product._id}
                  className={`bg-white rounded-2xl shadow border border-gray-200 overflow-hidden ${viewMode === "list" ? "flex" : ""}`}
                >
                  <div
                    className={
                      viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "h-48"
                    }
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">
                        {product.title}
                      </h3>
                      <p className="text-blue-600 font-bold text-xl mb-2">
                        ₹ {product.price}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setEditProduct(product)}
                        className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded-xl hover:bg-yellow-600 transition flex items-center justify-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          setProductToDelete(product._id);
                          setShowConfirmDialog(true);
                        }}
                        className="flex-1 bg-red-500 text-white px-3 py-2 rounded-xl hover:bg-red-600 transition flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-20px);}
          to { opacity:1; transform:translateY(0);}
        }
        .animate-slide-down { animation: slideDown 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
