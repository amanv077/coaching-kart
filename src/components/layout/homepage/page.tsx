import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Search, Users, Award, CheckCircle, Star, Play, BookOpen, Target, TrendingUp, Shield, Clock, MapPin } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-20 w-60 h-60 bg-primary/3 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8 border border-primary/20 backdrop-blur-sm animate-fade-in">
              <Star className="w-4 h-4 mr-2" />
              India's Most Trusted Coaching Platform
            </div>
            
            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-tight animate-slide-up">
              Find Your Perfect
              <span className="block text-gradient bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Coaching Match
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up delay-300">
              Compare 5000+ verified coaching institutes, book free demo classes, and get the best price for your education journey. Join 25,000+ students who found their success.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-slide-up delay-500">
              <Button size="lg" className="px-10 py-6 text-lg premium-shadow hover:scale-105 transition-all duration-300 group" asChild>
                <Link href="/coaching">
                  <Search className="w-5 h-5 mr-2" />
                  Explore Coaching Options
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="px-10 py-6 text-lg hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-300 group backdrop-blur-sm" asChild>
                <Link href="/free-trial">
                  <Play className="w-5 h-5 mr-2" />
                  Book Free Demo
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-slide-up delay-700">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5,000+</div>
                <div className="text-sm text-muted-foreground">Verified Institutes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">25,000+</div>
                <div className="text-sm text-muted-foreground">Happy Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>      {/* Features Section with Modern Cards */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8 border border-primary/20">
              <Target className="w-4 h-4 mr-2" />
              Why Choose CoachingKart
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Everything You Need for
              <span className="block text-gradient bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Academic Success
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We provide comprehensive tools and resources to help you make informed decisions about your coaching education
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="group relative bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Verified Institutes</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Every coaching institute is thoroughly verified for quality, credentials, faculty expertise, and student satisfaction rates.
                </p>
                <div className="flex items-center text-primary font-medium">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="group relative bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Expert Faculty</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Learn from experienced educators with proven track records and specialized expertise in their respective fields.
                </p>
                <div className="flex items-center text-blue-500 font-medium">
                  <span>Explore faculty</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="group relative bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Proven Results</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Track record of success with detailed analytics, performance insights, and transparent result reporting.
                </p>
                <div className="flex items-center text-green-500 font-medium">
                  <span>View results</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="group relative bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Community Support</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Join a thriving community of learners and get peer support throughout your educational journey.
                </p>
                <div className="flex items-center text-purple-500 font-medium">
                  <span>Join community</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>

            {/* Feature Card 5 */}
            <div className="group relative bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Flexible Schedules</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Choose from various batch timings and learning formats that perfectly fit your lifestyle and commitments.
                </p>
                <div className="flex items-center text-orange-500 font-medium">
                  <span>View schedules</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>

            {/* Feature Card 6 */}
            <div className="group relative bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">24/7 Support</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Get help whenever you need it with our dedicated customer support team available round the clock.
                </p>
                <div className="flex items-center text-red-500 font-medium">
                  <span>Get support</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* How It Works - Interactive Timeline */}
      <section className="py-32 px-4 bg-gradient-to-br from-primary/5 via-background to-blue-500/5 relative">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8 border border-primary/20">
              <MapPin className="w-4 h-4 mr-2" />
              Your Learning Journey
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Three simple steps to find and enroll in your ideal coaching program
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary via-blue-500 to-primary"></div>
            
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg shadow-primary/30 group-hover:scale-110 transition-all duration-300">
                  1
                </div>
                <div className="absolute -top-2 -left-2 w-24 h-24 border-2 border-primary/20 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Search & Compare</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Browse through our extensive database of verified coaching institutes. Use advanced filters to find institutes based on your location, budget, course requirements, and preferred teaching methodology.
              </p>
              <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Search className="w-4 h-4 mr-2 text-primary" />
                  Advanced search filters available
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-all duration-300">
                  2
                </div>
                <div className="absolute -top-2 -left-2 w-24 h-24 border-2 border-blue-500/20 rounded-full animate-pulse delay-1000"></div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Book Free Trial</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Schedule free demo classes with multiple institutes to experience their teaching methods firsthand. Interact with faculty, understand the curriculum, and assess the learning environment.
              </p>
              <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Play className="w-4 h-4 mr-2 text-blue-500" />
                  Free demo classes included
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg shadow-green-500/30 group-hover:scale-110 transition-all duration-300">
                  3
                </div>
                <div className="absolute -top-2 -left-2 w-24 h-24 border-2 border-green-500/20 rounded-full animate-pulse delay-2000"></div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Enroll & Succeed</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Complete your enrollment with confidence and begin your journey towards academic excellence. Get ongoing support and track your progress throughout the course.
              </p>
              <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Award className="w-4 h-4 mr-2 text-green-500" />
                  Success tracking included
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Button size="lg" className="px-8 py-4 text-lg" asChild>
              <Link href="/coaching">
                Start Your Journey Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>      {/* Student Success Stories - Interactive Testimonials */}
      <section className="py-32 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8 border border-primary/20">
              <Users className="w-4 h-4 mr-2" />
              Student Success Stories
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              What Our Students Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real stories from students who found their perfect coaching match through our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="group relative bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  "CoachingKart helped me find the perfect JEE coaching institute. The trial classes were incredibly helpful in making my decision. I'm now confident in my choice!"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">AS</span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Arjun Sharma</div>
                    <div className="text-sm text-muted-foreground">JEE Aspirant, AIR 235</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="group relative bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 hover:border-blue-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  "The platform made it so easy to compare different NEET coaching options. I found exactly what I was looking for and the support team was amazing throughout."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">PG</span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Priya Gupta</div>
                    <div className="text-sm text-muted-foreground">NEET Student, Top 100</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="group relative bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 hover:border-green-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  "Excellent support throughout the process. The team helped me every step of the way to find the right coaching institute. Highly recommended!"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">RK</span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Rahul Kumar</div>
                    <div className="text-sm text-muted-foreground">CA Foundation Student</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-sm text-muted-foreground">Coaching Partners</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-blue-500 mb-2 group-hover:scale-110 transition-transform">95%</div>
              <div className="text-sm text-muted-foreground">Student Satisfaction</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-green-500 mb-2 group-hover:scale-110 transition-transform">15K+</div>
              <div className="text-sm text-muted-foreground">Success Stories</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-purple-500 mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-sm text-muted-foreground">Expert Support</div>
            </div>
          </div>
        </div>
      </section>      {/* Premium CTA Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-primary via-blue-600 to-purple-600 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Start Your
              <span className="block">Learning Journey?</span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed">
              Join thousands of students who have found their perfect coaching match. 
              Start exploring today and take the first step towards academic excellence.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium">
                ✓ Free Demo Classes
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium">
                ✓ Verified Institutes
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium">
                ✓ Expert Support
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium">
                ✓ Best Price Guarantee
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button variant="secondary" size="lg" className="px-10 py-6 text-lg bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300" asChild>
                <Link href="/coaching">
                  Browse Coaching Options
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-10 py-6 text-lg bg-transparent border-white text-white hover:bg-white hover:text-primary transition-all duration-300" asChild>
                <Link href="/free-trial">
                  Book Free Trial
                  <Play className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators & Partners */}
      <section className="py-24 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Trusted by Leading Coaching Institutes
            </h3>
            <p className="text-muted-foreground">
              Partnering with India's top coaching centers to bring you the best education
            </p>
          </div>
          
          {/* Partner Logos */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center mb-16">
            <div className="text-2xl md:text-3xl font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              ALLEN
            </div>
            <div className="text-2xl md:text-3xl font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              FIITJEE
            </div>
            <div className="text-2xl md:text-3xl font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              Aakash
            </div>
            <div className="text-2xl md:text-3xl font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              Resonance
            </div>
            <div className="text-2xl md:text-3xl font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              TIME
            </div>
          </div>

          {/* Final Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50">
              <div className="text-4xl font-bold text-primary mb-2">5000+</div>
              <div className="text-lg font-semibold text-foreground mb-2">Coaching Institutes</div>
              <div className="text-sm text-muted-foreground">Verified and trusted nationwide</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50">
              <div className="text-4xl font-bold text-blue-500 mb-2">25,000+</div>
              <div className="text-lg font-semibold text-foreground mb-2">Students Helped</div>
              <div className="text-sm text-muted-foreground">Found their perfect coaching match</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50">
              <div className="text-4xl font-bold text-green-500 mb-2">98%</div>
              <div className="text-lg font-semibold text-foreground mb-2">Success Rate</div>
              <div className="text-sm text-muted-foreground">Students satisfied with their choice</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;