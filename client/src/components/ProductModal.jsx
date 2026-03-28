// components/ProductModal.jsx
import React, { useEffect, useState } from "react";
import {
  X,
  Heart,
  ShoppingBag,
  Star,
  Truck,
  Shield,
  Clock,
  User,
  Tag,
  IndianRupee,
  Minus,
  Plus,
  CheckCircle,
} from "lucide-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const ProductModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    if (product && isOpen) {
      // Fetch full product details if needed
      setProductDetails(product);
      setQuantity(1);
      setAddedToCart(false);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleWishlist = () => {
    setIsWishlist(!isWishlist);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE.replace("/api", "")}${imagePath}`;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition z-10"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Left Section - Image Gallery */}
            <div className="md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 p-6">
              <div className="sticky top-6">
                {/* Main Image */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
                  {productDetails?.image ? (
                    <img
                      src={getImageUrl(productDetails.image)}
                      alt={productDetails.title}
                      className="w-full h-80 object-cover hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-80 flex items-center justify-center bg-gray-100">
                      <ShoppingBag className="w-20 h-20 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery (if multiple images) */}
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition"
                    >
                      <img
                        src={getImageUrl(productDetails?.image)}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section - Product Details */}
            <div className="md:w-1/2 p-6">
              {/* Category Badge */}
              {productDetails?.category && (
                <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <Tag className="w-3 h-3" />
                  {productDetails.category}
                </div>
              )}

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {productDetails?.title}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= 4
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">4.5 (128 reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-600">
                    ₹ {productDetails?.price}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₹ {Math.round(productDetails?.price * 1.2)}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    20% off
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Inclusive of all taxes
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {productDetails?.description}
                </p>
              </div>

              {/* Key Features */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    Premium quality material
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />1
                    year warranty included
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    Free shipping on orders above ₹999
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />7
                    days return policy
                  </li>
                </ul>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="w-12 text-center font-semibold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="text-sm text-gray-500 ml-2">
                    {quantity} item{quantity > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition transform hover:-translate-y-0.5 font-semibold flex items-center justify-center gap-2"
                >
                  {addedToCart ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className="p-3 border-2 border-gray-200 rounded-xl hover:border-red-200 hover:bg-red-50 transition"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isWishlist ? "fill-red-500 text-red-500" : "text-gray-500"
                    }`}
                  />
                </button>
              </div>

              {/* Delivery Info */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>
                    Free delivery by{" "}
                    {new Date(
                      Date.now() + 5 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Secure payment & 100% buyer protection</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Estimated delivery: 3-5 business days</span>
                </div>
                {productDetails?.createdBy && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>
                      Sold by:{" "}
                      {productDetails.createdBy.name || "Official Store"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles for scrollbar */}
      <style>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </>
  );
};

export default ProductModal;
