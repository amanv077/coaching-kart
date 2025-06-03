'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonLoader } from '@/components/ui/loader';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement form submission logic
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Thank you for your message! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-coaching-primary/10 to-coaching-accent/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-coaching-gradient bg-clip-text  ">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our coaching services? We&apos;re here to help you find the perfect educational match.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form - Left Side (2/3 width) */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-coaching-primary/10">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MessageCircle className="text-coaching-primary" />
                  Send us a Message
                </CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                        className="focus:ring-coaching-primary focus:border-coaching-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                        className="focus:ring-coaching-primary focus:border-coaching-primary"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="focus:ring-coaching-primary focus:border-coaching-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Subject *
                      </label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What can we help you with?"
                        required
                        className="focus:ring-coaching-primary focus:border-coaching-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your query..."
                      rows={6}
                      required
                      className="focus:ring-coaching-primary focus:border-coaching-primary resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-coaching-primary hover:bg-coaching-primary/90 text-white font-medium py-3"
                  >                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <ButtonLoader size="sm" />
                        Sending Message...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send size={16} />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information - Right Side (1/3 width) */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="shadow-lg border-coaching-secondary/10">
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-coaching-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-medium">Address</h4>
                    <p className="text-sm text-muted-foreground">
                      123 Education Hub, <br />
                      Knowledge District, <br />
                      New Delhi, India - 110001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-coaching-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-sm text-muted-foreground">
                      +91 98765 43210 <br />
                      +91 87654 32109
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="text-coaching-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-sm text-muted-foreground">
                      info@coachingkart.com <br />
                      support@coachingkart.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="text-coaching-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-medium">Business Hours</h4>
                    <p className="text-sm text-muted-foreground">
                      Monday - Friday: 9:00 AM - 7:00 PM <br />
                      Saturday: 10:00 AM - 5:00 PM <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Options */}
            <Card className="shadow-lg border-coaching-accent/10">
              <CardHeader>
                <CardTitle className="text-xl">Quick Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-coaching-primary text-coaching-primary hover:bg-coaching-primary hover:text-white"
                  onClick={() => window.open('tel:+919876543210')}
                >
                  <Phone size={16} className="mr-2" />
                  Call Now
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-coaching-secondary text-coaching-secondary hover:bg-coaching-secondary hover:text-white"
                  onClick={() => window.open('mailto:info@coachingkart.com')}
                >
                  <Mail size={16} className="mr-2" />
                  Send Email
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-coaching-accent text-coaching-accent hover:bg-coaching-accent hover:text-white"
                  onClick={() => window.open('https://wa.me/919876543210', '_blank')}
                >
                  <MessageCircle size={16} className="mr-2" />
                  WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Find Us Here</CardTitle>
              <p className="text-center text-muted-foreground">
                Visit our office for in-person consultations and support
              </p>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full rounded-lg overflow-hidden border">
                {/* Google Maps Embed */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.9462889635384!2d77.2273!3d28.6129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2daa9eb4d0b%3A0x717971125923e5d!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1635787234567!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="CoachingKart Office Location"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">How quickly do you respond to inquiries?</h3>
                <p className="text-sm text-muted-foreground">
                  We typically respond to all inquiries within 24 hours during business days. Urgent queries are handled within 2-4 hours.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Do you provide free consultations?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! We offer free initial consultations to help you understand our services and find the right coaching match.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Can I visit your office without an appointment?</h3>
                <p className="text-sm text-muted-foreground">
                  While walk-ins are welcome, we recommend scheduling an appointment to ensure our team can give you dedicated attention.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Do you have weekend support?</h3>
                <p className="text-sm text-muted-foreground">
                  We offer limited weekend support on Saturdays. For urgent matters, you can reach us via WhatsApp or email.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;