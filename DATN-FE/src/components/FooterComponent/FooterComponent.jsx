import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaGooglePlusG,
  FaRss,
  FaPinterestP,
  FaLinkedinIn,
  FaYoutube,
  FaPaypal,
  FaCcVisa,
  FaCcMastercard,
  FaCcDiscover,
} from "react-icons/fa";

const FooterComponent = () => {
  return (
    <footer className="bg-zinc-900 text-gray-300 py-10 px-4 sm:px-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-8">
        {/* Contact Us */}
        <div>
          <h2 className="text-lg font-semibold mb-4">CONTACT US</h2>
          <div className="flex items-start gap-3 mb-4">
            <FaMapMarkerAlt className="text-xl mt-1 text-white" />
            <p>
              Đường Trịnh Văn Bô
              <br />
              Trường Cao Đẳng FPT Polytechnic
            </p>
          </div>
          <div className="flex items-start gap-3 mb-4">
            <FaPhone className="text-xl mt-1 text-white" />
            <p>
              +(84) 123-4567
              <br />
              +(84) 456-7890
            </p>
          </div>
          <div className="flex items-start gap-3">
            <FaEnvelope className="text-xl mt-1 text-white" />
            <p>psg@gmail.com</p>
          </div>
        </div>

        {/* Customer Service */}
        <div>
          <h2 className="text-lg font-semibold mb-4">CUSTOMER SERVICE</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white">
                My Account
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Order History
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Specials
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Help Center
              </a>
            </li>
          </ul>
        </div>

        {/* Corporation */}
        <div>
          <h2 className="text-lg font-semibold mb-4">CORPORATION</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white">
                About us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Customer Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Company
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Investor Relations
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Advanced Search
              </a>
            </li>
          </ul>
        </div>

        {/* Why Choose Us */}
        <div>
          <h2 className="text-lg font-semibold mb-4">WHY CHOOSE US</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white">
                Shopping Guide
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Company
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Investor Relations
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Social + Payment Icons */}
      <div className="border-t border-gray-700 pt-6 flex flex-col lg:flex-row justify-between items-center gap-6">
        {/* Social Icons */}
        <div className="flex space-x-2">
          <a href="#" className="bg-blue-600 hover:bg-blue-700 p-2 rounded">
            <FaFacebookF className="text-white" />
          </a>
          <a href="#" className="bg-sky-400 hover:bg-sky-500 p-2 rounded">
            <FaTwitter className="text-white" />
          </a>
          <a href="#" className="bg-red-600 hover:bg-red-700 p-2 rounded">
            <FaGooglePlusG className="text-white" />
          </a>
          <a href="#" className="bg-orange-400 hover:bg-orange-500 p-2 rounded">
            <FaRss className="text-white" />
          </a>
          <a href="#" className="bg-red-500 hover:bg-red-600 p-2 rounded">
            <FaPinterestP className="text-white" />
          </a>
          <a href="#" className="bg-cyan-700 hover:bg-cyan-800 p-2 rounded">
            <FaLinkedinIn className="text-white" />
          </a>
          <a href="#" className="bg-red-600 hover:bg-red-700 p-2 rounded">
            <FaYoutube className="text-white" />
          </a>
        </div>

        {/* Payment Icons */}
        <div className="flex space-x-4">
          <FaPaypal className="text-white text-3xl" />
          <FaCcDiscover className="text-white text-3xl" />
          <FaCcVisa className="text-white text-3xl" />
          <FaCcMastercard className="text-white text-3xl" />
          <FaCcDiscover className="text-white text-3xl" />
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
