import React from 'react'

const Checkout = () => {
return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen py-8 px-2 md:px-8 w-[1200px] mx-auto">
        {/* Main Checkout Steps */}
        <div className="flex-1 bg-white rounded shadow p-6 md:mr-8">
            {/* Step 1: Checkout Method */}
            <div>
                <div className="flex items-center bg-blue-50 rounded-t px-4 py-2 mb-4">
                    <span className="bg-blue-600 text-white rounded px-3 py-1 mr-3 font-bold">1</span>
                    <span className="font-semibold">CHECKOUT METHOD</span>
                </div>
                <div className="md:flex gap-8 mb-6">
                    {/* Guest/Register */}
                    <div className="flex-1 mb-6 md:mb-0">
                        <div className="font-semibold mb-2">Guest or Register Login</div>
                        <div className="text-sm mb-2">Register with us for future convenience:</div>
                        <div className="flex items-center mb-2">
                            <input type="radio" id="guest" name="checkout" defaultChecked className="mr-2" />
                            <label htmlFor="guest" className="mr-6">Checkout as Guest</label>
                            <input type="radio" id="register" name="checkout" className="mr-2" />
                            <label htmlFor="register">Register</label>
                        </div>
                        <div className="mt-4">
                            <div className="font-semibold mb-1">Register and save time</div>
                            <div className="text-sm mb-1">Register with us for future convenience:</div>
                            <ul className="text-sm list-disc list-inside text-gray-600">
                                <li>Fast and easy check out</li>
                                <li>Easy access to your order history and status</li>
                            </ul>
                        </div>
                        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">CONTINUE</button>
                    </div>
                    {/* Already Registered */}
                    <div className="flex-1">
                        <div className="font-semibold mb-2">Already registered?</div>
                        <div className="text-sm mb-2">Please log in below:</div>
                        <form>
                            <label className="block text-sm mb-1" htmlFor="email">Email Address <span className="text-red-500">*</span></label>
                            <input id="email" type="email" className="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                            <label className="block text-sm mb-1" htmlFor="password">Password <span className="text-red-500">*</span></label>
                            <input id="password" type="password" className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                            <div className="mb-4">
                                <a href="#" className="text-xs text-blue-600 hover:underline">Forgot your Password?</a>
                            </div>
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">LOGIN</button>
                        </form>
                    </div>
                </div>
            </div>
            {/* Steps 2-6 */}
            <div className="space-y-4">
                <div className="flex items-center bg-gray-100 rounded px-4 py-2">
                    <span className="bg-gray-400 text-white rounded px-3 py-1 mr-3 font-bold">2</span>
                    <span className="font-semibold">BILLING INFORMATION</span>
                </div>
                <div className="flex items-center bg-gray-100 rounded px-4 py-2">
                    <span className="bg-gray-400 text-white rounded px-3 py-1 mr-3 font-bold">3</span>
                    <span className="font-semibold">SHIPPING INFORMATION</span>
                </div>
                <div className="flex items-center bg-gray-100 rounded px-4 py-2">
                    <span className="bg-gray-400 text-white rounded px-3 py-1 mr-3 font-bold">4</span>
                    <span className="font-semibold">SHIPPING METHOD</span>
                </div>
                <div className="flex items-center bg-gray-100 rounded px-4 py-2">
                    <span className="bg-gray-400 text-white rounded px-3 py-1 mr-3 font-bold">5</span>
                    <span className="font-semibold">PAYMENT INFORMATION</span>
                </div>
                <div className="flex items-center bg-gray-100 rounded px-4 py-2">
                    <span className="bg-gray-400 text-white rounded px-3 py-1 mr-3 font-bold">6</span>
                    <span className="font-semibold">ORDER REVIEW</span>
                </div>
            </div>
        </div>
        {/* Sidebar */}
        <div className="w-full md:w-80 mt-8 md:mt-0">
            <div className="bg-white rounded shadow p-6">
                <div className="font-semibold mb-4">YOUR CHECKOUT PROGRESS</div>
                <ul className="text-blue-600 text-sm space-y-2">
                    <li><a href="#" className="hover:underline">Billing Address</a></li>
                    <li><a href="#" className="hover:underline">Shipping Address</a></li>
                    <li><a href="#" className="hover:underline">Shipping Method</a></li>
                    <li><a href="#" className="hover:underline">Payment Method</a></li>
                </ul>
            </div>
        </div>
    </div>
)
}

export default Checkout