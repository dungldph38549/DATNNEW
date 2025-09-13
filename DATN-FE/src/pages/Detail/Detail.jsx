import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useDispatch } from "react-redux";
import { getProductById } from '../../api/index';
import { GET_IMAGE } from '../../const/index.ts';
import { addProduct } from "../../redux/cart/cartSlice";

const Detail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { data, isLoading, isError } = useQuery({
        queryKey: ['product-detail', id],
        queryFn: () => getProductById(id),
    });
     const handleAddToCart = (item) => {
        dispatch(addProduct(item));
        Swal.fire({
          icon: 'success',
          title: 'Đã thêm vào giỏ hàng',
          text: `"${item.name}" đã được thêm vào giỏ hàng.`,
          timer: 1500,
          showConfirmButton: false,
        });
      };
       
    if(isLoading) return <div>Loading...</div>;
    if(isError) return <div>Error</div>;
    return (
        <div className="bg-gray-100 min-h-screen py-6 px-2">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Sidebar */}
                <div className="md:col-span-3 space-y-6">
                    {/* Download App */}
                    {/* <div className="bg-yellow-400 rounded-lg p-4 flex flex-col items-center">
                        <img src="https://i.imgur.com/3ZQ3Z5L.png" alt="Download App" className="w-28 h-28 object-contain mb-2" />
                        <button className="bg-white text-gray-800 font-semibold px-4 py-2 rounded shadow">Download Flipmart App</button>
                    </div> */}
                    {/* Hot Deals */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-semibold text-gray-700 mb-4">HOT DEALS</h3>
                        <div className="relative">
                            <img src="https://i.imgur.com/1Q9Z1Zm.png" alt="Hot Deal" className="w-full h-28 object-contain rounded" />
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">35% OFF</span>
                        </div>
                        <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-600">
                                <div>
                                    <div className="font-bold text-gray-800">120</div>
                                    <div>Days</div>
                                </div>
                                <div>
                                    <div className="font-bold text-gray-800">20</div>
                                    <div>Hrs</div>
                                </div>
                                <div>
                                    <div className="font-bold text-gray-800">36</div>
                                    <div>Mins</div>
                                </div>
                                <div>
                                    <div className="font-bold text-gray-800">60</div>
                                    <div>Secs</div>
                                </div>
                            </div>
                            <div className="mt-2 font-semibold">Floral Print Buttoned</div>
                            <div className="flex items-center text-yellow-400 text-xs mt-1">★★★★☆</div>
                            <div className="flex items-center mt-1">
                                <span className="text-lg font-bold text-blue-600 mr-2">$600.00</span>
                                <span className="line-through text-gray-400">$800.00</span>
                            </div>
                            <button className="mt-2 w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600 transition">Add to cart</button>
                        </div>
                    </div>
                    {/* Newsletter */}
                    {/* <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-semibold text-gray-700 mb-2">NEWSLETTERS</h3>
                        <p className="text-xs text-gray-500 mb-2">Sign Up for Our Newsletter!</p>
                        <input type="email" placeholder="Subscribe to our newsletter" className="w-full border rounded px-2 py-1 mb-2 text-sm" />
                        <button className="w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600 transition">Subscribe</button>
                    </div> */}
                    {/* Testimonial */}
                    {/* <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                        <img src="https://i.imgur.com/8Km9tLL.png" alt="John Doe" className="w-14 h-14 rounded-full mb-2 object-cover" />
                        <p className="text-xs text-gray-600 text-center mb-2">
                            "Vtae sodales aliq uam morbi non sem lacus port mollis. Nunc condime tum metus eud molest sed consectetuer."
                        </p>
                        <div className="text-sm font-semibold text-gray-700">John Doe</div>
                        <div className="text-xs text-gray-400">Abc Company</div>
                    </div> */}
                </div>
                {/* Main Content */}
                <div className="md:col-span-9 space-y-6">
                    {/* Product Top */}
                    <div className="bg-white rounded-lg shadow p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Product Image */}
                        <div className="lg:col-span-4 flex flex-col items-center">
                            <img src={GET_IMAGE(data?.image)} alt={data?.name} className="w-64 h-64 object-cover rounded-lg mb-4" />
                            <div className="flex space-x-2">
                                {
                                    data?.srcImages.map((image, index) => (
                                        <img key={index} src={GET_IMAGE(image)} alt={data?.name} className="w-12 h-12 object-cover border-2 border-white rounded" />
                                    ))
                                }
                            </div>
                            {/* <div className="flex space-x-1 mt-2">
                                {
                                    data?.srcImages.map((image, index) => (
                                        <span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                                    ))
                                }
                            </div> */}
                        </div>
                        {/* Product Info */}
                        <div className="lg:col-span-8">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">{data.name}</h1>
                            <div className="flex items-center text-yellow-400 text-sm mb-1">
                                {
                                    !data?.rating ? 'Chưa có đánh giá' : 
                                    data.rating >= 5 ? <span>★★★★★</span> : 
                                    data.rating >= 4 ? <span>★★★★☆</span> : 
                                    data.rating >= 3 ? <span>★★★☆☆</span> : 
                                    data.rating >= 2 ? <span>★★☆☆☆</span> : 
                                    <span>☆</span>
                                }
                                {/* <span className="text-xs text-gray-500 ml-2">(13 Đánh giá)</span> */}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                                Danh muc: <span className="text-red-500 font-semibold">{ data.type }</span>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                                Còn: <span className="text-red-500 font-semibold">{ data.countInStock }</span>
                            </div>
                            <p className="text-gray-600 mb-4">
                                {data.sortDescription}
                            </p>
                            <div className="flex items-center mb-4">
                                <span className="text-3xl font-bold text-red-500 mr-3">{data.price}₫</span>
                                {/* <span className="line-through text-gray-400 text-lg">$900.00</span> */}
                            </div>
                            <div className="flex items-center mb-4 flex-wrap gap-2">
                                {/* <span>QTY :</span>
                                <select className="border rounded px-2 py-1">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                </select> */}
                                <button onClick={() => handleAddToCart(data)} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">Thêm vào giỏ hàng </button>
                            </div>
                        </div>
                    </div>
                    {/* Tabs */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex flex-wrap border-b mb-4 gap-2">
                            <button className="px-4 py-2 border-b-2 border-blue-500 font-semibold text-blue-600">DESCRIPTION</button>
                            <button className="px-4 py-2 text-gray-500">REVIEW</button>
                            <button className="px-4 py-2 text-gray-500">TAGS</button>
                        </div>
                        <div className="text-gray-600 text-sm">
                            {data.description}
                        </div>
                    </div>
                    {/* Upsell Products */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">UPSELL PRODUCTS</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {/* Product items giữ nguyên như cũ */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;