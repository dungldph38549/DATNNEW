import React from 'react'

const FooterComponent = () => {
return (
    <footer className="bg-neutral-900 text-neutral-200 pt-12 pb-4">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Contact Us */}
            <div>
                <h3 className="font-bold mb-4 text-lg">CONTACT US</h3>
                <div className="flex items-start mb-3">
                    <span className="material-icons mr-3 text-xl">location_on</span>
                    <div>
                        ThemesGround, 789 Main rd,<br />
                        Anytown, CA 12345 USA
                    </div>
                </div>
                <div className="flex items-center mb-3">
                    <span className="material-icons mr-3 text-xl">phone</span>
                    <div>
                        +(888) 123-4567<br />
                        +(888) 456-7890
                    </div>
                </div>
                <div className="flex items-center">
                    <span className="material-icons mr-3 text-xl">email</span>
                    <span>flipmart@themesground.com</span>
                </div>
            </div>
            {/* Customer Service */}
            <div>
                <h3 className="font-bold mb-4 text-lg">CUSTOMER SERVICE</h3>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:underline">My Account</a></li>
                    <li><a href="#" className="hover:underline">Order History</a></li>
                    <li><a href="#" className="hover:underline">FAQ</a></li>
                    <li><a href="#" className="hover:underline">Specials</a></li>
                    <li><a href="#" className="hover:underline">Help Center</a></li>
                </ul>
            </div>
            {/* Corporation */}
            <div>
                <h3 className="font-bold mb-4 text-lg">CORPORATION</h3>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:underline">About us</a></li>
                    <li><a href="#" className="hover:underline">Customer Service</a></li>
                    <li><a href="#" className="hover:underline">Company</a></li>
                    <li><a href="#" className="hover:underline">Investor Relations</a></li>
                    <li><a href="#" className="hover:underline">Advanced Search</a></li>
                </ul>
            </div>
            {/* Why Choose Us */}
            <div>
                <h3 className="font-bold mb-4 text-lg">WHY CHOOSE US</h3>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:underline">Shopping Guide</a></li>
                    <li><a href="#" className="hover:underline">Blog</a></li>
                    <li><a href="#" className="hover:underline">Company</a></li>
                    <li><a href="#" className="hover:underline">Investor Relations</a></li>
                    <li><a href="#" className="hover:underline">Contact Us</a></li>
                </ul>
            </div>
        </div>
        {/* Social & Payment */}
        <div className="border-t border-neutral-800 mt-10 pt-6">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                {/* Social Icons */}
                <div className="flex space-x-2 mb-4 md:mb-0">
                    <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white rounded p-2">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="bg-sky-400 hover:bg-sky-500 text-white rounded p-2">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="bg-red-600 hover:bg-red-700 text-white rounded p-2">
                        <i className="fab fa-google-plus-g"></i>
                    </a>
                    <a href="#" className="bg-orange-500 hover:bg-orange-600 text-white rounded p-2">
                        <i className="fas fa-rss"></i>
                    </a>
                    <a href="#" className="bg-blue-700 hover:bg-blue-800 text-white rounded p-2">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" className="bg-pink-600 hover:bg-pink-700 text-white rounded p-2">
                        <i className="fab fa-youtube"></i>
                    </a>
                </div>
                {/* Payment Icons */}
                <div className="flex space-x-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-8 bg-white rounded p-1" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Discover_Card_logo.svg" alt="Discover" className="h-8 bg-white rounded p-1" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-8 bg-white rounded p-1" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Maestro_2016.svg" alt="Maestro" className="h-8 bg-white rounded p-1" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Discover_Card_logo.svg" alt="Discover" className="h-8 bg-white rounded p-1" />
                </div>
            </div>
        </div>
    </footer>
)
}

export default FooterComponent