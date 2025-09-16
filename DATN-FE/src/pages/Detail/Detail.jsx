import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from 'react';
import { Form, Input, Button, Rate, List, message, Comment, Modal } from 'antd';
import dayjs from 'dayjs';
import { getProductById, getreviewById, relationProduct, repliesReview, createReview } from '../../api/index';
import { GET_IMAGE } from '../../const/index.ts';
import { addProduct } from "../../redux/cart/cartSlice";
import { addProduct as addProductCheckout } from "../../redux/checkout/checkoutSlice";
const { TextArea } = Input;
const Detail = () => {

    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();

    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // state ảnh lớn hiện tại

    const { data, isLoading, isError } = useQuery({
        queryKey: ['product-detail', id],
        queryFn: () => getProductById(id),
    });

    useEffect(() => {
        if (!data) return;

        // Đặt ảnh mặc định là ảnh chính sản phẩm
        setSelectedImage(data.image);

        if (!data.hasVariants) return;

        // Tìm variant còn hàng đầu tiên để mặc định chọn
        const inStockVariant = data.variants.find(v => v.stock > 0);
        if (inStockVariant) {
            const attrs = {};
            for (const [key, value] of Object.entries(inStockVariant.attributes)) {
                attrs[key] = value;
            }
            setSelectedAttributes(attrs);
            setSelectedVariant(inStockVariant);
        }
    }, [data]);

    const handleSelectAttribute = (attrName, value) => {
        const updatedAttrs = { ...selectedAttributes, [attrName]: value };
        setSelectedAttributes(updatedAttrs);

        const matched = data.variants?.find((variant) =>
            Object.entries(updatedAttrs).every(
                ([key, val]) => variant.attributes?.[key] === val
            )
        );

        setSelectedVariant(matched || null);
    };

    const handleAddToCart = () => {
        if (data.hasVariants && !selectedVariant) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng chọn đầy đủ các biến thể',
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        const item = {
            productId: data._id,
            name: data.name,
            image: data.image,
            price: data.hasVariants ? selectedVariant.price : data.price,
            sku: data.hasVariants ? selectedVariant.sku : null,
            attributes: data.hasVariants ? selectedVariant.attributes : {},
            quantity: 1,
        };

        dispatch(addProduct(item));

        Swal.fire({
            icon: 'success',
            title: 'Đã thêm vào giỏ hàng',
            text: `"${item.name}" ${Object.keys(item.attributes).length > 0 ? '(' + Object.entries(item.attributes)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ') + ')' : ''} đã được thêm vào giỏ hàng .`,
            timer: 1500,
            showConfirmButton: false,
        });
    };

    const handleCheckout = () => {
        if (data.hasVariants && !selectedVariant) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng chọn đầy đủ các biến thể',
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        const item = {
            productId: data._id,
            name: data.name,
            image: data.image,
            price: data.hasVariants ? selectedVariant.price : data.price,
            sku: data.hasVariants ? selectedVariant.sku : null,
            attributes: data.hasVariants ? selectedVariant.attributes : {},
            quantity: 1,
        };

        dispatch(addProductCheckout(item));
        navigate('/checkoutpage');
    };

    const {
        data: products,
        isLoading: isLoadingRelated,
    } = useQuery({
        queryKey: ['list-products-related', data?.brandId?._id, data?.categoryId?._id, id],
        queryFn: () => relationProduct(
            data?.brandId?._id ? data?.brandId?._id : null,
            data?.brandId?._id ? data?.categoryId?._id : null,
            id
        ),
        keepPreviousData: true,
    });
    const [activeTab, setActiveTab] = useState("description");
    const queryClient = useQueryClient();

    const {
        data: reviews,
    } = useQuery({
        queryKey: [`list-review-${id}`, id],
        queryFn: () => getreviewById(id),
        keepPreviousData: true,
    });


    const averageRating = useMemo(() => {
        if (!reviews) return 0;
        const totalRating = reviews.data.reduce((acc, review) => acc + review.rating, 0);
        return totalRating / reviews.data.length;
    }, [reviews]);

    const totalReviews = useMemo(() => {
        if (!reviews) return 0;
        return reviews.data.length;
    }, [reviews]);

    const [form] = Form.useForm();
    const [replyForms, setReplyForms] = useState({});
    const [modalOpen, setModalOpen] = useState(false);

    const handleSubmitReview = async (values) => {
        try {
            await createReview({
                ...values,
                productId: id,
                userId: user.id,
                role: user.isAdmin ? 'admin' : 'user',
            });
            message.success('Đánh giá đã được gửi');
            setModalOpen(false);
            queryClient.invalidateQueries({ queryKey: [`list-review-${id}`] })
            form.resetFields();
        } catch (err) {
            message.error(err.message);
        }
    };

    const handleReplySubmit = async (reviewId, content) => {
        try {
            await repliesReview({
                content,
                userId: user.id,
                role: user.isAdmin ? 'admin' : 'user',
                reviewId
            });
            message.success('Phản hồi thành công');
            setReplyForms(prev => ({ ...prev, [reviewId]: '' }));
            queryClient.invalidateQueries({ queryKey: [`list-review-${id}`] })
        } catch (err) {
            message.error('Lỗi khi phản hồi');
        }
    };
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error</div>;

    return (
        <div className="bg-gray-100 min-h-screen py-6 px-2">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-1 space-y-6"></div>
                <div className="md:col-span-10 space-y-6">
                    <div className="bg-white rounded-lg shadow p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-4 flex flex-col items-center">
                            {/* Ảnh lớn sử dụng selectedImage */}
                            <img
                                src={GET_IMAGE(selectedImage)}
                                alt={data?.name}
                                className="w-64 h-64 object-cover rounded-lg mb-4"
                            />
                            {/* Ảnh con, click thay đổi ảnh lớn */}
                            <div className="flex space-x-2">
                                {data?.srcImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={GET_IMAGE(image)}
                                        alt={data?.name}
                                        onClick={() => setSelectedImage(image)}
                                        className={`w-12 h-12 object-cover border-2 rounded cursor-pointer transition
                                            ${selectedImage === image ? 'border-blue-500' : 'border-white'}
                                            hover:border-blue-400`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-8">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2 line-clamp-2">{data.name}</h1>
                            <div className="flex items-center text-yellow-400 text-sm mb-1">
                                {!averageRating ? 'Chưa có đánh giá' :
                                    (averageRating >= 4.6 ? `${averageRating.toFixed(1)} ★★★★★` :
                                        (averageRating >= 3.6 ? `${averageRating.toFixed(1)} ★★★★☆` :
                                            (averageRating >= 2.6 ? `${averageRating.toFixed(1)} ★★★☆☆` :
                                                (averageRating >= 1.6 ? `${averageRating.toFixed(1)} ★★☆☆☆` :
                                                    `${averageRating.toFixed(1)} ★☆☆☆☆`))))}

                                {
                                    totalReviews > 0 && (
                                        <span className="ml-2 text-gray-600">
                                            | ({totalReviews} đánh giá)
                                        </span>
                                    )
                                }
                            </div>

                            <div className="text-sm text-gray-600 mb-2">Thương hiệu: <span className="text-red-500 font-semibold">{data.brandId?.name || 'No brand'}</span></div>
                            <div className="text-sm text-gray-600 mb-2">Danh mục: <span className="text-red-500 font-semibold">{data.categoryId?.name || 'No category'}</span></div>

                            {data.hasVariants && data.attributes.map((attr) => {
                                const values = [...new Set(data.variants.map(v => v.attributes[attr]))];

                                return (
                                    <div key={attr} className="mb-3">
                                        <div className="text-sm text-gray-600 mb-1">{attr}:</div>
                                        <div className="flex flex-wrap gap-2">
                                            {values.map((val) => {
                                                const tempAttrs = { ...selectedAttributes, [attr]: val };
                                                const variantExists = data.variants?.some(
                                                    (variant) =>
                                                        Object.entries(tempAttrs).every(
                                                            ([k, v]) => variant.attributes?.[k] === v
                                                        ) && variant.stock > 0
                                                );
                                                const isSelected = selectedAttributes[attr] === val;

                                                return (
                                                    <button
                                                        key={val}
                                                        disabled={!variantExists}
                                                        onClick={() => handleSelectAttribute(attr, val)}
                                                        className={`px-3 py-1 rounded border text-sm
                                                            ${isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'}
                                                            ${!variantExists ? 'opacity-50 cursor-not-allowed' : ''}
                                                        `}
                                                    >
                                                        {val}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="text-sm text-gray-600 mb-2">
                                Còn: <span className="text-red-500 font-semibold">
                                    {data.hasVariants
                                        ? selectedVariant?.stock ?? 'Vui lòng chọn biến thể'
                                        : data.countInStock}
                                </span>
                                <span className='ml-10'>
                                    Đã bán: <span className="text-red-500 font-semibold">
                                        {data.hasVariants
                                            ? selectedVariant?.sold ?? 'Vui lòng chọn biến thể'
                                            : data.sold}
                                    </span>
                                </span>
                            </div>

                            <div className="flex items-center mb-4">
                                <span className="text-3xl font-bold text-red-500 mr-3">
                                    {data.hasVariants
                                        ? (selectedVariant?.price ? `${selectedVariant.price.toLocaleString('vi-VN')}₫` : "—")
                                        : `${data.price.toLocaleString('vi-VN')}₫`}
                                </span>
                            </div>

                            <div className="flex items-center mb-4 flex-wrap gap-2">
                                <button onClick={handleAddToCart} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">Thêm vào giỏ hàng</button>
                                <button onClick={handleCheckout} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">Mua ngay</button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex flex-wrap border-b mb-4 gap-2">
                            <button
                                onClick={() => setActiveTab("description")}
                                className={`px-4 py-2 font-semibold ${activeTab === "description"
                                    ? "text-blue-600 border-b-2 border-blue-500"
                                    : "text-gray-500"
                                    }`}
                            >
                                MÔ TẢ SẢN PHẨM
                            </button>
                            <button
                                onClick={() => setActiveTab("review")}
                                className={`px-4 py-2 font-semibold ${activeTab === "review"
                                    ? "text-blue-600 border-b-2 border-blue-500"
                                    : "text-gray-500"
                                    }`}
                            >
                                ĐÁNH GIÁ SẢN PHẨM
                            </button>
                        </div>
                        {activeTab === "description" && (
                            <div className="text-gray-600 text-sm whitespace-pre-line">
                                {data.description}
                            </div>
                        )}

                        {activeTab === "review" && (
                            <div>
                                {
                                    user.login &&
                                    <Button type="primary" onClick={() => setModalOpen(true)}>Thêm đánh giá</Button>
                                }
                                <Modal
                                    title="Viết đánh giá"
                                    open={modalOpen}
                                    onCancel={() => setModalOpen(false)}
                                    footer={null}
                                >
                                    <Form form={form} layout="vertical" onFinish={handleSubmitReview}>
                                        <Form.Item label="Nội dung" name="content" rules={[{ required: true }]}>
                                            <TextArea rows={4} />
                                        </Form.Item>
                                        <Form.Item label="Đánh giá sao" name="rating" rules={[{ required: true }]}>
                                            <Rate />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit">Gửi đánh giá</Button>
                                        </Form.Item>
                                    </Form>
                                </Modal>

                                {/* Danh sách đánh giá */}
                                <List
                                    itemLayout="vertical"
                                    dataSource={Array.isArray(reviews.data) ? reviews.data : []}
                                    renderItem={review => (
                                        <Comment
                                            key={review._id}
                                            author={`${review?.userId?.name} (Người dùng)`}
                                            content={
                                                <>
                                                    <Rate disabled value={review.rating} />
                                                    <p>{review.content}</p>
                                                </>
                                            }
                                            datetime={dayjs(review.createdAt).format('HH:mm DD/MM/YYYY')}
                                            actions={[
                                                user.login &&
                                                <span onClick={() => {
                                                    setReplyForms(prev => ({
                                                        ...prev,
                                                        [review._id]: prev[review._id] === undefined ? '' : undefined
                                                    }));
                                                }}>
                                                    💬 Phản hồi
                                                </span>
                                            ]}
                                        >
                                            {review.replies?.map((reply, index) => (
                                                <Comment
                                                    key={index}
                                                    author={`${reply?.userId?.name} (${reply.role === 'admin' ? 'Shop' : 'Người dùng'})`}
                                                    content={reply.content}
                                                    datetime={dayjs(reply.createdAt).format('HH:mm DD/MM/YYYY')}
                                                />
                                            ))}

                                            {replyForms[review._id] !== undefined && (
                                                <div>
                                                    <TextArea
                                                        rows={2}
                                                        placeholder="Nhập phản hồi..."
                                                        value={replyForms[review._id]}
                                                        onChange={e =>
                                                            setReplyForms(prev => ({ ...prev, [review._id]: e.target.value }))
                                                        }
                                                    />
                                                    <Button
                                                        type="primary"
                                                        size="small"
                                                        onClick={() => handleReplySubmit(review._id, replyForms[review._id])}
                                                    >
                                                        Gửi phản hồi
                                                    </Button>
                                                </div>
                                            )}
                                        </Comment>
                                    )}
                                />
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="font-bold text-lg mb-3">Sản phẩm liên quan</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                            {isLoadingRelated && (
                                <div className="flex justify-center items-center h-40 col-span-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                                </div>
                            )}

                            {products?.map((product) => {
                                const item = product.hasVariants
                                    ? (product.variants.reduce((max, v) => (v.sold || 0) > (max.sold || 0)
                                        ? v
                                        : max, product.variants[0]))
                                    : product;
                                return (
                                    <div
                                        key={product._id}
                                        onClick={() => navigate(`/detail/${product._id}`)}
                                        className="group relative bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer hover:-translate-y-1 duration-200"
                                        style={{ height: '320px' }}
                                    >
                                        <img
                                            src={`${process.env.REACT_APP_API_URL_BACKEND}/image/${product.image}`}
                                            alt={product.name}
                                            loading="lazy"
                                            style={{ height: '230px', width: '100%', objectFit: 'cover' }}
                                        />
                                        <div className="p-3 flex flex-col justify-between" style={{ height: '90px' }}>
                                            <h3 className="text-gray-800 font-semibold text-sm line-clamp-2">
                                                {product.name}
                                            </h3>
                                            <div className="flex justify-between text-sm mt-1">
                                                <p className="text-blue-600 font-bold">{item.price.toLocaleString()}₫</p>
                                                <p className="text-gray-600">Đã bán: {(item.sold || 0).toLocaleString('vi-VN')}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;