import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import HeroSection from '@/components/sections/hero-section';
import FeatureCard from '@/components/home/feature-card';
import StatsCard from '@/components/home/stats-card';
import CTASection from '@/components/sections/cta-section';
import TestimonialCard from '@/components/home/testimonial-card';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-coaching-primary/5 via-transparent to-coaching-accent/5 pointer-events-none" />
      
      {/* Hero Section with focus on coaching discovery */}
      <HeroSection
        subtitle="🔍 Find Your Perfect Coaching Match"
        title={
          <>
            Discover the{' '}
            <span className="bg-coaching-gradient bg-clip-text animate-pulse">
              Best Coaching
            </span>{' '}
            at the Best Price
          </>
        }
        description="✨ Compare thousands of coaching institutes, book free demos, and unlock exclusive student discounts. We're here to help you find the perfect match for your learning journey!"
        primaryButtonText="🎯 Find Top Coaching"
        primaryButtonHref="/coaching-search"
        secondaryButtonText="🎁 Get Free Demo"
        secondaryButtonHref="/coaching"
      />

      {/* Floating Achievement Stats - Updated for the new motive */}
      <section className="py-8 md:py-12 px-4 relative -mt-16 md:-mt-20 z-10">
        <div className="container mx-auto">
          <div className="bg-card/90 backdrop-blur-lg rounded-2xl md:rounded-3xl border border-coaching-primary/20 shadow-2xl shadow-coaching-primary/10 p-6 md:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              <StatsCard 
                number="5K+" 
                label="🏫 Coaching Institutes" 
                icon="🏫"
                color="coaching-primary"
              />
              <StatsCard 
                number="100%" 
                label="💰 Price Match Guarantee" 
                icon="💸"
                color="coaching-secondary"
              />
              <StatsCard 
                number="40%" 
                label="🏷️ Max Discount" 
                icon="🔖"
                color="coaching-accent"
              />
              <StatsCard 
                number="24/7" 
                label="📱 Booking Support" 
                icon="🎯"
                color="coaching-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Student Success Stories Marquee */}
      <section className="py-8 md:py-12 px-4 bg-coaching-primary/5">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-lg md:text-xl font-semibold text-coaching-primary mb-2">
              🎓 Real Student Success Stories
            </h3>
          </div>
          <div className="overflow-hidden">
            <div className="flex animate-marquee space-x-8">
              {[
                "💰 Rahul saved ₹15,000 on IIT-JEE coaching fees",
                "🎯 Priya found her perfect NEET coaching through our demo sessions",
                "⭐ Amit got 40% discount after our price match guarantee",
                "💼 Neha received a scholarship after our coaching recommendation",
                "🌟 Vikram tried 3 free demos before finding his perfect match",
                "💯 Ananya improved her rank after switching to our recommended coaching",
              ].map((story, index) => (
                <div
                  key={index}
                  className="bg-card rounded-full px-6 py-3 shadow-lg border border-coaching-primary/20 text-sm md:text-base font-medium text-foreground whitespace-nowrap"
                >
                  {story}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Updated Features Section focused on student benefits */}
      <section className="py-16 md:py-24 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-coaching-primary/10 to-coaching-accent/10 text-coaching-primary rounded-full text-sm md:text-base font-medium mb-6 border border-coaching-primary/20">
              🎯 How We Help Students Find The Best Coaching
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Path to{' '}
              <span className="bg-coaching-gradient bg-clip-text">
                Learning Success
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              🌈 We're not just a platform - we're your educational partner helping you find the best coaching at the best price
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              title="🔍 Compare Coaching Institutes"
              description="Easily compare thousands of coaching institutes based on fees, faculty, student reviews, and success rates"
              icon="🏫"
              color="coaching-primary"
              animationDelay={0}
            />
            <FeatureCard
              title="🎁 Free Demo Sessions"
              description="Book free demo classes with multiple institutes to find the perfect learning environment before committing"
              icon="🎯"
              color="coaching-secondary"
              animationDelay={200}
            />
            <FeatureCard
              title="💰 Exclusive Discounts"
              description="Access student-only discounts up to 40% off and our price match guarantee for the lowest coaching fees"
              icon="💸"
              color="coaching-accent"
              animationDelay={400}
            />
            <FeatureCard
              title="⭐ Verified Reviews"
              description="Read authentic reviews and ratings from real students who have actually attended the coaching institutes"
              icon="📝"
              color="coaching-primary"
              animationDelay={600}
            />
            <FeatureCard
              title="🤝 Personalized Recommendations"
              description="Get AI-powered coaching suggestions based on your learning style, budget, and academic goals"
              icon="🎯"
              color="coaching-secondary"
              animationDelay={800}
            />
            <FeatureCard
              title="📱 Easy Booking System"
              description="Book demos, compare options, and secure your spot with our simple, mobile-friendly booking system"
              icon="📱"
              color="coaching-accent"
              animationDelay={1000}
            />
          </div>
        </div>
      </section>

      {/* How Our Platform Works - Student Journey */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-coaching-primary/5 to-coaching-accent/5 relative">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              🎯 How to Find Your Perfect Coaching
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Three simple steps to discover, compare and save on your ideal coaching institute
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group relative">              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-coaching-primary to-coaching-primary/80 rounded-full flex items-center justify-center text-black dark:text-white text-2xl md:text-3xl font-bold mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-coaching-primary/30">
                1
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">🔍 Search & Compare</h3>
              <p className="text-muted-foreground leading-relaxed">Search by course, subject, or location and compare coaching options based on fees, ratings, and success rates</p>
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
                <div className="text-3xl text-coaching-primary/30">→</div>
              </div>
            </div>
            
            <div className="text-center group relative">              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-coaching-secondary to-coaching-secondary/80 rounded-full flex items-center justify-center text-black dark:text-white text-2xl md:text-3xl font-bold mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-coaching-secondary/30">
                2
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">🎁 Book Free Demos</h3>
              <p className="text-muted-foreground leading-relaxed">Schedule free demo classes with multiple institutes to experience their teaching methods firsthand</p>
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
                <div className="text-3xl text-coaching-accent/30">→</div>
              </div>
            </div>
            
            <div className="text-center group">              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-coaching-accent to-coaching-accent/80 rounded-full flex items-center justify-center text-black dark:text-white text-2xl md:text-3xl font-bold mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-coaching-accent/30">
                3
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">💰 Get Best Price</h3>
              <p className="text-muted-foreground leading-relaxed">Unlock exclusive discounts, apply special coupons, and enjoy our price match guarantee for the lowest fees</p>
            </div>
          </div>

          {/* Student Benefits */}
          <div className="mt-16 md:mt-20 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="bg-card/50 rounded-xl p-4 md:p-6 border border-coaching-primary/10">
                <div className="text-2xl md:text-3xl mb-2">💰</div>
                <div className="font-bold text-foreground text-sm md:text-base">Price Match</div>
                <div className="text-xs md:text-sm text-muted-foreground">Lowest Price Guarantee</div>
              </div>
              <div className="bg-card/50 rounded-xl p-4 md:p-6 border border-coaching-secondary/10">
                <div className="text-2xl md:text-3xl mb-2">🎁</div>
                <div className="font-bold text-foreground text-sm md:text-base">Free Demos</div>
                <div className="text-xs md:text-sm text-muted-foreground">Try Before You Commit</div>
              </div>
              <div className="bg-card/50 rounded-xl p-4 md:p-6 border border-coaching-accent/10">
                <div className="text-2xl md:text-3xl mb-2">⭐</div>
                <div className="font-bold text-foreground text-sm md:text-base">Verified Reviews</div>
                <div className="text-xs md:text-sm text-muted-foreground">From Real Students</div>
              </div>
              <div className="bg-card/50 rounded-xl p-4 md:p-6 border border-coaching-primary/10">
                <div className="text-2xl md:text-3xl mb-2">🛡️</div>
                <div className="font-bold text-foreground text-sm md:text-base">Student Protection</div>
                <div className="text-xs md:text-sm text-muted-foreground">Refund Assistance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Updated Student Testimonials */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-coaching-accent/10 text-coaching-accent rounded-full text-sm md:text-base font-medium mb-6 border border-coaching-accent/20">
              💖 Student Success Stories
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              🌟 Hear From Our Students
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Real students sharing their experiences finding the perfect coaching through our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <TestimonialCard
              quote="💰 I saved ₹12,000 on my IIT-JEE coaching fees through CoachingKart's discount program! I was able to compare 5 institutes and chose the best one after attending free demos."
              author="Rahul Sharma"
              role="IIT-JEE Student, Rank 235"
              rating={5}
            />
            <TestimonialCard
              quote="🎁 The free demo classes were a game-changer! I tried 3 different institutes before finding the perfect NEET coaching that matched my learning style. Plus I got a 30% discount!"
              author="Priya Patel"
              role="NEET Aspirant"
              rating={5}
            />
            <TestimonialCard
              quote="⭐ Reading verified student reviews helped me avoid a coaching institute with poor teaching quality. Found an amazing center with great faculty instead!"
              author="Arjun Mehta"
              role="CA Foundation Student"
              rating={5}
            />
            <TestimonialCard
              quote="🔍 The comparison tool helped me find a coaching center just 2km from my home with better faculty than the one I was planning to join. The convenience saved my travel time!"
              author="Meera Desai"
              role="Bank Exam Aspirant"
              rating={5}
            />
            <TestimonialCard
              quote="💯 CoachingKart's price match guarantee is real! They helped me negotiate a 25% discount after I found the same course cheaper elsewhere. Amazing student support!"
              author="Vikram Singh"
              role="UPSC Student"
              rating={5}
            />
            <TestimonialCard
              quote="📱 Booking demos was so easy! In one weekend, I tried 3 different coaching centers for CAT prep and was able to make the right decision confidently."
              author="Ananya Gupta"
              role="MBA Aspirant"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Updated CTA Section - Focus on Free Demos */}
      <CTASection
        title="🎁 Ready to Find Your Perfect Coaching Match?"
        description="✨ Join thousands of students who discovered their ideal coaching institute, enjoyed free demos, and saved up to 40% on fees. Start your journey today!"
        buttonText="🚀 Book Free Demo Now"
        buttonHref="/free-demo"
      />

      {/* Student Benefits Grid */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-r from-coaching-primary/5 to-coaching-accent/5">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              🎁 Exclusive Student Benefits
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Special features designed to help students find and afford the best coaching
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card/80 backdrop-blur-sm text-center p-6 md:p-8 rounded-2xl border border-coaching-primary/20 hover:shadow-xl hover:shadow-coaching-primary/10 transition-all duration-300 group">
              <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🔖</div>
              <h3 className="font-bold text-foreground mb-3 text-lg">Student Discount Card</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Virtual discount card for additional savings at partner institutes</p>
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm text-center p-6 md:p-8 rounded-2xl border border-coaching-secondary/20 hover:shadow-xl hover:shadow-coaching-secondary/10 transition-all duration-300 group">
              <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
              <h3 className="font-bold text-foreground mb-3 text-lg">Success Rate Data</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Transparent success metrics and previous result analysis</p>
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm text-center p-6 md:p-8 rounded-2xl border border-coaching-accent/20 hover:shadow-xl hover:shadow-coaching-accent/10 transition-all duration-300 group">
              <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🏆</div>
              <h3 className="font-bold text-foreground mb-3 text-lg">Referral Rewards</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Earn discounts when your friends book through our platform</p>
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm text-center p-6 md:p-8 rounded-2xl border border-coaching-primary/20 hover:shadow-xl hover:shadow-coaching-primary/10 transition-all duration-300 group">
              <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">💬</div>
              <h3 className="font-bold text-foreground mb-3 text-lg">Student Community</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Connect with peers who've taken courses you're interested in</p>
            </div>
          </div>
        </div>
      </section>

      {/* Updated Trust Indicators */}
      <section className="py-12 md:py-16 px-4 bg-coaching-primary/10">
        <div className="container mx-auto">
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">
              🤝 Trusted by Top Coaching Institutes
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
              <div className="text-2xl md:text-3xl font-bold text-muted-foreground">ALLEN</div>
              <div className="text-2xl md:text-3xl font-bold text-muted-foreground">FIITJEE</div>
              <div className="text-2xl md:text-3xl font-bold text-muted-foreground">Aakash</div>
              <div className="text-2xl md:text-3xl font-bold text-muted-foreground">Resonance</div>
              <div className="text-2xl md:text-3xl font-bold text-muted-foreground">TIME</div>
            </div>
            <p className="text-sm md:text-base text-muted-foreground mt-6">
              🌟 Featuring 5000+ coaching institutes nationwide with verified profiles
            </p>
          </div>
        </div>
      </section>
    </div>  );
};

export default HomePage;