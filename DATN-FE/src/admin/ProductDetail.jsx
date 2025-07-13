import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductById, createProduct, uploadImage, uploadImages, updateProduct } from './../api/index';

const ProductDetail = ({ productId = null, onClose }) => {
  const queryClient = useQueryClient();

  const createProductMutation = useMutation({
    mutationFn: productId !== 'create' ? updateProduct : createProduct,
    onSuccess: () => {
      Swal.fire('Thành công', `${productId !== 'create' ? 'Cập nhật' : 'Tạo'} sản phẩm thành công!`, 'success');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] }); 
      onClose(); 
    },
    onError: (error) => {
      if(error.response.data.message) return Swal.fire('Thất bại', error.response.data.message, 'warning');
    },
  });
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    type: '',
    price: '',
    sortDescription: '',
    countInStock: '',
    description: '',
    srcImages: [],
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-product-detail', productId],
    queryFn: () => getProductById(productId),
    enabled: productId !== null && productId !== 'create',
  });
  
  useEffect(() => {
    if (productId && productId !== 'create' && data) {
      setFormData({
        name: data.name || '',
        image: data.image || '',
        sortDescription: data.sortDescription || '',
        type: data.type || '',
        price: data.price || '',
        countInStock: data.countInStock || '',
        description: data.description || '',
        srcImages: data.srcImages || [],
      });
    }
  }, [productId, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'srcImages' ? value.split(',') : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image || !formData.type) {
      Swal.fire('Thiếu thông tin', 'Vui lòng điền đầy đủ các trường bắt buộc.', 'warning');
      return;
    }

    if (productId !== 'create') {
      createProductMutation.mutate({ id: productId, payload: formData });
    } else {
      createProductMutation.mutate(formData);
    }
  };

  const handleChangeSubImages = async (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 10;
    const remainingSlots = maxImages - formData.srcImages.length;

    if (files.length > remainingSlots) {
      alert(`Chỉ được chọn thêm tối đa ${remainingSlots} ảnh`);
      return;
    }

    try {
      const formDataMulti = new FormData();
      files.forEach((file) => formDataMulti.append('files', file));

      const result = await uploadImages(formDataMulti);
      setFormData((prev) => ({
        ...prev,
        srcImages: [...prev.srcImages, ...result.paths],
      }));
    } catch (err) {
      console.error('Upload ảnh phụ thất bại:', err);
    }
  };

  const handleRemoveSubImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      srcImages: prev.srcImages.filter((_, i) => i !== indexToRemove),
    }));
  };
  const handleChangeImg = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file); 
    try {
      const result = await uploadImage(formData);
       setFormData((prev) => ({
        ...prev,
        image: result.path,
      }))
    } catch (err) {
      console.error('Upload ảnh thất bại', err);
    }
  };

  if (isLoading) return <div className="text-center mt-10">Đang tải sản phẩm...</div>;
  if (isError) return <div className="text-center text-red-500">Không tìm thấy sản phẩm</div>;
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {productId !== 'create' ? '✏️ Sửa sản phẩm' : '➕ Tạo sản phẩm mới'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-medium">Tên sản phẩm</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Miêu tả ngắn</label>
          <input
            type="text"
            name="sortDescription"
            value={formData.sortDescription}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ảnh chính <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center gap-4">
            <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Chọn ảnh
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.gif"
                onChange={handleChangeImg}
                className="hidden"
              />
            </label>

            {formData.image && (
              <img
                src={`${process.env.REACT_APP_API_URL_BACKEND}/image/${formData.image}`}
                alt="Preview"
                className="w-20 h-20 object-cover rounded border border-gray-300 shadow"
              />
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ảnh phụ
          </label>

          <div className="flex flex-col gap-2">
            <label className="cursor-pointer w-fit px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
              Tải lên ảnh phụ
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.gif"
                multiple
                onChange={handleChangeSubImages}
                className="hidden"
              />
            </label>

            {/* Hiển thị ảnh preview */}
            <div className="grid grid-cols-5 gap-2 mt-2">
              {formData.srcImages?.map((imgPath, index) => (
                <div key={index} className="relative group">
                  <img
                    src={`${process.env.REACT_APP_API_URL_BACKEND}/image/${imgPath}`}
                    alt={`Ảnh phụ ${index + 1}`}
                    className="w-full h-20 object-cover rounded border border-gray-300 shadow"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSubImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    title="Xoá ảnh"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block font-medium">Loại sản phẩm</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Giá tiền</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Tồn kho</label>
            <input
              type="number"
              name="countInStock"
              value={formData.countInStock}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
{/* 
        <div>
          <label className="block font-medium">Đánh giá (1-5)</label>
          <input
            type="number"
            name="rating"
            min="1"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div> */}

        <div>
          <label className="block font-medium">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border p-2 rounded"
          ></textarea>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {productId !== 'create' ? 'Cập nhật' : 'Tạo mới'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:underline"
          >
            Huỷ
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductDetail;
