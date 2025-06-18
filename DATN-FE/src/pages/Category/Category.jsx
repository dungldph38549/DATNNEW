import React from 'react'

const Category = () => {
  return (
    <div className='flex max-w-[1200px] mx-auto mt-8'>
        <div className='w-[300px]    items-center justify-center '>
            <div className='t_1'>
                <div className="bg-yellow-400 flex items-center px-4 py-3 rounded-t">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span className="font-bold text-lg">CATEGORIES</span>
            </div>
            <ul className="bg-white rounded-b shadow divide-y">
                <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer">
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 7h16M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M4 7l8-5 8 5"/>
                    </svg>
                    <span className="flex-1">Clothing</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7"/>
                    </svg>
                </li>
                <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer">
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="7" width="18" height="13" rx="2"/>
                        <path d="M16 3v4M8 3v4"/>
                    </svg>
                    <span className="flex-1">Electronics</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7"/>
                    </svg>
                </li>
                <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer">
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span className="flex-1">Shoes</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7"/>
                    </svg>
                </li>
                <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer">
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <circle cx="12" cy="12" r="4"/>
                    </svg>
                    <span className="flex-1">Watches</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7"/>
                    </svg>
                </li>
                <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer">
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 017.5 3c1.74 0 3.41.81 4.5 2.09A6.5 6.5 0 0116.5 3 5.5 5.5 0 0122 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/>
                    </svg>
                    <span className="flex-1">Jewellery</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7"/>
                    </svg>
                </li>
                <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer">
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm0-16a7 7 0 100 14 7 7 0 000-14zm0 3a4 4 0 110 8 4 4 0 010-8z"/>
                    </svg>
                    <span className="flex-1">Health and Beauty</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7"/>
                    </svg>
                </li>
                <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer">
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M2.5 19.5l19-7-7 19-2.5-7-7-2.5z"/>
                    </svg>
                    <span className="flex-1">Kids and Babies</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7"/>
                    </svg>
                </li>
                <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer">
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M8 15l4-8 4 8"/>
                    </svg>
                    <span className="flex-1">Sports</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7"/>
                    </svg>
                </li>
                <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer rounded-b">
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 21v-2a4 4 0 014-4h10a4 4 0 014 4v2"/>
                        <path d="M16 3.13a4 4 0 010 7.75"/>
                        <path d="M8 3.13a4 4 0 010 7.75"/>
                    </svg>
                    <span className="flex-1">Home and Garden</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7"/>
                    </svg>
                </li>
            </ul>
            </div>
            <div className='t_2'> 
                <div className="bg-white rounded shadow p-4 mt-6">
                    <div className="font-bold mb-2 border-b pb-2">SHOP BY</div>
                    <div className="mt-4">
                        <div className="font-semibold mb-2">Category</div>
                        <ul className="mb-4">
                            {["Camera", "Desktops", "Pants", "Bags", "Hats", "Accessories"].map((cat) => (
                                <li key={cat} className="flex justify-between items-center py-1 text-sm cursor-pointer hover:font-semibold">
                                    <span>{cat}</span>
                                    <span className="text-lg font-bold">+</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mb-4">
                            <div className="font-semibold mb-2">Price Slider</div>
                            <div className="flex justify-between mb-2">
                                <span className="text-red-600 font-bold">$200.00</span>
                                <span className="text-red-600 font-bold">$800.00</span>
                            </div>
                            <div className="flex items-center mb-2">
                                <input type="range" min="200" max="800" className="w-full accent-blue-500" />
                            </div>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm font-semibold">Show Now</button>
                        </div>
                        <div className="mb-4">
                            <div className="font-semibold mb-2">Manufactures</div>
                            <ul className="text-sm space-y-1">
                                <li>Forever 18</li>
                                <li>Nike</li>
                                <li>Dolce & Gabbana</li>
                                <li>Alluare</li>
                                <li>Chanel</li>
                                <li>Other Brand</li>
                            </ul>
                        </div>
                        <div>
                            <div className="font-semibold mb-2">Colors</div>
                            <ul className="text-sm space-y-1">
                                <li>Red</li>
                                <li>Blue</li>
                                <li>Yellow</li>
                                <li>Pink</li>
                                <li>Brown</li>
                                <li>Teal</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className='t_3'> 
            <div className="bg-white rounded shadow p-4 mt-6">
                <div className="font-bold mb-2 border-b pb-2 uppercase text-sm">Compare Products</div>
                <div className="mt-4 text-sm">
                    You have no <span className="text-blue-600 cursor-pointer hover:underline">item(s)</span> to compare
                </div>
            </div>
            </div>
            <div className='t_4'>
                <div className="bg-white rounded shadow p-4 mt-6">
                    <div className="font-bold mb-2 border-b pb-2 uppercase text-sm">Product Tags</div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {[
                            "Phone",
                            "Vest",
                            "Smartphone",
                            "Furniture",
                            "T-shirt",
                            "Sweatpants",
                            "Sneaker",
                            "Toys",
                            "Rose",
                        ].map((tag, idx) => (
                            <button
                                key={tag}
                                className={`px-4 py-2 rounded text-sm font-medium ${
                                    tag === "Vest"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                                }`}
                                type="button"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className='t_5'>
                        <div className="bg-white rounded shadow p-6 mt-6 flex flex-col items-center text-center">
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="User"
                                className="w-24 h-24 rounded-full object-cover mb-4"
                            />
                            <p className="text-gray-600 text-base mb-4">
                                "Vtae sodales aliq uam morbi non sem lacus port mollis. Nunc condime tum metus eud molest sed consectetuer."
                            </p>
                            <div className="font-bold text-lg mb-1">John Doe</div>
                            <div className="text-gray-400 text-sm mb-4">Abc Company</div>
                            <div className="flex justify-center space-x-2">
                                <span className="w-3 h-3 rounded bg-blue-500 inline-block"></span>
                                <span className="w-3 h-3 rounded bg-gray-200 inline-block"></span>
                                <span className="w-3 h-3 rounded bg-gray-200 inline-block"></span>
                            </div>
                        </div>
            </div>
            <div className='t_6'>
                        <div className="bg-yellow-400 rounded shadow flex flex-col items-center justify-center p-6 mt-6">
                            <img
                                src="https://i.imgur.com/7yUvePI.png"
                                alt="Electronics"
                                className="w-32 h-32 object-contain mb-4"
                                style={{ background: "transparent" }}
                            />
                            <div className="bg-white w-full py-3 rounded-b text-center">
                                <span className="font-semibold text-gray-800">Download Flipmart App</span>
                            </div>
                        </div>
            </div>
        </div>
        <div className='w-[850px] ml-4'>
            <div className='p_1'>
                        <div
                            className="relative w-[850px] h-[350px] rounded-lg overflow-hidden shadow-lg"
                            style={{
                                backgroundImage:
                                    "url('https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                            <div className="absolute left-10 top-1/2 -translate-y-1/2 z-10">
                                <div className="text-[100px] font-bold text-yellow-400 leading-none">BIG SALE</div>
                                <div className="mt-4 text-white text-4xl font-semibold">Save up to 49% off</div>
                                <div className="mt-2 text-gray-200 text-lg">Lorem ipsum dolor sit amet, consectetur adipisicing elit</div>
                            </div>
                        </div>
            </div>
            <div className='p_2 mt-6'>
                            <div>
                                {/* Toolbar */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-2">
                                        <button className="p-2 border rounded bg-gray-100 hover:bg-gray-200">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <rect x="3" y="3" width="6" height="6" />
                                                <rect x="11" y="3" width="6" height="6" />
                                                <rect x="3" y="11" width="6" height="6" />
                                                <rect x="11" y="11" width="6" height="6" />
                                            </svg>
                                        </button>
                                        <button className="p-2 border rounded bg-white hover:bg-gray-100">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path d="M4 6h16M4 12h16M4 18h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            <span className="text-gray-500 mr-1">Sort by</span>
                                            <select className="border rounded px-2 py-1 text-sm">
                                                <option>Position</option>
                                                <option>Name</option>
                                                <option>Price</option>
                                            </select>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 mr-1">Show</span>
                                            <select className="border rounded px-2 py-1 text-sm">
                                                <option>9</option>
                                                <option>12</option>
                                                <option>18</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <button className="w-6 h-6 rounded border bg-blue-500 text-white">1</button>
                                            <button className="w-6 h-6 rounded border bg-white text-gray-700">2</button>
                                            <button className="w-6 h-6 rounded border bg-white text-gray-700">3</button>
                                            <span className="text-gray-400">...</span>
                                            <button className="w-6 h-6 rounded border bg-white text-gray-700">
                                                <svg className="w-3 h-3 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M9 5l7 7-7 7"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Product Grid */}
                                <div className="grid grid-cols-3 gap-6">
                                    {/* Product Card 1 */}
                                    <div className="bg-white rounded shadow p-4 flex flex-col">
                                        <div className="relative">
                                            <img src="https://i.imgur.com/1GrakTl.jpg" alt="Shoes" className="w-full h-40 object-contain mb-2" />
                                            <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">SALE</span>
                                        </div>
                                        <div className="font-semibold text-sm mb-1">Floral Print Buttoned</div>
                                        <div className="flex items-center mb-1">
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-gray-300 text-lg">★</span>
                                        </div>
                                        <div className="font-bold text-lg text-red-600">$450.99 <span className="text-gray-400 line-through text-base">$800.00</span></div>
                                    </div>
                                    {/* Product Card 2 */}
                                    <div className="bg-white rounded shadow p-4 flex flex-col">
                                        <div className="relative">
                                            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Clothing" className="w-full h-40 object-contain mb-2" />
                                            <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">NEW</span>
                                        </div>
                                        <div className="font-semibold text-sm mb-1">Floral Print Buttoned</div>
                                        <div className="flex items-center mb-1">
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-gray-300 text-lg">★</span>
                                        </div>
                                        <div className="font-bold text-lg text-red-600">$450.99 <span className="text-gray-400 line-through text-base">$800.00</span></div>
                                    </div>
                                    {/* Product Card 3 */}
                                    <div className="bg-white rounded shadow p-4 flex flex-col">
                                        <div className="relative">
                                            <img src="https://i.imgur.com/Uv2Yqzo.jpg" alt="Red Shoes" className="w-full h-40 object-contain mb-2" />
                                            <span className="absolute top-2 right-2 bg-pink-400 text-xs font-bold px-2 py-1 rounded">HOT</span>
                                        </div>
                                        <div className="font-semibold text-sm mb-1">Floral Print Buttoned</div>
                                        <div className="flex items-center mb-1">
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-gray-300 text-lg">★</span>
                                        </div>
                                        <div className="font-bold text-lg text-red-600">$450.99 <span className="text-gray-400 line-through text-base">$800.00</span></div>
                                    </div>
                                    {/* Product Card 4 */}
                                    <div className="bg-white rounded shadow p-4 flex flex-col">
                                        <div className="relative">
                                            <img src="https://i.imgur.com/Uv2Yqzo.jpg" alt="Red Shoes" className="w-full h-40 object-contain mb-2" />
                                            <span className="absolute top-2 right-2 bg-pink-400 text-xs font-bold px-2 py-1 rounded">HOT</span>
                                        </div>
                                        <div className="font-semibold text-sm mb-1">Floral Print Buttoned</div>
                                        <div className="flex items-center mb-1">
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-gray-300 text-lg">★</span>
                                        </div>
                                        <div className="font-bold text-lg text-red-600">$450.99 <span className="text-gray-400 line-through text-base">$800.00</span></div>
                                    </div>
                                    {/* Product Card 5 */}
                                    <div className="bg-white rounded shadow p-4 flex flex-col">
                                        <div className="relative">
                                            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Jacket" className="w-full h-40 object-contain mb-2" />
                                            <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">SALE</span>
                                        </div>
                                        <div className="font-semibold text-sm mb-1">Floral Print Buttoned</div>
                                        <div className="flex items-center mb-1">
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-gray-300 text-lg">★</span>
                                        </div>
                                        <div className="font-bold text-lg text-red-600">$450.99 <span className="text-gray-400 line-through text-base">$800.00</span></div>
                                    </div>
                                    {/* Product Card 6 */}
                                    <div className="bg-white rounded shadow p-4 flex flex-col">
                                        <div className="relative">
                                            <img src="https://i.imgur.com/7yUvePI.png" alt="Coat" className="w-full h-40 object-contain mb-2" />
                                            <span className="absolute top-2 right-2 bg-blue-400 text-xs font-bold px-2 py-1 rounded">NEW</span>
                                        </div>
                                        <div className="font-semibold text-sm mb-1">Floral Print Buttoned</div>
                                        <div className="flex items-center mb-1">
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-gray-300 text-lg">★</span>
                                        </div>
                                        <div className="font-bold text-lg text-red-600">$450.99 <span className="text-gray-400 line-through text-base">$800.00</span></div>
                                    </div>
                                    {/* Product Card 7 */}
                                    <div className="bg-white rounded shadow p-4 flex flex-col">
                                        <div className="relative">
                                            <img src="https://i.imgur.com/7yUvePI.png" alt="Jewellery" className="w-full h-40 object-contain mb-2" />
                                            <span className="absolute top-2 right-2 bg-blue-400 text-xs font-bold px-2 py-1 rounded">NEW</span>
                                            <div className="absolute bottom-2 left-2 flex space-x-2">
                                                <button className="bg-yellow-400 p-2 rounded text-white hover:bg-yellow-500">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path d="M5 13l4 4L19 7"/>
                                                    </svg>
                                                </button>
                                                <button className="bg-blue-500 p-2 rounded text-white hover:bg-blue-600">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <circle cx="12" cy="12" r="10"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="font-semibold text-sm mb-1">Floral Print Buttoned</div>
                                        <div className="flex items-center mb-1">
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-gray-300 text-lg">★</span>
                                        </div>
                                        <div className="font-bold text-lg text-red-600">$450.99 <span className="text-gray-400 line-through text-base">$800.00</span></div>
                                    </div>
                                    {/* Product Card 8 */}
                                    <div className="bg-white rounded shadow p-4 flex flex-col">
                                        <div className="relative">
                                            <img src="https://i.imgur.com/7yUvePI.png" alt="Wallet" className="w-full h-40 object-contain mb-2" />
                                            <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">SALE</span>
                                        </div>
                                        <div className="font-semibold text-sm mb-1">Floral Print Buttoned</div>
                                        <div className="flex items-center mb-1">
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-gray-300 text-lg">★</span>
                                        </div>
                                        <div className="font-bold text-lg text-red-600">$450.99 <span className="text-gray-400 line-through text-base">$800.00</span></div>
                                    </div>
                                    {/* Product Card 9 */}
                                    <div className="bg-white rounded shadow p-4 flex flex-col">
                                        <div className="relative">
                                            <img src="https://i.imgur.com/7yUvePI.png" alt="Watch" className="w-full h-40 object-contain mb-2" />
                                            <span className="absolute top-2 right-2 bg-pink-400 text-xs font-bold px-2 py-1 rounded">HOT</span>
                                        </div>
                                        <div className="font-semibold text-sm mb-1">Floral Print Buttoned</div>
                                        <div className="flex items-center mb-1">
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-gray-300 text-lg">★</span>
                                        </div>
                                        <div className="font-bold text-lg text-red-600">$450.99 <span className="text-gray-400 line-through text-base">$800.00</span></div>
                                    </div>
                                    {/* Product Card 10 */}
                                    <div className="bg-white rounded shadow p-4 flex flex-col">
                                        <div className="relative">
                                            <img src="https://i.imgur.com/7yUvePI.png" alt="Sunglasses" className="w-full h-40 object-contain mb-2" />
                                            <span className="absolute top-2 right-2 bg-blue-400 text-xs font-bold px-2 py-1 rounded">NEW</span>
                                        </div>
                                        <div className="font-semibold text-sm mb-1">Floral Print Buttoned</div>
                                        <div className="flex items-center mb-1">
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-gray-300 text-lg">★</span>
                                        </div>
                                        <div className="font-bold text-lg text-red-600">$450.99 <span className="text-gray-400 line-through text-base">$800.00</span></div>
                                    </div>
                                    {/* Product Card 11 */}
                                    <div className="bg-white rounded shadow p-4 flex flex-col">
                                        <div className="relative">
                                            <img src="https://i.imgur.com/7yUvePI.png" alt="Skirt" className="w-full h-40 object-contain mb-2" />
                                            <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">SALE</span>
                                        </div>
                                        <div className="font-semibold text-sm mb-1">Floral Print Buttoned</div>
                                        <div className="flex items-center mb-1">
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-gray-300 text-lg">★</span>
                                        </div>
                                        <div className="font-bold text-lg text-red-600">$450.99 <span className="text-gray-400 line-through text-base">$800.00</span></div>
                                    </div>
                                    {/* Product Card 12 */}
                                    <div className="bg-white rounded shadow p-4 flex flex-col">
                                        <div className="relative">
                                            <img src="https://i.imgur.com/7yUvePI.png" alt="Hat" className="w-full h-40 object-contain mb-2" />
                                            <span className="absolute top-2 right-2 bg-pink-400 text-xs font-bold px-2 py-1 rounded">HOT</span>
                                        </div>
                                        <div className="font-semibold text-sm mb-1">Floral Print Buttoned</div>
                                        <div className="flex items-center mb-1">
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="text-gray-300 text-lg">★</span>
                                        </div>
                                        <div className="font-bold text-lg text-red-600">$450.99 <span className="text-gray-400 line-through text-base">$800.00</span></div>
                                    </div>
                                </div>
                                {/* Pagination */}
                                <div className="flex justify-end mt-8 space-x-2">
                                    <button className="w-8 h-8 rounded border bg-blue-500 text-white">1</button>
                                    <button className="w-8 h-8 rounded border bg-white text-gray-700">2</button>
                                    <button className="w-8 h-8 rounded border bg-white text-gray-700">3</button>
                                    <span className="text-gray-400">...</span>
                                    <button className="w-8 h-8 rounded border bg-white text-gray-700">
                                        <svg className="w-3 h-3 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M9 5l7 7-7 7"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
            </div>
        </div>
    </div>
  )
}

export default Category