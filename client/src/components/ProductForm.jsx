import React, { useState, useEffect } from "react";
import {
  Upload,
  X,
  Package,
  IndianRupee,
  Tag,
  AlignLeft,
  Image as ImageIcon,
  Save,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle,
} from "lucide-react";

const ProductForm = ({ onSubmit, initialData, isLoading = false }) => {
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (initialData.image) {
        setPreviewUrl(initialData.image);
      }
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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Product title is required";
    } else if (form.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!form.price) {
      newErrors.price = "Price is required";
    } else if (parseFloat(form.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    } else if (form.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!form.category.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          image: "Please upload a valid image (JPEG, PNG, JPG, WEBP)",
        });
        return;
      }

      if (file.size > maxSize) {
        setErrors({ ...errors, image: "Image size must be less than 5MB" });
        return;
      }

      setForm({ ...form, image: file, imageUrl: "" });
      setErrors({ ...errors, image: "" });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("price", form.price);
    formData.append("description", form.description.trim());
    formData.append("category", form.category.trim());
    formData.append("imageUrl", form.imageUrl);

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      await onSubmit(formData);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);

      if (!initialData) {
        resetForm();
      } else {
        setForm((prev) => ({ ...prev, image: null }));
        setPreviewUrl(form.imageUrl);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const removeImage = () => {
    setForm({ ...form, image: null, imageUrl: "" });
    setPreviewUrl(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100 relative"
    >
      {/* Success Toast Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              {initialData
                ? "Product updated successfully!"
                : "Product added successfully!"}
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {initialData ? "Edit Product" : "Add New Product"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {initialData
              ? "Update your product information"
              : "Fill in the details to add a new product"}
          </p>
        </div>
        {initialData && (
          <button
            type="button"
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Cancel editing"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Package className="inline-block w-4 h-4 mr-1 text-blue-600" />
            Product Title
          </label>
          <input
            name="title"
            placeholder="Enter product title"
            className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.title ? "border-red-300 bg-red-50" : "border-gray-200"
            }`}
            value={form.title}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title}</p>
          )}
        </div>

        {/* Price Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <IndianRupee className="inline-block w-4 h-4 mr-1 text-blue-600" />
            Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              ₹
            </span>
            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              className={`w-full pl-8 pr-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.price ? "border-red-300 bg-red-50" : "border-gray-200"
              }`}
              value={form.price}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          {errors.price && (
            <p className="text-xs text-red-500 mt-1">{errors.price}</p>
          )}
        </div>

        {/* Category Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Tag className="inline-block w-4 h-4 mr-1 text-blue-600" />
            Category
          </label>
          <input
            name="category"
            placeholder="Enter category (e.g., Electronics, Clothing)"
            className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.category ? "border-red-300 bg-red-50" : "border-gray-200"
            }`}
            value={form.category}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          {errors.category && (
            <p className="text-xs text-red-500 mt-1">{errors.category}</p>
          )}
        </div>

        {/* Image Upload Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <ImageIcon className="inline-block w-4 h-4 mr-1 text-blue-600" />
            Product Image
          </label>

          {previewUrl ? (
            <div className="relative">
              <div className="relative group">
                <img
                  src={previewUrl}
                  alt="Product preview"
                  className="w-full h-40 object-cover rounded-xl border-2 border-gray-200"
                />
                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {form.image ? "New image selected" : "Current image"}
              </p>
            </div>
          ) : (
            <label
              className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                errors.image
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload image</p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, WEBP (Max 5MB)
                </p>
              </div>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isSubmitting}
              />
            </label>
          )}

          {errors.image && (
            <p className="text-xs text-red-500 mt-1">{errors.image}</p>
          )}

          {initialData && !previewUrl && (
            <p className="text-xs text-gray-500 mt-1">
              No image uploaded. Click to add one.
            </p>
          )}
        </div>
      </div>

      {/* Description Field */}
      <div className="mt-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <AlignLeft className="inline-block w-4 h-4 mr-1 text-blue-600" />
          Description
        </label>
        <textarea
          name="description"
          placeholder="Enter product description (minimum 10 characters)"
          rows="4"
          className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
            errors.description ? "border-red-300 bg-red-50" : "border-gray-200"
          }`}
          value={form.description}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description}</p>
        )}
        {!errors.description && form.description && (
          <p className="text-xs text-gray-400 mt-1">
            {form.description.length} characters (minimum 10)
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl font-semibold transition-all transform ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-0.5"
          } text-white`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {initialData ? "Updating..." : "Saving..."}
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {initialData ? "Update Product" : "Save Product"}
            </>
          )}
        </button>

        {initialData && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all hover:shadow-md"
          >
            Cancel
          </button>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </form>
  );
};

export default ProductForm;
