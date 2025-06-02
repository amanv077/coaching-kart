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
      
      {/* Hero Section with enhanced visuals */}
      <HeroSection
        subtitle="🚀 Welcome to the Future of Learning"
        title={
          <>
            Unlock Your{' '}
            <span className="bg-coaching-gradient bg-clip-text text-transparent animate-pulse">
              Potential
            </span>{' '}
            with Expert Coaching
          </>
        }
        description="✨ Transform your dreams into reality with personalized coaching from world-class mentors. Join over 50,000 students who have already started their success journey!"
        primaryButtonText="🎯 Start Your Journey"
        primaryButtonHref="/courses"
        secondaryButtonText="👥 Meet Our Coaches"
        secondaryButtonHref="/coaches"
      />

      {/* Floating Achievement Stats */}
      <section className="py-8 md:py-12 px-4 relative -mt-16 md:-mt-20 z-10">
        <div className="container mx-auto">
          <div className="bg-card/90 backdrop-blur-lg rounded-2xl md:rounded-3xl border border-coaching-primary/20 shadow-2xl shadow-coaching-primary/10 p-6 md:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              <StatsCard 
                number="50K+" 
                label="🎓 Happy Students" 
                icon="✨"
                color="coaching-primary"
              />
              <StatsCard 
                number="1,200+" 
                label="👨‍🏫 Expert Coaches" 
                icon="🌟"
                color="coaching-secondary"
              />
              <StatsCard 
                number="98%" 
                label="📈 Success Rate" 
                icon="🚀"
                color="coaching-accent"
              />
              <StatsCard 
                number="24/7" 
                label="💬 Support" 
                icon="💎"
                color="coaching-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Marquee */}
      <section className="py-8 md:py-12 px-4 bg-coaching-primary/5">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-lg md:text-xl font-semibold text-coaching-primary mb-2">
              🏆 Recent Success Stories
            </h3>
          </div>
          <div className="overflow-hidden">
            <div className="flex animate-marquee space-x-8">
              {[
                "💼 Sarah landed her dream job at Google",
                "📊 Mike increased his business revenue by 300%",
                "🎯 Emma achieved her fitness goals in 3 months",
                "💰 David started a successful side hustle",
                "🌟 Lisa got promoted to team lead",
                "🚀 John launched his own startup",
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

      {/* Enhanced Features Section */}
      <section className="py-16 md:py-24 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-coaching-primary/10 to-coaching-accent/10 text-coaching-primary rounded-full text-sm md:text-base font-medium mb-6 border border-coaching-primary/20">
              ✨ Why 50,000+ Students Choose Us
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Transform Your Life with{' '}
              <span className="bg-coaching-gradient bg-clip-text text-transparent">
                Coaching Kart
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              🌈 Experience personalized learning like never before with our innovative coaching platform designed for your success
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              title="🌟 World-Class Coaches"
              description="Learn from industry leaders, certified professionals, and successful entrepreneurs who have walked the path to success"
              icon="👑"
              color="coaching-primary"
              animationDelay={0}
            />
            <FeatureCard
              title="🎯 AI-Powered Matching"
              description="Our advanced AI algorithm matches you with the perfect coach based on your goals, personality, and learning style"
              icon="🤖"
              color="coaching-secondary"
              animationDelay={200}
            />
            <FeatureCard
              title="💡 Interactive Learning"
              description="Engage with dynamic content, live workshops, and hands-on projects that make learning fun and effective"
              icon="🎮"
              color="coaching-accent"
              animationDelay={400}
            />
            <FeatureCard
              title="⏰ Flexible Scheduling"
              description="Book sessions anytime, anywhere with 24/7 access to resources and global coach availability across time zones"
              icon="🌍"
              color="coaching-primary"
              animationDelay={600}
            />
            <FeatureCard
              title="💎 Premium Experience"
              description="Enjoy a luxury learning experience with personalized dashboards, progress tracking, and exclusive community access"
              icon="👑"
              color="coaching-secondary"
              animationDelay={800}
            />
            <FeatureCard
              title="🚀 Guaranteed Results"
              description="We're so confident in our approach that we offer a 30-day money-back guarantee if you're not satisfied"
              icon="💯"
              color="coaching-accent"
              animationDelay={1000}
            />
          </div>
        </div>
      </section>

      {/* Interactive How It Works */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-coaching-primary/5 to-coaching-accent/5 relative">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              🎯 Your Success Journey
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Start transforming your life in just 3 simple steps - it's easier than you think!
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group relative">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-coaching-primary to-coaching-primary/80 rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-coaching-primary/30">
                1
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">🎉 Sign Up & Discover</h3>
              <p className="text-muted-foreground leading-relaxed">Create your free account and take our fun personality quiz to help us understand your unique learning style and goals</p>
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
                <div className="text-3xl text-coaching-primary/30">→</div>
              </div>
            </div>
            
            <div className="text-center group relative">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-coaching-secondary to-coaching-secondary/80 rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-coaching-secondary/30">
                2
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">🤝 Match & Connect</h3>
              <p className="text-muted-foreground leading-relaxed">Our AI instantly connects you with 3 perfect coach matches. Schedule a free 15-minute chat to find your ideal mentor</p>
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
                <div className="text-3xl text-coaching-accent/30">→</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-coaching-accent to-coaching-accent/80 rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-coaching-accent/30">
                3
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">🚀 Learn & Succeed</h3>
              <p className="text-muted-foreground leading-relaxed">Start your personalized coaching journey with interactive sessions, weekly check-ins, and celebrate your wins together!</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 md:mt-20 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="bg-card/50 rounded-xl p-4 md:p-6 border border-coaching-primary/10">
                <div className="text-2xl md:text-3xl mb-2">🏆</div>
                <div className="font-bold text-foreground text-sm md:text-base">Award Winning</div>
                <div className="text-xs md:text-sm text-muted-foreground">Platform of the Year</div>
              </div>
              <div className="bg-card/50 rounded-xl p-4 md:p-6 border border-coaching-secondary/10">
                <div className="text-2xl md:text-3xl mb-2">🔒</div>
                <div className="font-bold text-foreground text-sm md:text-base">100% Secure</div>
                <div className="text-xs md:text-sm text-muted-foreground">Bank-level Security</div>
              </div>
              <div className="bg-card/50 rounded-xl p-4 md:p-6 border border-coaching-accent/10">
                <div className="text-2xl md:text-3xl mb-2">⭐</div>
                <div className="font-bold text-foreground text-sm md:text-base">4.9/5 Rating</div>
                <div className="text-xs md:text-sm text-muted-foreground">From 10K+ Reviews</div>
              </div>
              <div className="bg-card/50 rounded-xl p-4 md:p-6 border border-coaching-primary/10">
                <div className="text-2xl md:text-3xl mb-2">💰</div>
                <div className="font-bold text-foreground text-sm md:text-base">Money Back</div>
                <div className="text-xs md:text-sm text-muted-foreground">30-Day Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-coaching-accent/10 text-coaching-accent rounded-full text-sm md:text-base font-medium mb-6 border border-coaching-accent/20">
              💖 Love from Our Community
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              🌟 Life-Changing Stories
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Real people, real transformations - hear from our amazing community of achievers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <TestimonialCard
              quote="🚀 Coaching Kart completely transformed my career! I went from feeling stuck to landing my dream job at a Fortune 500 company in just 6 months. The personalized guidance was incredible!"
              author="Sarah Johnson"
              role="Senior Software Engineer at Microsoft"
              rating={5}
            />
            <TestimonialCard
              quote="💰 My business revenue increased by 400% after working with my coach! The strategic insights and accountability helped me scale beyond my wildest dreams. Best investment ever!"
              author="Mike Chen"
              role="CEO & Founder, TechStart"
              rating={5}
            />
            <TestimonialCard
              quote="🌟 The flexible scheduling and expert coaches made learning so enjoyable! I finally found work-life balance and got promoted twice in one year. Couldn't be happier!"
              author="Emily Davis"
              role="Marketing Director"
              rating={5}
            />
            <TestimonialCard
              quote="🎯 The AI matching system is brilliant! I was paired with the perfect coach who understood my goals and helped me build confidence I never knew I had."
              author="David Rodriguez"
              role="Sales Manager"
              rating={5}
            />
            <TestimonialCard
              quote="💎 Premium experience at an affordable price! The community support and quality of coaching exceeded all my expectations. Life-changing platform!"
              author="Lisa Wang"
              role="Product Manager"
              rating={5}
            />
            <TestimonialCard
              quote="🏆 From struggling freelancer to successful agency owner in 1 year! My coach's guidance was instrumental in building my 6-figure business."
              author="Alex Thompson"
              role="Agency Owner"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <CTASection
        title="🎯 Ready to Write Your Success Story?"
        description="✨ Join 50,000+ students who have already transformed their lives. Your extraordinary future starts with one click - take action today!"
        buttonText="🚀 Start My Transformation"
        buttonHref="/register"
      />

      {/* Feature Highlights Grid */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-r from-coaching-primary/5 to-coaching-accent/5">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              🎁 Everything You Need to Succeed
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Premium features designed to accelerate your journey to success
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card/80 backdrop-blur-sm text-center p-6 md:p-8 rounded-2xl border border-coaching-primary/20 hover:shadow-xl hover:shadow-coaching-primary/10 transition-all duration-300 group">
              <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📚</div>
              <h3 className="font-bold text-foreground mb-3 text-lg">Rich Learning Library</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Thousands of resources, templates, and exclusive content</p>
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm text-center p-6 md:p-8 rounded-2xl border border-coaching-secondary/20 hover:shadow-xl hover:shadow-coaching-secondary/10 transition-all duration-300 group">
              <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🎥</div>
              <h3 className="font-bold text-foreground mb-3 text-lg">HD Video Sessions</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Crystal clear video calls and recorded sessions for review</p>
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm text-center p-6 md:p-8 rounded-2xl border border-coaching-accent/20 hover:shadow-xl hover:shadow-coaching-accent/10 transition-all duration-300 group">
              <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📱</div>
              <h3 className="font-bold text-foreground mb-3 text-lg">Mobile App</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Learn anywhere with our beautifully designed mobile app</p>
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm text-center p-6 md:p-8 rounded-2xl border border-coaching-primary/20 hover:shadow-xl hover:shadow-coaching-primary/10 transition-all duration-300 group">
              <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🏆</div>
              <h3 className="font-bold text-foreground mb-3 text-lg">Certificates</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Industry-recognized certifications to boost your career</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Social Proof */}
      <section className="py-12 md:py-16 px-4 bg-coaching-primary/10">
        <div className="container mx-auto">
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">
              🤝 Trusted by Top Companies Worldwide
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
              <div className="text-2xl md:text-3xl font-bold text-muted-foreground">Google</div>
              <div className="text-2xl md:text-3xl font-bold text-muted-foreground">Microsoft</div>
              <div className="text-2xl md:text-3xl font-bold text-muted-foreground">Amazon</div>
              <div className="text-2xl md:text-3xl font-bold text-muted-foreground">Meta</div>
              <div className="text-2xl md:text-3xl font-bold text-muted-foreground">Apple</div>
            </div>
            <p className="text-sm md:text-base text-muted-foreground mt-6">
              🌟 Our coaches and students work at these amazing companies
            </p>
          </div>
        </div>
      </section>
    </div>  );
};

export default HomePage;