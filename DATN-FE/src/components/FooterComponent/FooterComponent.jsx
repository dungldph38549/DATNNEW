import React from 'react'

const FooterComponent = () => {
return (
    <footer className="bg-neutral-900 text-neutral-200 pt-10 pb-4">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Contact Us */}
            <div>
                <h3 className="text-lg font-semibold mb-4">CONTACT US</h3>
                <div className="flex items-start mb-3">
                    <span className="bg-neutral-800 p-2 rounded mr-3">
                        <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                    </span>
                    <div>
                        <p>ThemesGround, 789 Main rd,<br/>Anytown, CA 12345 USA</p>
                    </div>
                </div>
                <div className="flex items-start mb-3">
                    <span className="bg-neutral-800 p-2 rounded mr-3">
                        <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M22 16.92V19a2 2 0 01-2 2H4a2 2 0 01-2-2v-2.08a2 2 0 01.84-1.63l7-5.11a2 2 0 012.32 0l7 5.11a2 2 0 01.84 1.63z"/>
                            <path d="M16 3.13a4 4 0 01.88 7.9"/>
                        </svg>
                    </span>
                    <div>
                        <p>+(888) 123-4567<br/>+(888) 456-7890</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <span className="bg-neutral-800 p-2 rounded mr-3">
                        <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M21 10.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l2.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6A8.38 8.38 0 0113.5 3a8.5 8.5 0 017.5 7.5z"/>
                        </svg>
                    </span>
                    <div>
                        <p>flipmart@themesground.com</p>
                    </div>
                </div>
            </div>
            {/* Customer Service */}
            <div>
                <h3 className="text-lg font-semibold mb-4">CUSTOMER SERVICE</h3>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white">My Account</a></li>
                    <li><a href="#" className="hover:text-white">Order History</a></li>
                    <li><a href="#" className="hover:text-white">FAQ</a></li>
                    <li><a href="#" className="hover:text-white">Specials</a></li>
                    <li><a href="#" className="hover:text-white">Help Center</a></li>
                </ul>
            </div>
            {/* Corporation */}
            <div>
                <h3 className="text-lg font-semibold mb-4">CORPORATION</h3>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white">About us</a></li>
                    <li><a href="#" className="hover:text-white">Customer Service</a></li>
                    <li><a href="#" className="hover:text-white">Company</a></li>
                    <li><a href="#" className="hover:text-white">Investor Relations</a></li>
                    <li><a href="#" className="hover:text-white">Advanced Search</a></li>
                </ul>
            </div>
            {/* Why Choose Us */}
            <div>
                <h3 className="text-lg font-semibold mb-4">WHY CHOOSE US</h3>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white">Shopping Guide</a></li>
                    <li><a href="#" className="hover:text-white">Blog</a></li>
                    <li><a href="#" className="hover:text-white">Company</a></li>
                    <li><a href="#" className="hover:text-white">Investor Relations</a></li>
                    <li><a href="#" className="hover:text-white">Contact Us</a></li>
                </ul>
            </div>
        </div>
        {/* Social Icons */}
        <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-wrap gap-3">
            <a href="#" className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white">
                <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="bg-sky-400 hover:bg-sky-500 p-2 rounded text-white">
                <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="bg-red-600 hover:bg-red-700 p-2 rounded text-white">
                <i className="fab fa-google-plus-g"></i>
            </a>
            <a href="#" className="bg-orange-500 hover:bg-orange-600 p-2 rounded text-white">
                <i className="fas fa-rss"></i>
            </a>
            <a href="#" className="bg-pink-600 hover:bg-pink-700 p-2 rounded text-white">
                <i className="fab fa-pinterest-p"></i>
            </a>
            <a href="#" className="bg-blue-700 hover:bg-blue-800 p-2 rounded text-white">
                <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="bg-red-500 hover:bg-red-600 p-2 rounded text-white">
                <i className="fab fa-youtube"></i>
            </a>
        </div>
        {/* Payment Icons */}
        <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-wrap gap-4 items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-8 bg-white rounded p-1" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Discover_Card_logo.svg" alt="Discover" className="h-8 bg-white rounded p-1" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-8 bg-white rounded p-1" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Maestro_logo.png" alt="Maestro" className="h-8 bg-white rounded p-1" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Discover_Card_logo.svg" alt="Discover" className="h-8 bg-white rounded p-1" />
        </div>
    </footer>
)
}

export default FooterComponent