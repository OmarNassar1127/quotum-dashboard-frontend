import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import quotumLogo from '../../assets/quotum-no-bg.png';
import { ArrowLeft } from 'lucide-react';

const LegalInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#111] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center">
              <img src={quotumLogo} alt="Quotum Logo" className="h-12 w-auto" />
              <span className="text-white text-xl ml-3 font-semibold">
                Quotum.cloud
              </span>
            </Link>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-32 pb-20">
        <section>
          <h2 className="text-2xl font-bold text-gray-900">Refund Policy</h2>
          <p className="mt-4">Thank you for shopping at Quotum. Your satisfaction is important to us, however, it's crucial to note that we do not provide refunds for any products purchased. Please review our policy below for details.</p>
          <ul className="mt-4 list-disc list-inside">
            <li><strong>No Refunds:</strong> All sales are final. Once a product is purchased, no refunds will be issued under any circumstances. We encourage our customers to thoroughly review their selections before completing a purchase.</li>
            <li><strong>Eligibility for Return:</strong> While we do not offer refunds, we accept returns for exchange only within 30 days of the original purchase date. Items must be in their original packaging, unused, undamaged, and accompanied by a receipt or proof of purchase.</li>
            <li><strong>Exchanges:</strong> Customers may choose to exchange the returned item for another of equal value. Exchanges are subject to product availability.</li>
            <li><strong>Damaged or Defective Items:</strong> Claims for damaged or defective items must be filed within 7 days of delivery by contacting our Customer Service team at quotum.consulting@gmail.com.</li>
          </ul>
          <p className="mt-4">Quotum reserves the right to modify this policy at any time. Please review it frequently for changes.</p>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
          <p className="mt-4">This Privacy Policy describes how Quotum collects, uses, and discloses your personal information when you use our services. For the full Privacy Policy, please visit our website at [LINK TO FULL PRIVACY POLICY].</p>
          <h3 className="text-xl font-semibold mt-8">How We Collect Information</h3>
          <ul className="mt-4 list-disc list-inside">
            <li>Directly from you through purchases, account creation, or customer service inquiries.</li>
            <li>Through cookies and similar technologies to analyze usage data.</li>
            <li>From third parties such as payment processors and analytics providers.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-8">Your Rights</h3>
          <ul className="mt-4 list-disc list-inside">
            <li>Access: You have the right to request access to the personal information we hold about you.</li>
            <li>Correction: You can request corrections to inaccurate information.</li>
            <li>Deletion: You may request the deletion of your personal information.</li>
            <li>Opt-Out: You can opt out of certain data processing activities, including targeted advertising.</li>
          </ul>
          <p className="mt-4">For inquiries, contact quotum.consulting@gmail.com.</p>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Financial Disclaimer</h2>
          <p className="mt-4">The information provided by Quotum on our platforms is for general informational purposes only and does not constitute financial advice.</p>
          <ul className="mt-4 list-disc list-inside">
            <li><strong>No Financial Advice:</strong> We are not licensed financial advisors. All content should be independently verified by the user before making financial decisions.</li>
            <li><strong>Individual Responsibility:</strong> Users are solely responsible for their own financial decisions and actions.</li>
            <li><strong>Liability Limitation:</strong> Quotum is not liable for any losses or damages arising from the use of our information or services.</li>
          </ul>
          <p className="mt-4">For questions or concerns regarding this disclaimer, contact quotum.consulting@gmail.com.</p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#111] text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-4 mb-8 md:mb-0">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <img src={quotumLogo} alt="Quotum Logo" className="h-12 w-auto" />
                <span className="text-white text-xl ml-3 font-semibold">Quotum.cloud</span>
              </div>
              <p className="text-sm max-w-xs">Advanced crypto analytics and market insights for serious traders.</p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:gap-16 w-full md:w-auto md:max-w-md justify-center mx-auto md:mx-0">
              <div className="flex flex-col space-y-3">
                <h3 className="text-white font-semibold mb-2">Products</h3>
                <a href="/#pricing" className="text-sm hover:text-white transition-colors">VIP Access</a>
                <a href="/#features" className="text-sm hover:text-white transition-colors">Features</a>
              </div>
              <div className="flex flex-col space-y-3">
                <h3 className="text-white font-semibold mb-2">Company</h3>
                <Link to="/about" className="text-sm hover:text-white transition-colors">About</Link>
                <Link to="/terms" className="text-sm hover:text-white transition-colors">Terms</Link>
              </div>
            </div>
          </div>
          <div className="pt-8 mt-8 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm order-2 sm:order-1">© {new Date().getFullYear()} Quotum. All rights reserved.</div>
              <div className="flex space-x-6 order-1 sm:order-2">
                <a href="https://twitter.com/quotum" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LegalInfo;
