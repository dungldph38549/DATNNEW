import React from 'react'

const Detail = () => {
    return (
        <div className="bg-gray-100 min-h-screen py-6 px-2">
            <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
                {/* Sidebar */}
                <div className="col-span-3 space-y-6">
                    {/* Download App */}
                    <div className="bg-yellow-400 rounded-lg p-4 flex flex-col items-center">
                        <img src="https://i.imgur.com/3ZQ3Z5L.png" alt="Download App" className="w-28 h-28 object-contain mb-2" />
                        <button className="bg-white text-gray-800 font-semibold px-4 py-2 rounded shadow">Download Flipmart App</button>
                    </div>
                    {/* Hot Deals */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-semibold text-gray-700 mb-4">HOT DEALS</h3>
                        <div className="relative">
                            <img src="https://i.imgur.com/1Q9Z1Zm.png" alt="Hot Deal" className="w-full h-28 object-contain rounded" />
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">35% OFF</span>
                        </div>
                        <div className="mt-2">
                            <div className="flex space-x-2 text-xs text-gray-600">
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
                            <div className="flex items-center text-yellow-400 text-xs mt-1">
                                ★★★★☆
                            </div>
                            <div className="flex items-center mt-1">
                                <span className="text-lg font-bold text-blue-600 mr-2">$600.00</span>
                                <span className="line-through text-gray-400">$800.00</span>
                            </div>
                            <button className="mt-2 w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600 transition">Add to cart</button>
                        </div>
                    </div>
                    {/* Newsletter */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-semibold text-gray-700 mb-2">NEWSLETTERS</h3>
                        <p className="text-xs text-gray-500 mb-2">Sign Up for Our Newsletter!</p>
                        <input type="email" placeholder="Subscribe to our newsletter" className="w-full border rounded px-2 py-1 mb-2 text-sm" />
                        <button className="w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600 transition">Subscribe</button>
                    </div>
                    {/* Testimonial */}
                    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                        <img src="https://i.imgur.com/8Km9tLL.png" alt="John Doe" className="w-14 h-14 rounded-full mb-2 object-cover" />
                        <p className="text-xs text-gray-600 text-center mb-2">
                            "Vtae sodales aliq uam morbi non sem lacus port mollis. Nunc condime tum metus eud molest sed consectetuer."
                        </p>
                        <div className="text-sm font-semibold text-gray-700">John Doe</div>
                        <div className="text-xs text-gray-400">Abc Company</div>
                    </div>
                </div>
                {/* Main Content */}
                <div className="col-span-9 space-y-6">
                    {/* Product Top */}
                    <div className="bg-white rounded-lg shadow p-6 grid grid-cols-12 gap-6">
                        {/* Product Image */}
                        <div className="col-span-4 flex flex-col items-center">
                            <img src="https://i.imgur.com/1zQZ1Zm.jpg" alt="Product" className="w-64 h-64 object-cover rounded-lg mb-4" />
                            {/* Thumbnails */}
                            <div className="flex space-x-2">
                                <img src="https://i.imgur.com/1zQZ1Zm.jpg" alt="Thumb1" className="w-12 h-12 object-cover border-2 border-blue-500 rounded" />
                                <img src="https://i.imgur.com/3ZQ3Z5L.png" alt="Thumb2" className="w-12 h-12 object-cover border rounded" />
                                <img src="https://i.imgur.com/1Q9Z1Zm.png" alt="Thumb3" className="w-12 h-12 object-cover border rounded" />
                                <img src="https://i.imgur.com/8Km9tLL.png" alt="Thumb4" className="w-12 h-12 object-cover border rounded" />
                            </div>
                            {/* Dots */}
                            <div className="flex space-x-1 mt-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                                <span className="w-2 h-2 bg-gray-300 rounded-full inline-block"></span>
                                <span className="w-2 h-2 bg-gray-300 rounded-full inline-block"></span>
                            </div>
                        </div>
                        {/* Product Info */}
                        <div className="col-span-8">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Floral Print Buttoned</h1>
                            <div className="flex items-center text-yellow-400 text-sm mb-1">
                                ★★★★☆
                                <span className="text-xs text-gray-500 ml-2">(13 Reviews)</span>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                                Availability: <span className="text-red-500 font-semibold">In Stock</span>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                            <div className="flex items-center mb-4">
                                <span className="text-3xl font-bold text-red-500 mr-3">$800.00</span>
                                <span className="line-through text-gray-400 text-lg">$900.00</span>
                            </div>
                            <div className="flex items-center mb-4">
                                <span className="mr-2">QTY :</span>
                                <select className="border rounded px-2 py-1 mr-4">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                </select>
                                <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">ADD TO CART</button>
                            </div>
                        </div>
                    </div>
                    {/* Tabs */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex border-b mb-4">
                            <button className="px-4 py-2 border-b-2 border-blue-500 font-semibold text-blue-600">DESCRIPTION</button>
                            <button className="px-4 py-2 text-gray-500">REVIEW</button>
                            <button className="px-4 py-2 text-gray-500">TAGS</button>
                        </div>
                        <div className="text-gray-600 text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </div>
                    </div>
                    {/* Upsell Products */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">UPSELL PRODUCTS</h2>
                        <div className="grid grid-cols-4 gap-4">
                            {/* Product 1 */}
                            <div className="bg-gray-50 rounded-lg p-3 shadow hover:shadow-lg transition">
                                <img src="https://i.imgur.com/1zQZ1Zm.jpg" alt="Product1" className="w-full h-36 object-cover rounded mb-2" />
                                <div className="flex items-center justify-between mb-1">
                                    <span className="bg-yellow-300 text-xs font-bold px-2 py-1 rounded">SALE</span>
                                </div>
                                <div className="font-semibold text-gray-700">Floral Print Buttoned</div>
                                <div className="flex items-center text-yellow-400 text-xs mb-1">
                                    ★★★★☆
                                </div>
                                <div className="flex items-center">
                                    <span className="text-blue-600 font-bold mr-2">$650.99</span>
                                    <span className="line-through text-gray-400">$800</span>
                                </div>
                            </div>
                            {/* Product 2 */}
                            <div className="bg-gray-50 rounded-lg p-3 shadow hover:shadow-lg transition">
                                <img src="https://i.imgur.com/1Q9Z1Zm.png" alt="Product2" className="w-full h-36 object-cover rounded mb-2" />
                                <div className="flex items-center justify-between mb-1">
                                    <span className="bg-yellow-300 text-xs font-bold px-2 py-1 rounded">SALE</span>
                                </div>
                                <div className="font-semibold text-gray-700">Floral Print Buttoned</div>
                                <div className="flex items-center text-yellow-400 text-xs mb-1">
                                    ★★★★☆
                                </div>
                                <div className="flex items-center">
                                    <span className="text-blue-600 font-bold mr-2">$650.99</span>
                                    <span className="line-through text-gray-400">$800</span>
                                </div>
                            </div>
                            {/* Product 3 */}
                            <div className="bg-gray-50 rounded-lg p-3 shadow hover:shadow-lg transition">
                                <img src="https://i.imgur.com/3ZQ3Z5L.png" alt="Product3" className="w-full h-36 object-cover rounded mb-2" />
                                <div className="flex items-center justify-between mb-1">
                                    <span className="bg-red-400 text-xs font-bold px-2 py-1 rounded">HOT</span>
                                </div>
                                <div className="font-semibold text-gray-700">Floral Print Buttoned</div>
                                <div className="flex items-center text-yellow-400 text-xs mb-1">
                                    ★★★★☆
                                </div>
                                <div className="flex items-center">
                                    <span className="text-blue-600 font-bold mr-2">$650.99</span>
                                    <span className="line-through text-gray-400">$800</span>
                                </div>
                            </div>
                            {/* Product 4 */}
                            <div className="bg-gray-50 rounded-lg p-3 shadow hover:shadow-lg transition">
                                <img src="https://i.imgur.com/8Km9tLL.png" alt="Product4" className="w-full h-36 object-cover rounded mb-2" />
                                <div className="flex items-center justify-between mb-1">
                                    <span className="bg-blue-400 text-xs font-bold px-2 py-1 rounded">NEW</span>
                                </div>
                                <div className="font-semibold text-gray-700">Floral Print Buttoned</div>
                                <div className="flex items-center text-yellow-400 text-xs mb-1">
                                    ★★★★☆
                                </div>
                                <div className="flex items-center">
                                    <span className="text-blue-600 font-bold mr-2">$650.99</span>
                                    <span className="line-through text-gray-400">$800</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail