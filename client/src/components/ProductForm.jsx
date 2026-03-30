import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Upload,
  X,
  Package,
  IndianRupee,
  Tag,
  AlignLeft,
  Image as ImageIcon,
  Save,
  Trash2,
  Loader2,
  CheckCircle,
} from "lucide-react";

const ProductForm = ({ initialData, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: null,
    imageUrl: "",
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState("");

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        price: initialData.price || "",
        description: initialData.description || "",
        category: initialData.category || "",
        image: null,
        imageUrl: initialData.image || "",
      });
      if (initialData.image) setPreviewUrl(initialData.image);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setForm({
      title: "",
      price: "",
      description: "",
      category: "",
      image: null,
      imageUrl: "",
    });
    setPreviewUrl(null);
    setErrors({});
    setShowError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Product title is required";
    else if (form.title.trim().length < 3)
      newErrors.title = "Title must be at least 3 characters";

    if (!form.price) newErrors.price = "Price is required";
    else if (parseFloat(form.price) <= 0)
      newErrors.price = "Price must be greater than 0";

    if (!form.description.trim())
      newErrors.description = "Description is required";
    else if (form.description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters";

    if (!form.category.trim()) newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Invalid image type" }));
      return;
    }
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, image: "Image must be <5MB" }));
      return;
    }

    setForm((prev) => ({ ...prev, image: file, imageUrl: "" }));
    setErrors((prev) => ({ ...prev, image: "" }));

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: null, imageUrl: "" }));
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setShowError("");

    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("price", form.price);
      formData.append("description", form.description.trim());
      formData.append("category", form.category.trim());
      if (form.image) formData.append("image", form.image);
      else if (form.imageUrl) formData.append("imageUrl", form.imageUrl);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found. Please login.");

      const endpoint = initialData
        ? `https://localkarts.onrender.com/api/products/${initialData._id}`
        : "https://localkarts.onrender.com/api/products";

      const method = initialData ? "put" : "post";

      const res = await axios({
        method,
        url: endpoint,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Backend returns product object directly
      if (res.data && res.data._id) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1500);
        resetForm();
        if (onSuccess) onSuccess(res.data);
      } else {
        setShowError("Unexpected server response");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      if (error.response?.status === 401)
        setShowError("Unauthorized! Please login.");
      else setShowError(error.message || "Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100 relative"
    >
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{initialData ? "Product updated!" : "Product added!"}</span>
          </div>
        </div>
      )}
      {showError && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <X className="w-5 h-5" />
            <span>{showError}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-2xl font-bold">
          {initialData ? "Edit Product" : "Add Product"}
        </h3>
        {initialData && (
          <button type="button" onClick={resetForm} disabled={isSubmitting}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Grid Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label className="block mb-2">
            <Package className="inline w-4 h-4 mr-1 text-blue-600" />
            Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border-2 rounded-xl ${
              errors.title ? "border-red-300 bg-red-50" : "border-gray-200"
            }`}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block mb-2">
            <IndianRupee className="inline w-4 h-4 mr-1 text-blue-600" />
            Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
            <input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className={`w-full pl-8 py-2.5 border-2 rounded-xl ${
                errors.price ? "border-red-300 bg-red-50" : "border-gray-200"
              }`}
              disabled={isSubmitting}
            />
          </div>
          {errors.price && (
            <p className="text-xs text-red-500 mt-1">{errors.price}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block mb-2">
            <Tag className="inline w-4 h-4 mr-1 text-blue-600" />
            Category
          </label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border-2 rounded-xl ${
              errors.category ? "border-red-300 bg-red-50" : "border-gray-200"
            }`}
            disabled={isSubmitting}
          />
          {errors.category && (
            <p className="text-xs text-red-500 mt-1">{errors.category}</p>
          )}
        </div>

        {/* Image */}
        <div>
          <label className="block mb-2">
            <ImageIcon className="inline w-4 h-4 mr-1 text-blue-600" />
            Product Image
          </label>
          {previewUrl ? (
            <div className="relative group">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-40 object-cover rounded-xl border-2 border-gray-200"
              />
              <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center">
                <button type="button" onClick={removeImage}>
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <span>Click to upload image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
          {errors.image && (
            <p className="text-xs text-red-500 mt-1">{errors.image}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <label className="block mb-2">
          <AlignLeft className="inline w-4 h-4 mr-1 text-blue-600" />
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          className={`w-full px-4 py-2.5 border-2 rounded-xl ${
            errors.description ? "border-red-300 bg-red-50" : "border-gray-200"
          }`}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Update Product"
              : "Add Product"}
        </button>
      </div>

      <style>{`
        @keyframes slideDown { from {opacity:0; transform:translateY(-20px);} to {opacity:1; transform:translateY(0);} }
        .animate-slide-down { animation: slideDown 0.3s ease-out; }
      `}</style>
    </form>
  );
};

export default ProductForm;
