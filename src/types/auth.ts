// User roles - matches Prisma enum
export type UserRole = 'STUDENT' | 'COACH' | 'ADMIN';

// Looking for preferences - matches Prisma enum
export type LookingFor = 'Online' | 'Offline' | 'Both';

// Payment related types
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type PaymentMethod = 'online' | 'upi' | 'card' | 'wallet';

// Session modes
export type SessionMode = 'online' | 'offline';

// Booking status
export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';

// Enhanced User interface matching the new schema
export interface User {
  userId: string;
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  city?: string;
  classLevel?: string;
  age?: number;
  schoolOrCollege?: string;
  lookingFor?: LookingFor;
  roles: UserRole[]; // Multiple roles allowed
  enrolledCourseIds: string[]; // Courses the user bought
  demoSessionBookings: string[]; // Demo session bookings
  createdAt: Date;
  updatedAt: Date;
}

export interface Coaching {
  coachingId: string;
  coachingName: string;
  contactNumber: string;
  alternateNumber?: string;
  address: string;
  city: string;
  pincode: string;
  landmark?: string;
  email: string;
  images: string[]; // Image URLs
  courseIds: string[]; // IDs of the courses offered
  reviewIds: string[];
  approved: boolean;
  ownerUserId: string; // The user account managing this coaching
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  courseId: string;
  courseName: string;
  courseDuration: string;
  courseDescription: string;
  courseAmount: number;
  courseDiscount: number;
  courseMRP: number;
  coachingId: string;
  image?: string;
  rating: number;
  courseTeacher: string;
  subjects: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  reviewId: string;
  userId: string;
  coachingId: string;
  courseId?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

export interface Order {
  orderId: string;
  userId: string;
  courseId: string;
  amountPaid: number;
  discountApplied: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}

export interface DemoSession {
  sessionId: string;
  coachingId: string;
  courseId: string;
  mode: SessionMode;
  dateTime: Date;
  durationMinutes: number;
  location?: string; // required if offline
  attendees: string[]; // userIds
  createdAt: Date;
  updatedAt: Date;
}

export interface DemoSessionBooking {
  id: string;
  userId: string;
  sessionId: string;
  bookedAt: Date;
  status: BookingStatus;
}

// Auth-specific interface for NextAuth compatibility
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

// Role-based route access
export const ROLE_ROUTES = {
  STUDENT: ['/dashboard', '/courses', '/profile', '/cart', '/payment'],
  COACH: ['/coaching-dashboard', '/profile', '/courses', '/students'],
  ADMIN: ['/admin-dashboard', '/profile', '/users', '/courses', '/coaches', '/analytics']
} as const;

// Default redirect routes after login
export const DEFAULT_REDIRECTS = {
  STUDENT: '/dashboard',
  COACH: '/coaching-dashboard', 
  ADMIN: '/admin-dashboard'
} as const;
