import React from "react";
import { Link, useNavigate } from "react-router-dom";
import quotumLogo from "../../assets/quotum-no-bg.png";

const LegalInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation - Modified with back button */}
      <nav className="fixed top-0 w-full bg-[#111] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img src={quotumLogo} alt="Quotum Logo" className="h-12 w-auto" />
              <span className="text-white text-xl ml-3 font-semibold">
                Quotum.cloud
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center px-4 py-2 bg-[#FF6B00] text-white rounded-lg hover:bg-[#ff8533] transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Legal Disclaimer
            </h1>

            <div className="text-gray-600 space-y-8">
              {/* Overview section */}
              <section>
                <p>
                  Welcome to Quotum. The information provided on our platforms
                  including but not limited to our website, social media
                  channels, videos, and other mediums, is for general
                  informational purposes only and is not intended to constitute
                  financial advice, investment advice, trading advice, or any
                  other type of advice.
                </p>
              </section>

              {/* Main sections */}
              <div className="space-y-12">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    1. No Financial Advice
                  </h2>
                  <p>
                    Important notice regarding our financial advisory position:
                  </p>
                  The content shared by Quotum is not financial advice and
                  should not be treated as such. We do not represent ourselves
                  as financial advisors and we are not licensed to provide
                  financial advice.
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    2. Individual Responsibility
                  </h2>
                  <p>Understanding your role and responsibilities:</p>
                  All users are responsible for their own actions and decisions.
                  Individuals should conduct their own research or consult with
                  a professional financial advisor before making any financial
                  decisions.
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    3. No Guarantees
                  </h2>
                  <p>Our position on information accuracy:</p>
                  We do not guarantee the accuracy, completeness, or usefulness
                  of any information shared. Users are using the information
                  provided at their own risk.
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    4. Potential Losses
                  </h2>
                  <p>Understanding the risks involved:</p>
                  Quotum is not responsible for any decisions made based on the
                  information provided, and is not responsible for any loss or
                  damage incurred as a result. Investing, trading, and other
                  financial decisions carry risks, and all users should
                  understand and be willing to accept these risks before making
                  any financial decisions.
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    5. Third-Party Links
                  </h2>
                  <p>Our policy regarding external resources:</p>
                  Our platforms may contain links to third-party websites or
                  resources which are not controlled by Quotum. We do not
                  endorse or assume responsibility for the content, information,
                  or services provided by third-parties.
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    6. Liability Limitation
                  </h2>
                  <p>Scope of our liability:</p>
                  To the maximum extent permitted by law, Quotum shall not be
                  liable for any direct, indirect, punitive, incidental,
                  special, consequential, or exemplary damages, including
                  without limitation damages for loss of profits, goodwill, use,
                  data, or other intangible losses, arising out of or relating
                  to the use of, or inability to use, the services and
                  information provided.
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    7. Indemnification
                  </h2>
                  <p>Your obligations regarding legal protection:</p>
                  By using our platforms and services, you agree to indemnify
                  and hold harmless Quotum, its officers, directors, employees,
                  and agents from and against any and all liabilities, claims,
                  damages, and expenses (including reasonable attorney's fees)
                  arising out of your use of our services, your breach or
                  alleged breach of this agreement, and/or your violation or
                  alleged violation of the rights of any other person or entity.
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    8. Modification of Disclaimer
                  </h2>
                  <p>Our rights to update terms:</p>
                  Quotum reserves the right to change this Legal Disclaimer at
                  any time. Any modifications will be effective immediately upon
                  posting on this page. Users are encouraged to review this
                  Legal Disclaimer periodically to stay informed of any changes.
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    9. Contact Information
                  </h2>
                  <p>How to reach us:</p>
                  If you have any questions or concerns regarding this Legal
                  Disclaimer, you may contact us at quotum.consulting@gmail.com
                </section>
              </div>

              {/* Closing section */}
              <section className="mt-8">
                <p>
                  Your access to and use of the services and information
                  provided by Quotum is conditioned on your acceptance of and
                  compliance with this Legal Disclaimer. By accessing or using
                  our services and platforms you agree to be bound by this Legal
                  Disclaimer.
                </p>
                <p className="mt-4">
                  Thank you for your understanding and cooperation.
                </p>
              </section>
            </div>
          </div>
          {/* Privacy Policy Sections - Add this inside main content div */}
          <div className="prose prose-lg max-w-none mt-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Privacy Policy
            </h1>

            <div className="text-gray-600 space-y-8">
              {/* Last Updated */}
              <section>
                <p className="mt-4">
                  This Privacy Policy describes how Quotum (the "Site", "we",
                  "us", or "our") collects, uses, and discloses your personal
                  information when you visit, use our services, or make a
                  purchase from quotum.org (the "Site") or otherwise communicate
                  with us (collectively, the "Services").
                </p>
              </section>

              <div className="space-y-12">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    1. Changes to This Privacy Policy
                  </h2>
                  <p>Understanding policy updates:</p>
                  We may update this Privacy Policy from time to time, including
                  to reflect changes to our practices or for other operational,
                  legal, or regulatory reasons. We will post the revised Privacy
                  Policy on the Site, update the "Last updated" date and take
                  any other steps required by applicable law.
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    2. Information We Collect
                  </h2>
                  <p>Types of personal information we collect:</p>
                  Basic contact details including your name, address, phone
                  number, email Order information including billing address,
                  shipping address, payment confirmation Account information
                  including username, password, security questions Shopping
                  information including items viewed, cart contents, wishlists
                  Customer support information included in communications with
                  us
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    3. Information Collection Methods
                  </h2>
                  <p>How we gather your information:</p>
                  Direct submission through our Services Automatic collection
                  through cookies and similar technologies Third-party sources
                  including service providers and vendors
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    4. How We Use Your Information
                  </h2>
                  <p>Purposes for using your data:</p>
                  Providing Products and Services: Processing payments,
                  fulfilling orders, managing accounts Marketing and
                  Advertising: Sending promotional communications, showing
                  targeted advertisements Security and Fraud Prevention:
                  Detecting and preventing fraudulent activity Customer
                  Communication: Providing support and service updates
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    5. Information Sharing
                  </h2>
                  <p>Who we share your information with:</p>
                  Service providers and vendors who assist in operations
                  Business and marketing partners including Shopify Affiliates
                  within our corporate group Legal authorities when required by
                  law
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    6. User Rights
                  </h2>
                  <p>Your data privacy rights:</p>
                  Right to Access/Know your personal information Right to Delete
                  your personal information Right to Correct inaccurate
                  information Right of Portability to receive/transfer your data
                  Right to Opt-out of certain data uses
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    7. Children's Privacy
                  </h2>
                  <p>Our policy regarding minors:</p>
                  Our Services are not intended for children's use We do not
                  knowingly collect information from children Parents may
                  request deletion of children's personal information
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    8. Security Measures
                  </h2>
                  <p>How we protect your data:</p>
                  Implementation of security measures to protect information
                  Retention policies based on necessity and legal requirements
                  No guarantee of perfect security during transmission
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    9. International Data Transfers
                  </h2>
                  <p>Information about global data processing:</p>
                  Data may be transferred and stored outside your country
                  Processing occurs in various global locations Use of
                  appropriate data transfer mechanisms
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    10. Contact Information
                  </h2>
                  <p>How to reach us:</p>

                  <ul>
                    <li>Email: quotum.consulting@gmail.com</li>
                    Location: AM, Netherlands
                  </ul>
                </section>
              </div>

              {/* Closing section */}
              <section className="mt-8">
                <p>
                  By using and accessing any of the Services, you agree to the
                  collection, use, and disclosure of your information as
                  described in this Privacy Policy. If you do not agree to this
                  Privacy Policy, please do not use or access any of the
                  Services.
                </p>
              </section>
            </div>
          </div>

          {/* Refund Policy Sections - Add this inside main content div */}
          <div className="prose prose-lg max-w-none mt-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Return & Refund Policy
            </h1>

            <div className="text-gray-600 space-y-8">
              {/* Introduction */}
              <section>
                <p>
                  Thank you for shopping at Quotum. Your satisfaction is
                  important to us, however, it's crucial to note that we do not
                  provide refunds for any products purchased. Please review our
                  policy below for details.
                </p>
              </section>

              <div className="space-y-12">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    1. No Refunds
                  </h2>
                  <p>Our refund status:</p>
                  All sales are final. Once a product is purchased, no refunds
                  will be issued under any circumstances. We encourage our
                  customers to thoroughly review their selections before
                  completing a purchase.
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    2. Eligibility for Return
                  </h2>
                  <p>Return conditions:</p>
                  While we do not offer refunds, we accept returns for exchange
                  only. Customers may return items within 30 days of the
                  original purchase date for an exchange. Items must be in their
                  original packaging, unused, undamaged, and accompanied by a
                  receipt or proof of purchase.
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    3. Exchanges
                  </h2>
                  <p>Exchange options:</p>
                  Customers may choose to exchange the returned item for another
                  of equal value. Exchanges are subject to product availability.
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    4. Damaged or Defective Items
                  </h2>
                  <p>Handling product issues:</p>
                  If an item is received damaged or defective, customers should
                  contact our Customer Service team immediately to arrange for a
                  return or exchange. Claims for damaged or defective items must
                  be filed within 7 days of delivery.
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900">
                    5. Contact Us
                  </h2>
                  <p>Support information:</p>
                  For further information regarding our return policy, or to
                  discuss a particular case, please contact our Customer Service
                  team at{" "}
                  <span className="text-blue-600">
                    quotum.consulting@gmail.com
                  </span>
                </section>
              </div>

              {/* Closing section */}
              <section className="mt-8">
                <p>
                  Please note that Quotum reserves the right to modify this
                  Policy at any time, so please review it frequently. Changes
                  and clarifications will take effect immediately upon their
                  posting on the website.
                </p>
                <p className="mt-4 font-semibold">
                  Thank you for choosing Quotum!
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#111] text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-4 mb-8 md:mb-0">
            {/* Logo and Company Info */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <img
                  src={quotumLogo}
                  alt="Quotum Logo"
                  className="h-12 w-auto"
                />
                <span className="text-white text-xl ml-3 font-semibold">
                  Quotum.cloud
                </span>
              </div>
              <p className="text-sm max-w-xs">
                Advanced crypto analytics and market insights for serious
                traders.
              </p>
            </div>

            {/* Quick Links - Centered Grid */}
            <div className="grid grid-cols-2 gap-8 md:gap-16 w-full md:w-auto md:max-w-md justify-center mx-auto md:mx-0">
              {/* Products */}
              <div className="flex flex-col space-y-3">
                <h3 className="text-white font-semibold mb-2">Platform</h3>
                <a
                  href="#introduction"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById("introduction");
                    if (element) {
                      const offset = 80;
                      const elementPosition =
                        element.getBoundingClientRect().top;
                      const offsetPosition =
                        elementPosition + window.pageYOffset - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="text-sm hover:text-white transition-colors cursor-pointer"
                >
                  Intro
                </a>
                <a
                  href="#pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById("pricing");
                    if (element) {
                      const offset = 80;
                      const elementPosition =
                        element.getBoundingClientRect().top;
                      const offsetPosition =
                        elementPosition + window.pageYOffset - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="text-sm hover:text-white transition-colors cursor-pointer"
                >
                  VIP Access
                </a>
                <a
                  href="#features"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById("features");
                    if (element) {
                      const offset = 80;
                      const elementPosition =
                        element.getBoundingClientRect().top;
                      const offsetPosition =
                        elementPosition + window.pageYOffset - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="text-sm hover:text-white transition-colors cursor-pointer"
                >
                  Features
                </a>
              </div>

              {/* Company */}
              <div className="flex flex-col space-y-3">
                <h3 className="text-white font-semibold mb-2">Company</h3>
                <Link
                  to="/about"
                  className="text-sm hover:text-white transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/terms"
                  className="text-sm hover:text-white transition-colors"
                >
                  Terms
                </Link>
                <Link
                  to="/legal"
                  className="text-sm hover:text-white transition-colors"
                >
                  Legal
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 mt-8 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <div className="text-sm order-2 sm:order-1">
                © {new Date().getFullYear()} Quotum. All rights reserved.
              </div>

              {/* Social Links */}
              <div className="flex space-x-6 order-1 sm:order-2">
                <a
                  href="https://x.com/GodelTrabuco69"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="https://t.me/QuotumC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.554.223l.198-2.8 5.106-4.618c.222-.196-.054-.304-.346-.108L7.83 13.775l-2.718-.816c-.59-.182-.608-.59.124-.873l10.614-4.103c.48-.176.905.114.044.238z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/31621573027"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.004 0C5.374 0 0 5.374 0 12c0 2.113.553 4.176 1.604 5.984L.059 23.97a.5.5 0 00.636.623l5.94-1.518A11.978 11.978 0 0012.004 24c6.63 0 12-5.374 12-12 0-6.63-5.37-12-12-12zm7.053 16.964c-.226.625-1.309 1.198-1.805 1.276-.497.08-1.084.11-1.732-.155a16.892 16.892 0 01-1.938-.854c-3.379-1.865-5.59-5.176-5.77-5.43-.18-.255-1.375-1.828-1.375-3.474 0-1.646.869-2.468 1.177-2.793.308-.326.679-.354.905-.354.225 0 .452.002.653.01.201.008.507-.09.792.603.285.695.967 2.402 1.048 2.578.082.176.137.384.025.617-.111.234-.167.382-.333.585-.164.202-.347.45-.49.603-.164.174-.335.363-.145.716.19.352.846 1.399 1.812 2.263.885.787 2.244 1.551 2.627 1.723.383.174.6.146.826-.087.225-.233.968-1.117 1.226-1.503.259-.385.516-.326.87-.196.354.13 2.231 1.053 2.614 1.242.382.19.637.288.733.45.096.163.096.946-.13 1.571z" />
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
