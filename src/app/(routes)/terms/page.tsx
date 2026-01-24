import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using Coaching Kart, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Use of Services</h2>
            <p className="text-gray-600 leading-relaxed">
              You may use our services only for lawful purposes and in accordance with these Terms. 
              You agree not to use our services in any way that violates any applicable laws or regulations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
            <p className="text-gray-600 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials 
              and for all activities that occur under your account. You must immediately notify us 
              of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Coaching Services</h2>
            <p className="text-gray-600 leading-relaxed">
              We act as a platform connecting students with coaching institutes. We do not guarantee 
              the quality or outcomes of any coaching services. All agreements are between you and 
              the respective coaching institute.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Payment Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              Payments for coaching services are made directly to coaching institutes. We may 
              facilitate certain payments and offer discounts. All fees are subject to the 
              policies of individual coaching institutes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              Coaching Kart shall not be liable for any indirect, incidental, special, or 
              consequential damages arising out of or in connection with your use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about these Terms, contact us at{' '}
              <a href="mailto:legal@coachingkart.com" className="text-[#0F52BA] hover:underline">
                legal@coachingkart.com
              </a>
            </p>
          </section>

          <p className="text-sm text-gray-500 pt-4 border-t border-gray-100">
            Last updated: January 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
