import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Find Your Perfect{' '}
              <span className="bg-coaching-gradient bg-clip-text text-transparent">
                Coaching
              </span>{' '}
              Match
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-slide-up">
              Connect with experienced coaches and unlock your potential. 
              Quality education made accessible for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Button variant="gradient" size="lg" asChild>
                <Link href="/courses">Explore Courses</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/coaches">Meet Our Coaches</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Why Choose Coaching Kart?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Expert Coaches"
              description="Learn from industry professionals with years of experience"
              color="coaching-primary"
            />
            <FeatureCard
              title="Flexible Learning"
              description="Study at your own pace with personalized coaching sessions"
              color="coaching-secondary"
            />
            <FeatureCard
              title="Affordable Pricing"
              description="Quality education that doesn't break the bank"
              color="coaching-accent"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of students who have transformed their lives with our coaching platform.
            </p>
            <Button variant="default" size="lg" className="animate-bounce-gentle" asChild>
              <Link href="/register">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  color: 'coaching-primary' | 'coaching-secondary' | 'coaching-accent';
}

const FeatureCard = ({ title, description, color }: FeatureCardProps) => {
  const colorClasses = {
    'coaching-primary': 'border-coaching-primary/20 hover:border-coaching-primary/40',
    'coaching-secondary': 'border-coaching-secondary/20 hover:border-coaching-secondary/40',
    'coaching-accent': 'border-coaching-accent/20 hover:border-coaching-accent/40',
  };

  const iconClasses = {
    'coaching-primary': 'bg-coaching-primary/10 text-coaching-primary',
    'coaching-secondary': 'bg-coaching-secondary/10 text-coaching-secondary',
    'coaching-accent': 'bg-coaching-accent/10 text-coaching-accent',
  };

  return (
    <div className={`bg-card p-6 rounded-lg border-2 transition-all duration-300 hover:shadow-coaching-hover ${colorClasses[color]}`}>
      <div className={`w-12 h-12 rounded-lg ${iconClasses[color]} flex items-center justify-center mb-4 mx-auto`}>
        <div className="w-6 h-6 rounded-full bg-current opacity-60"></div>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default HomePage;