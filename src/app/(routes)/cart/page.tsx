"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/loader';
import Link from 'next/link';

const CartPage = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  if (session.user?.role !== 'STUDENT') {
    redirect('/');
  }

  // Mock cart items
  const cartItems = [
    {
      id: 1,
      title: 'Advanced Mathematics',
      coach: 'Dr. Sarah Johnson',
      price: 99.99,
      originalPrice: 129.99,
      image: '/api/placeholder/300/200',
    },
    {
      id: 2,
      title: 'Physics Fundamentals',
      coach: 'Prof. Michael Chen',
      price: 89.99,
      originalPrice: 109.99,
      image: '/api/placeholder/300/200',
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const discount = cartItems.reduce((sum, item) => sum + (item.originalPrice - item.price), 0);
  const total = subtotal;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Shopping Cart 🛒</h1>
          <p className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? 'course' : 'courses'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Discover amazing courses and start your learning journey today!
                </p>
                <Button asChild>
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-16 bg-coaching-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">📚</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">by {item.coach}</p>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg text-coaching-primary">
                          ${item.price}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${item.originalPrice}
                          </span>
                        )}
                        {item.originalPrice > item.price && (
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                            Save ${(item.originalPrice - item.price).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button variant="outline" size="sm">
                        Save for Later
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {cartItems.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-bold text-foreground mb-4">Recommended for You</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map((rec) => (
                    <div key={rec} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="w-full h-20 bg-coaching-secondary/20 rounded-lg mb-3 flex items-center justify-center">
                        <span className="text-coaching-secondary font-bold">📖</span>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">Chemistry Basics</h4>
                      <p className="text-sm text-muted-foreground mb-2">by Dr. Emma Wilson</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-coaching-primary">$79.99</span>
                        <Button size="sm" variant="outline">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-8">
                <h3 className="font-bold text-foreground mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="font-bold text-xl text-coaching-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/courses">Continue Shopping</Link>
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                    <span>🔒</span>
                    <span>Secure checkout with 256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                    <span>💯</span>
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>🎓</span>
                    <span>Lifetime access to course materials</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;