import React from 'react';
import { FaGraduationCap, FaUserTie, FaChartLine, FaHandshake } from 'react-icons/fa';

// Import common reusable components
import PageHeader from '@/components/common/PageHeader';
import ValueCard from '@/components/common/ValueCard';
import TeamMember from '@/components/common/TeamMember';
import Quote from '@/components/common/Quote';
import MetricCard from '@/components/common/MetricCard';

// Import page-specific components
import StoryThread from './StoryThread';
import StoryNode from './StoryNode';

// Main About Us Component
const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Our Journey to Transform Education"
        subtitle="We're on a mission to make quality coaching accessible, affordable, and transparent for every student in India"
      />

      <div className="container mx-auto px-4 pb-24">
        {/* Vision and Mission */}
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <div className="bg-gradient-to-br from-coaching-primary/10 to-coaching-accent/10 p-8 rounded-2xl">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-coaching-primary text-3xl">🔭</span> Our
              Vision
            </h2>
            <p className="text-lg leading-relaxed text-foreground/90">
              To create a world where every student has equal access to
              high-quality education, regardless of their location or economic
              background. We envision a future where finding the right coaching
              is easy, transparent, and affordable for all.
            </p>
          </div>
          <div className="bg-gradient-to-br from-coaching-accent/10 to-coaching-primary/10 p-8 rounded-2xl">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-coaching-accent text-3xl">🎯</span> Our
              Mission
            </h2>
            <p className="text-lg leading-relaxed text-foreground/90">
              To bridge the gap between students and coaching institutes by
              building a platform that offers unbiased information, verified
              reviews, and exclusive discounts. We&apos;re committed to
              transforming how students discover, compare, and access
              educational resources.
            </p>
          </div>
        </div>

        {/* Our Story Thread */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Our Journey
          </h2>

          <StoryThread>
            <StoryNode
              year="2020"
              title="The Beginning"
              description="CoachingKart was born from a simple observation: students were struggling to find reliable information about coaching institutes. Our founders, former students themselves, experienced the frustration of making uninformed decisions about their education. They envisioned a platform where students could access transparent, verified information about educational options."
              image="/images/about/beginning.jpg"
              icon={<FaGraduationCap />}
              isLeft={true}
            />

            <StoryNode
              year="2021"
              title="Building Partnerships"
              description="We began building relationships with coaching institutes across India, starting with just 50 partners. Our team traveled to different cities, meeting institute owners and understanding their challenges. We created win-win partnerships that helped institutes reach more students while giving students more options."
              image="/images/about/partnerships.jpg"
              icon={<FaHandshake />}
              isLeft={false}
            />

            <StoryNode
              year="2022"
              title="Launching Student Services"
              description="We introduced our core student services: free demo classes, price matching, and verified reviews. The response was overwhelming. Students could now try before they committed, get the best prices, and learn from others experiences. Our platform began growing rapidly through word-of-mouth."
              image="/images/about/services.jpg"
              icon={<FaUserTie />}
              isLeft={true}
            />

            <StoryNode
              year="2023"
              title="Nationwide Expansion"
              description="CoachingKart expanded to over 100 cities across India. We reached a milestone of 5,000+ coaching institutes on our platform, covering everything from JEE/NEET preparation to language courses and professional certifications. Our community grew to over 100,000 students who found their perfect educational match."
              image="/images/about/growth.jpg"
              icon={<FaChartLine />}
              isLeft={false}
            />
          </StoryThread>
        </div>

        {/* Our Values */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              These core principles guide every decision we make and every
              feature we develop
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard
              icon={<span className="text-2xl">⭐</span>}
              title="Student First"
              description="Every decision we make prioritizes student needs and educational outcomes. We're committed to being an advocate for students."
            />

            <ValueCard
              icon={<span className="text-2xl">🔍</span>}
              title="Transparency"
              description="We believe in complete honesty about coaching quality, pricing, and student experiences. No hidden fees or misleading claims."
            />

            <ValueCard
              icon={<span className="text-2xl">🤝</span>}
              title="Accessibility"
              description="Quality education should be accessible to all students regardless of location or economic background."
            />

            <ValueCard
              icon={<span className="text-2xl">🚀</span>}
              title="Innovation"
              description="We constantly improve our platform to create better ways for students to discover and access educational opportunities."
            />
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="mb-24 bg-gradient-to-r from-coaching-primary/5 to-coaching-accent/5 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-lg text-muted-foreground">
              The difference we&apos;re making in education
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <MetricCard value="5,000+" label="Coaching Institutes" />
            <MetricCard value="100+" label="Cities Covered" />
            <MetricCard value="₹15Cr+" label="Student Savings" />
            <MetricCard value="100K+" label="Students Helped" />
          </div>
        </div>

        {/* Quote */}
        <div className="mb-24">
          <Quote
            text="Education is the most powerful weapon which you can use to change the world. At CoachingKart, we're making sure every student has access to the best educational resources to change their world."
            author="Priya Sharma"
            role="Founder & CEO, CoachingKart"
          />
        </div>

        {/* Meet the Team */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Passionate educators, technologists, and changemakers committed to
              transforming education access
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <TeamMember
              name="Priya Sharma"
              role="Founder & CEO"
              image="/images/team/founder.jpg"
              bio="Former IIT student who experienced firsthand the challenges of finding the right coaching. Committed to making education accessible for all."
            />

            <TeamMember
              name="Rahul Verma"
              role="Chief Technology Officer"
              image="/images/team/cto.jpg"
              bio="Tech innovator with expertise in educational platforms. Passionate about using technology to solve real educational problems."
            />

            <TeamMember
              name="Neha Patel"
              role="Head of Partnerships"
              image="/images/team/partnerships.jpg"
              bio="10+ years in education sector, building relationships between students and quality educational providers."
            />

            <TeamMember
              name="Arjun Mehta"
              role="Student Success Lead"
              image="/images/team/success.jpg"
              bio="Former career counselor who ensures our platform truly meets student needs and delivers meaningful outcomes."
            />
          </div>
        </div>

        {/* Join Our Mission */}
        <div className="text-center bg-gradient-to-br from-coaching-primary/10 via-transparent to-coaching-accent/10 rounded-3xl p-8 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Whether you&apos;re a student seeking the best education, a coaching
            institute looking to reach more students, or a passionate individual
            wanting to join our team — we&apos;d love to connect with you.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="px-8 py-3 bg-coaching-primary text-white font-medium rounded-full hover:bg-coaching-primary/90 transition-colors duration-300 shadow-lg shadow-coaching-primary/20 hover:shadow-coaching-primary/40"
            >
              Contact Us
            </a>

            <a
              href="/careers"
              className="px-8 py-3 bg-gradient-to-r from-coaching-secondary to-coaching-accent text-white font-medium rounded-full hover:opacity-90 transition-opacity duration-300 shadow-lg shadow-coaching-accent/20 hover:shadow-coaching-accent/40"
            >
              Join Our Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;