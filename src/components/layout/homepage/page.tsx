import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, CheckCircle, BookOpen, TrendingUp, Users, Clock, Shield, Star, Play, MapPin, ChevronRight, Quote } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#0F52BA]/20 selection:text-[#0F52BA]">
      
      {/* Hero Section with Pattern */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
        {/* Subtle Dot Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 bg-[#0F52BA]/5 border border-[#0F52BA]/20 rounded-full px-4 py-1.5 mb-8 transition-transform hover:scale-105 cursor-default">
              <span className="flex h-2 w-2 rounded-full bg-[#0F52BA] animate-pulse"></span>
              <span className="text-sm font-semibold text-[#0F52BA] tracking-wide">#1 Trusted Coaching Platform in India</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1]">
              Find your perfect <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F52BA] to-[#2E6CD1]">
                Coaching Institute
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Compare <strong>5,000+</strong> verified institutes, book free <span className="text-[#0F52BA] font-semibold under">demo classes</span>, 
              and start your journey to success today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-8 rounded-full text-lg bg-[#0F52BA] text-white hover:bg-[#0A3d8F] shadow-lg shadow-[#0F52BA]/20 hover:shadow-[#0F52BA]/30 hover:-translate-y-0.5 transition-all duration-300" asChild>
                <Link href="/coaching">
                  Find Coaching
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg border-2 border-gray-200 text-gray-700 hover:border-[#0F52BA] hover:bg-[#0F52BA] hover:text-white transition-all duration-300" asChild>
                <Link href="/free-trial" className="flex items-center">
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Free Demo
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* Stats - Dark Strip */}
      <section className="bg-[#0F172A] border-t border-gray-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-white/10">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">5k+</div>
              <div className="text-sm md:text-base text-gray-400 font-medium uppercase tracking-wider">Top Institutes</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">25k+</div>
              <div className="text-sm md:text-base text-gray-400 font-medium uppercase tracking-wider">Active Students</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">98%</div>
              <div className="text-sm md:text-base text-gray-400 font-medium uppercase tracking-wider">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">4.9</div>
              <div className="text-sm md:text-base text-gray-400 font-medium uppercase tracking-wider">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
              Everything you need to excel.
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              We've built the most comprehensive platform for students to find, compare, and connect with the best educators.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<CheckCircle className="w-6 h-6 text-[#0F52BA]" />}
              color="bg-[#0F52BA]/5"
              title="Verified Institutes"
              desc="We physically verify every institute to ensure quality, safety, and faculty credentials."
            />
            <FeatureCard 
              icon={<BookOpen className="w-6 h-6 text-[#0F52BA]" />}
               color="bg-[#0F52BA]/5"
              title="Expert Faculty"
              desc="Detailed profiles of educators including their experience, qualifications, and teaching style."
            />
            <FeatureCard 
              icon={<TrendingUp className="w-6 h-6 text-[#0F52BA]" />}
               color="bg-[#0F52BA]/5"
              title="Proven Results"
              desc="Access authentic past year results and success stories verified by our team."
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6 text-[#0F52BA]" />}
               color="bg-[#0F52BA]/5"
              title="Student Community"
              desc="Connect with alumni and current students to get real feedback and advice."
            />
            <FeatureCard 
              icon={<Clock className="w-6 h-6 text-[#0F52BA]" />}
               color="bg-[#0F52BA]/5"
              title="Smart Comparison"
              desc="Compare fees, batch timings, and distance side-by-side to make the right choice."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-[#0F52BA]" />}
               color="bg-[#0F52BA]/5"
              title="Fee Protection"
              desc="Your payment is safe with us. We ensure transparency in refund policies."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                 Simple steps to your <br/> dream college.
               </h2>
               <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                 We've simplified the complex process of finding coaching into three easy steps. No more confusion, just clear choices.
               </p>
               <div className="space-y-8">
                 <StepRow num="01" title="Search & Filter" desc="Enter your exam (JEE, NEET, etc.) and location to see top-rated institutes near you." />
                 <StepRow num="02" title="Compare & Shortlist" desc="View detailed fee structures, faculty profiles, and student reviews." />
                 <StepRow num="03" title="Book Free Demo" desc="Attend a trial class to experience the teaching methodology before you pay." />
               </div>
            </div>
            <div className="w-full md:w-1/2 relative">
               <div className="absolute inset-0 bg-[#0F52BA]/10 rounded-2xl transform rotate-3"></div>
               <div className="relative bg-white border border-gray-200 p-8 rounded-2xl shadow-xl">
                 <h3 className="text-xl font-bold mb-6">Popular Exams</h3>
                 <div className="space-y-4">
                   {['JEE Advanced', 'NEET UG', 'UPSC CSE', 'CA Foundation', 'CAT', 'GATE'].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-[#0F52BA]/5 transition-colors cursor-pointer group">
                       <span className="font-medium text-gray-700 group-hover:text-[#0F52BA]">{item}</span>
                       <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0F52BA]" />
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0b1120] to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Don't just take our word for it.</h2>
            <p className="text-gray-400 text-lg">Join 25,000+ happy students who found their path.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TestimonialCard 
              quote="The comparison feature saved me so much time. I found a hidden gem of an institute near my house that I wouldn't have known about otherwise."
              author="Arjun Sharma"
              role="JEE Aspirant"
              initials="AS"
              color="bg-[#0F52BA]"
            />
            <TestimonialCard 
              quote="I was confused between three big institutes. The free demo classes arranged by CoachingKart helped me decide which teaching style suited me better."
              author="Priya Gupta"
              role="NEET Student"
              initials="PG"
               color="bg-[#0F52BA]"
            />
            <TestimonialCard 
              quote="The support team is amazing. They helped me negotiate the fees and provided a scholarship coupon. Highly recommended!"
              author="Rahul Kumar"
              role="CA Student"
              initials="RK"
               color="bg-[#0F52BA]"
            />
          </div>
        </div>
      </section>

      {/* CTA Section - Redesigned */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="relative rounded-[3rem] overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl group">
            {/* Abstract Background */}
            <div className="absolute inset-0">
               <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900"></div>
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0F52BA]/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-70 group-hover:opacity-100 transition-opacity duration-700"></div>
               <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0F52BA]/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-70 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
            
            <div className="relative z-10 px-6 py-20 md:py-24 text-center">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                Start your preparation <br className="hidden md:block"/> with the best.
              </h2>
              
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                 Get access to <span className="text-[#0F52BA] font-medium">exclusive scholarships and discounts</span> <br className="hidden md:block"/> when you book through CoachingKart.
              </p>
              
              <div className="relative inline-block group/btn">
                 <div className="absolute -inset-1 bg-gradient-to-r from-[#0F52BA] to-[#2E6CD1] rounded-full blur opacity-25 group-hover/btn:opacity-75 transition duration-500"></div>
                 <Button size="lg" className="relative h-16 px-12 rounded-full text-xl bg-white text-gray-900 hover:bg-gray-50 hover:text-[#0F52BA] transition-all duration-300 font-bold border-0" asChild>
                  <Link href="/coaching">
                    Explore Institutes
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

// Subcomponents
const FeatureCard = ({ icon, color, title, desc }: { icon: React.ReactNode, color: string, title: string, desc: string }) => (
  <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#0F52BA]/30 hover:shadow-xl hover:shadow-[#0F52BA]/5 transition-all duration-300 group">
    <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0F52BA] transition-colors">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{desc}</p>
  </div>
);

const StepRow = ({ num, title, desc }: { num: string, title: string, desc: string }) => (
  <div className="flex gap-6">
    <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-[#0F52BA]/20 text-[#0F52BA] flex items-center justify-center font-bold text-lg bg-[#0F52BA]/5">
      {num}
    </div>
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const TestimonialCard = ({ quote, author, role, initials, color }: { quote: string, author: string, role: string, initials: string, color: string }) => (
  <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700/50 hover:bg-gray-800/80 transition-colors">
    <Quote className="w-8 h-8 text-gray-600 mb-6" />
    <p className="text-lg text-gray-200 mb-8 leading-relaxed">"{quote}"</p>
    <div className="flex items-center">
      <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mr-4 text-white font-bold text-sm shadow-lg`}>
        {initials}
      </div>
      <div>
        <div className="font-bold text-white">{author}</div>
        <div className="text-sm text-gray-400">{role}</div>
      </div>
    </div>
  </div>
);

export default HomePage;