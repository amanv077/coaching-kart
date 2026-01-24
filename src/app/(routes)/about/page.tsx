import React from 'react';
import Link from 'next/link';
import { 
  Target, 
  Eye, 
  Users, 
  Award, 
  TrendingUp, 
  Search, 
  Shield, 
  Zap,
  MapPin,
  Calendar,
  Star,
  ChevronRight
} from 'lucide-react';

// Stats data
const stats = [
  { value: '5,000+', label: 'Coaching Institutes' },
  { value: '100+', label: 'Cities Covered' },
  { value: '₹15Cr+', label: 'Student Savings' },
  { value: '100K+', label: 'Students Helped' },
];

// Values data
const values = [
  { icon: Star, title: 'Student First', desc: 'Every decision prioritizes student needs and educational outcomes.' },
  { icon: Search, title: 'Transparency', desc: 'Complete honesty about coaching quality, pricing, and experiences.' },
  { icon: Shield, title: 'Accessibility', desc: 'Quality education accessible to all regardless of location.' },
  { icon: Zap, title: 'Innovation', desc: 'Constantly improving ways to discover educational opportunities.' },
];

// Team data
const team = [
  { name: 'Priya Sharma', role: 'Founder & CEO', initial: 'P' },
  { name: 'Rahul Verma', role: 'CTO', initial: 'R' },
  { name: 'Neha Patel', role: 'Head of Partnerships', initial: 'N' },
  { name: 'Arjun Mehta', role: 'Student Success Lead', initial: 'A' },
];

// Journey data
const journey = [
  { year: '2020', title: 'The Beginning', desc: 'CoachingKart was born to help students find reliable coaching information.' },
  { year: '2021', title: 'Building Partnerships', desc: 'Started with 50 partner institutes, building trust across India.' },
  { year: '2022', title: 'Launching Services', desc: 'Introduced free demos, price matching, and verified reviews.' },
  { year: '2023', title: 'Nationwide Expansion', desc: 'Expanded to 100+ cities with 5,000+ coaching institutes.' },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Transforming How Students{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F52BA] to-[#2E6CD1]">
                Find Education
              </span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              We're on a mission to make quality coaching accessible, affordable, and transparent for every student in India.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#0F52BA]/10 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-[#0F52BA]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              A world where every student has equal access to high-quality education, regardless of location or economic background. Finding the right coaching should be easy, transparent, and affordable.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#0F52BA]/10 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-[#0F52BA]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Bridge the gap between students and coaching institutes with unbiased information, verified reviews, and exclusive discounts. Transform how students discover and access educational resources.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-[#0F52BA] rounded-2xl p-6 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">Our Journey</h2>
        <div className="relative">
          {/* Timeline line - hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2"></div>
          
          <div className="space-y-6 md:space-y-0">
            {journey.map((item, i) => (
              <div key={i} className={`md:flex md:items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className={`flex-1 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <span className="inline-block bg-[#0F52BA]/10 text-[#0F52BA] text-sm font-bold px-3 py-1 rounded-full mb-2">
                      {item.year}
                    </span>
                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
                {/* Center dot - hidden on mobile */}
                <div className="hidden md:flex w-4 h-4 bg-[#0F52BA] rounded-full border-4 border-white shadow-md flex-shrink-0 relative z-10"></div>
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">Our Values</h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Core principles that guide every decision we make
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {values.map((value, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 text-center">
              <div className="w-12 h-12 bg-[#0F52BA]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <value.icon className="w-6 h-6 text-[#0F52BA]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">{value.title}</h3>
              <p className="text-xs text-gray-500">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">Our Team</h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Passionate educators and technologists transforming education access
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {team.map((member, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 text-center">
              <div className="w-16 h-16 bg-[#0F52BA] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-white">{member.initial}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm">{member.name}</h3>
              <p className="text-xs text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-12 pb-20">
        <div className="bg-gradient-to-r from-[#0F52BA] to-[#2E6CD1] rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Join Our Mission</h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Whether you're a student, coaching institute, or passionate individual — we'd love to connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/contact-us" 
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#0F52BA] font-medium rounded-full hover:bg-gray-100 transition-colors"
            >
              Contact Us <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
            <Link 
              href="/coaching" 
              className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-medium rounded-full hover:bg-white/20 transition-colors border border-white/30"
            >
              Explore Coaching
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;