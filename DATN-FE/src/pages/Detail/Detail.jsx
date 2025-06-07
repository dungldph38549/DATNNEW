import React from 'react'

const Detail = () => {
return (
    <div className="bg-gray-100 min-h-screen p-4">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-2">
            Home / Clothing / <span className="text-blue-600">Floral Print Buttoned</span>
        </div>
        <div className="flex gap-4">
            {/* Left Sidebar */}
            <div className="w-1/4 flex flex-col gap-4">
                {/* Download App */}
                <div className="bg-white rounded shadow p-4 flex flex-col items-center">
                    <img src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png" alt="App" className="w-16 mb-2" />
                    <span className="text-xs text-center">Download Flipmart App</span>
                </div>
                {/* Hot Deals */}
                <div className="bg-white rounded shadow p-4">
                    <h3 className="font-semibold text-sm mb-2">HOT DEALS</h3>
                    <div className="relative">
                        <img src="https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/8e6e7c6a-2e63-4c4e-8c1a-6e7e0e92ce5a/air-max-90-shoes.png" alt="Hot Deal" className="w-full rounded" />
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">30% Off</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <span className="bg-gray-200 px-2 py-1 rounded text-xs">120</span>
                        <span className="bg-gray-200 px-2 py-1 rounded text-xs">36</span>
                        <span className="bg-gray-200 px-2 py-1 rounded text-xs">36</span>
                    </div>
                    <div className="mt-2">
                        <div className="text-xs text-gray-700">Floral Print Buttoned</div>
                        <div className="font-bold text-blue-600">$600.00</div>
                        <button className="mt-2 w-full bg-blue-600 text-white text-xs py-1 rounded">Add to cart</button>
                    </div>
                </div>
                {/* Newsletter */}
                <div className="bg-white rounded shadow p-4">
                    <h3 className="font-semibold text-sm mb-2">NEWSLETTERS</h3>
                    <input type="email" placeholder="Your email" className="w-full border px-2 py-1 rounded text-xs mb-2" />
                    <button className="w-full bg-blue-600 text-white text-xs py-1 rounded">Subscribe</button>
                </div>
                {/* Author */}
                <div className="bg-white rounded shadow p-4 flex items-center gap-2">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="John Doe" className="w-12 h-12 rounded-full" />
                    <div>
                        <div className="text-xs font-semibold">John Doe</div>
                        <div className="text-xs text-gray-500">Ace Company</div>
                    </div>
                </div>
            </div>
            {/* Main Content */}
            <div className="w-3/4 flex flex-col gap-4">
                {/* Product Top */}
                <div className="bg-white rounded shadow p-6 flex gap-6">
                    {/* Product Image */}
                    <div className="w-1/3 flex flex-col items-center">
                        <img src="https://pngimg.com/d/jacket_PNG8036.png" alt="Product" className="w-48 h-48 object-contain mb-4" />
                        {/* Thumbnails */}
                        <div className="flex gap-2">
                            <img src="https://pngimg.com/d/jacket_PNG8036.png" alt="thumb1" className="w-12 h-12 border rounded" />
                            <img src="https://pngimg.com/d/jacket_PNG8036.png" alt="thumb2" className="w-12 h-12 border rounded" />
                            <img src="https://pngimg.com/d/jacket_PNG8036.png" alt="thumb3" className="w-12 h-12 border rounded" />
                        </div>
                    </div>
                    {/* Product Info */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2">Floral Print Buttoned</h2>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-yellow-400">&#9733;&#9733;&#9733;&#9733;&#9734;</span>
                            <span className="text-xs text-gray-500">(13 reviews)</span>
                        </div>
                        <div className="text-xs mb-1">
                            Availability: <span className="text-green-600 font-semibold">In Stock</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl font-bold text-red-600">$800.00</span>
                            <span className="text-sm text-gray-400 line-through">$1000.00</span>
                        </div>
                        {/* Quantity and Add to Cart */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs">QTY:</span>
                            <input type="number" min="1" defaultValue="1" className="w-16 border rounded px-2 py-1 text-xs" />
                            <button className="bg-blue-600 text-white px-4 py-2 rounded text-xs font-semibold">ADD TO CART</button>
                        </div>
                        {/* Social Icons */}
                        <div className="flex gap-2 mt-2">
                            <button className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white transition">&#9829;</button>
                            <button className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white transition">&#128257;</button>
                        </div>
                    </div>
                </div>
                {/* Tabs */}
                <div className="bg-white rounded shadow p-4">
                    <div className="flex border-b mb-4">
                        <button className="px-4 py-2 border-b-2 border-blue-600 font-semibold text-blue-600">DESCRIPTION</button>
                        <button className="px-4 py-2 text-gray-500">REVIEW</button>
                        <button className="px-4 py-2 text-gray-500">TAGS</button>
                    </div>
                    <div className="text-sm text-gray-700">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </div>
                </div>
                {/* Upsell Products */}
                <div className="bg-white rounded shadow p-4">
                    <h3 className="font-semibold text-base mb-4">UPSELL PRODUCTS</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {/* Product Card 1 */}
                        <div className="border rounded p-2 flex flex-col items-center">
                            <img src="https://pngimg.com/d/jacket_PNG8036.png" alt="Product" className="w-20 h-20 object-contain mb-2" />
                            <div className="text-xs text-gray-700 mb-1">Floral Print Buttoned</div>
                            <div className="font-bold text-blue-600 text-sm mb-1">$650.99</div>
                            <button className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Add to cart</button>
                        </div>
                        {/* Product Card 2 */}
                        <div className="border rounded p-2 flex flex-col items-center">
                            <img src="https://pngimg.com/d/jacket_PNG8036.png" alt="Product" className="w-20 h-20 object-contain mb-2" />
                            <div className="text-xs text-gray-700 mb-1">Floral Print Buttoned</div>
                            <div className="font-bold text-blue-600 text-sm mb-1">$650.99</div>
                            <button className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Add to cart</button>
                        </div>
                        {/* Product Card 3 */}
                        <div className="border rounded p-2 flex flex-col items-center">
                            <img src="https://pngimg.com/d/jacket_PNG8036.png" alt="Product" className="w-20 h-20 object-contain mb-2" />
                            <div className="text-xs text-gray-700 mb-1">Floral Print Buttoned</div>
                            <div className="font-bold text-blue-600 text-sm mb-1">$650.99</div>
                            <button className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Add to cart</button>
                        </div>
                        {/* Product Card 4 */}
                        <div className="border rounded p-2 flex flex-col items-center">
                            <img src="https://pngimg.com/d/jacket_PNG8036.png" alt="Product" className="w-20 h-20 object-contain mb-2" />
                            <div className="text-xs text-gray-700 mb-1">Floral Print Buttoned</div>
                            <div className="font-bold text-blue-600 text-sm mb-1">$650.99</div>
                            <button className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Add to cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)
}

export default Detail