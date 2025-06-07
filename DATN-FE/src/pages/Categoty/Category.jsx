import React from 'react'

const Category = () => {
return (
    
    <div className="flex flex-col md:flex-row gap-6 p-4 bg-gray-100 min-h-screen">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 bg-white rounded-lg shadow p-4 space-y-6">
            {/* Categories */}
            <div>
                <h2 className="font-bold text-lg mb-2">CATEGORIES</h2>
                <ul className="space-y-1 text-gray-700">
                    <li className="hover:text-blue-600 cursor-pointer">Clothing</li>
                    <li className="hover:text-blue-600 cursor-pointer">Shoes</li>
                    <li className="hover:text-blue-600 cursor-pointer">Watches</li>
                    <li className="hover:text-blue-600 cursor-pointer">Accessories</li>
                    <li className="hover:text-blue-600 cursor-pointer">Health & Beauty</li>
                    <li className="hover:text-blue-600 cursor-pointer">Bags</li>
                    <li className="hover:text-blue-600 cursor-pointer">Jewelry</li>
                </ul>
            </div>
            {/* Price Filter */}
            <div>
                <h3 className="font-semibold mb-2">Price Slider</h3>
                <input type="range" min="0" max="1000" className="w-full" />
                <div className="flex justify-between text-sm mt-1">
                    <span>$0.00</span>
                    <span>$1000.00</span>
                </div>
                <button className="mt-2 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700">Filter</button>
            </div>
            {/* Manufacturers */}
            <div>
                <h3 className="font-semibold mb-2">Manufacturers</h3>
                <ul className="space-y-1 text-gray-700">
                    <li><input type="checkbox" className="mr-2" />Nike</li>
                    <li><input type="checkbox" className="mr-2" />Adidas</li>
                    <li><input type="checkbox" className="mr-2" />Gucci</li>
                    <li><input type="checkbox" className="mr-2" />Other Brand</li>
                </ul>
            </div>
            {/* Colors */}
            <div>
                <h3 className="font-semibold mb-2">Colors</h3>
                <div className="flex flex-wrap gap-2">
                    <span className="w-5 h-5 rounded-full bg-black border"></span>
                    <span className="w-5 h-5 rounded-full bg-red-500 border"></span>
                    <span className="w-5 h-5 rounded-full bg-blue-500 border"></span>
                    <span className="w-5 h-5 rounded-full bg-yellow-400 border"></span>
                    <span className="w-5 h-5 rounded-full bg-green-500 border"></span>
                    <span className="w-5 h-5 rounded-full bg-pink-400 border"></span>
                    <span className="w-5 h-5 rounded-full bg-gray-400 border"></span>
                </div>
            </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1">
            {/* Banner */}
            <div className="w-full h-48 md:h-56 rounded-lg overflow-hidden mb-6 relative">
                <img
                    src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80"
                    alt="Big Sale"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center pl-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-yellow-400">BIG SALE</h1>
                    <p className="text-white text-lg mt-2">Save up to 49% off</p>
                    <span className="text-gray-200 text-sm">Lorem ipsum dolor sit amet</span>
                </div>
            </div>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Product Card */}
                {[
                    {
                        img: "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/2b6e2e6b-8e5b-4e6b-8e8c-8e8c8e8c8e8c/air-max-90-shoes.png",
                        name: "Nike Air Max 90",
                        price: "$120.00",
                        oldPrice: "$150.00",
                        badge: "sale"
                    },
                    {
                        img: "https://randomuser.me/api/portraits/women/44.jpg",
                        name: "White T-shirt",
                        price: "$25.00",
                        badge: "new"
                    },
                    {
                        img: "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/2b6e2e6b-8e5b-4e6b-8e8c-8e8c8e8c8e8c/air-max-90-shoes.png",
                        name: "Red Sneakers",
                        price: "$99.00"
                    },
                    {
                        img: "https://randomuser.me/api/portraits/men/32.jpg",
                        name: "Men's Shirt",
                        price: "$35.00"
                    },
                    {
                        img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
                        name: "Red Jacket",
                        price: "$80.00",
                        badge: "hot"
                    },
                    {
                        img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
                        name: "Necklace",
                        price: "$40.00"
                    },
                    {
                        img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
                        name: "Wallet",
                        price: "$20.00"
                    },
                    {
                        img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
                        name: "Watch",
                        price: "$150.00"
                    },
                    {
                        img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
                        name: "Belt",
                        price: "$18.00"
                    },
                    {
                        img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
                        name: "Skirt",
                        price: "$28.00"
                    },
                    {
                        img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
                        name: "Hat",
                        price: "$15.00"
                    }
                ].map((product, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col relative">
                        {product.badge && (
                            <span className={`absolute top-3 right-3 px-2 py-1 text-xs rounded font-bold uppercase ${
                                product.badge === "sale"
                                    ? "bg-red-500 text-white"
                                    : product.badge === "new"
                                    ? "bg-blue-500 text-white"
                                    : "bg-yellow-400 text-black"
                            }`}>
                                {product.badge}
                            </span>
                        )}
                        <img src={product.img} alt={product.name} className="w-full h-40 object-contain mb-4" />
                        <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-blue-600">{product.price}</span>
                            {product.oldPrice && (
                                <span className="text-sm line-through text-gray-400">{product.oldPrice}</span>
                            )}
                        </div>
                        <button className="mt-auto bg-blue-600 text-white py-1 rounded hover:bg-blue-700">Add to cart</button>
                    </div>
                ))}
            </div>
        </main>
    </div>
)
}

export default Category