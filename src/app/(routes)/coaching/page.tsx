'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CardLoader } from '@/components/ui/loader';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  X, 
  SlidersHorizontal,
  Star,
  Building2,
  BookOpen,
  Award,
  ChevronRight,
  Users
} from 'lucide-react';

interface CoachingProfile {
  id: string;
  profileId: string;
  name: string;
  branchName?: string;
  city: string;
  state: string;
  logo?: string;
  images: string[];
  tagline?: string;
  description: string;
  establishedYear: number;
  contactNumber: string;
  email: string;
  approved: boolean;
  isActive: boolean;
  verificationStatus: 'Pending' | 'Verified' | 'Rejected';
  courses: Array<{
    id: string;
    courseName: string;
    courseAmount: number;
    rating?: number;
    totalRatings?: number;
  }>;
  subjectsOffered: string[];
  examsOffered: string[];
  facilities: string[];
}

interface Coaching {
  id: string;
  coachingId: string;
  organizationName: string;
  approved: boolean;
  isActive: boolean;
  profiles: CoachingProfile[];
}

interface ApiResponse {
  coachings: Coaching[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Enhanced Coaching Card Component
const CoachingCard = ({ coaching }: { coaching: Coaching }) => {
  const mainProfile = coaching.profiles?.[0];
  const totalCourses = coaching.profiles?.reduce((acc, p) => acc + (p.courses?.length || 0), 0) || 0;
  
  const getAvgRating = () => {
    let total = 0, count = 0;
    coaching.profiles?.forEach(p => {
      p.courses?.forEach(c => {
        if (c.rating) { total += c.rating; count++; }
      });
    });
    return count > 0 ? (total / count).toFixed(1) : null;
  };
  
  const rating = getAvgRating();
  const minPrice = mainProfile?.courses?.length 
    ? Math.min(...mainProfile.courses.map(c => c.courseAmount)) 
    : null;
  const exams = mainProfile?.examsOffered?.slice(0, 3) || [];

  return (
    <Link href={`/coaching/${coaching.coachingId}`}>
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-xl hover:border-[#0F52BA]/40 transition-all duration-300 cursor-pointer group h-full">
        {/* Header */}
        <div className="flex gap-4 mb-4">
          {/* Logo */}
          <div className="w-16 h-16 bg-[#0F52BA] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            {mainProfile?.logo ? (
              <img src={mainProfile.logo} alt="" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Building2 className="w-8 h-8 text-white" />
            )}
          </div>
          
          {/* Title & Location */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-[#0F52BA] transition-colors line-clamp-1">
              {coaching.organizationName}
            </h3>
            {mainProfile?.name && mainProfile.name !== coaching.organizationName && (
              <p className="text-sm text-gray-600 line-clamp-1">{mainProfile.name}</p>
            )}
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{mainProfile?.city}, {mainProfile?.state}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {mainProfile?.tagline && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{mainProfile.tagline}</p>
        )}

        {/* Exams */}
        {exams.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {exams.map(exam => (
              <Badge key={exam} variant="outline" className="text-xs border-[#0F52BA]/30 text-[#0F52BA] bg-[#0F52BA]/5">
                {exam}
              </Badge>
            ))}
            {(mainProfile?.examsOffered?.length || 0) > 3 && (
              <Badge variant="outline" className="text-xs border-gray-200 text-gray-500">
                +{(mainProfile?.examsOffered?.length || 0) - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-semibold text-gray-900">{rating}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-gray-400" />
              <span>{totalCourses} Courses</span>
            </div>
            {mainProfile?.verificationStatus === 'Verified' && (
              <div className="flex items-center gap-1 text-green-600">
                <Award className="w-4 h-4" />
                <span className="text-xs font-medium">Verified</span>
              </div>
            )}
          </div>
          
          {minPrice && (
            <div className="text-right">
              <p className="text-xs text-gray-500">From</p>
              <p className="font-bold text-[#0F52BA]">₹{minPrice.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

const CoachingsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [coachings, setCoachings] = useState<Coaching[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const popularExams = ['JEE Main', 'JEE Advanced', 'NEET', 'GATE', 'CAT', 'UPSC', 'SSC'];

  const fetchCoachings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
      });

      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (location.trim()) params.append('location', location.trim());
      if (selectedExams.length > 0) params.append('exams', selectedExams.join(','));

      const response = await fetch(`/api/coaching/public?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch');

      const data: ApiResponse = await response.json();
      setCoachings(data.coachings);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, location, selectedExams, sortBy]);

  useEffect(() => { fetchCoachings(); }, [fetchCoachings]);

  useEffect(() => {
    if (pagination.page !== 1) setPagination(prev => ({ ...prev, page: 1 }));
  }, [searchQuery, location, selectedExams, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setSelectedExams([]);
  };

  const toggleExam = (exam: string) => {
    setSelectedExams(prev => 
      prev.includes(exam) ? prev.filter(e => e !== exam) : [...prev, exam]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          {/* Search Row */}
          <div className="flex gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search coaching institutes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 text-base border-gray-200 focus:border-[#0F52BA] rounded-xl"
              />
            </div>
            <div className="relative w-44 hidden md:block">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="City"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 h-11 text-base border-gray-200 focus:border-[#0F52BA] rounded-xl"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-11 px-4 border-gray-200 ${showFilters ? 'bg-[#0F52BA]/5 border-[#0F52BA] text-[#0F52BA]' : ''}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="ml-2 hidden sm:inline">Filters</span>
              {selectedExams.length > 0 && (
                <Badge className="ml-2 bg-[#0F52BA] text-white text-xs px-1.5">{selectedExams.length}</Badge>
              )}
            </Button>
          </div>
          
          {/* Filter Chips */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 py-2">
              {popularExams.map(exam => (
                <Button
                  key={exam}
                  variant={selectedExams.includes(exam) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleExam(exam)}
                  className={`h-9 px-4 rounded-full text-sm ${
                    selectedExams.includes(exam) 
                      ? 'bg-[#0F52BA] hover:bg-[#0A3d8F]' 
                      : 'border-gray-200 hover:border-[#0F52BA] hover:text-[#0F52BA]'
                  }`}
                >
                  {exam}
                </Button>
              ))}
              {selectedExams.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-sm text-gray-500 hover:text-red-500">
                  <X className="w-4 h-4 mr-1" /> Clear
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {loading ? 'Finding institutes...' : `${pagination.total} Coaching Institutes`}
            </h2>
            {(location || selectedExams.length > 0) && (
              <p className="text-sm text-gray-500 mt-0.5">
                {location && `in ${location}`}
                {selectedExams.length > 0 && ` for ${selectedExams.join(', ')}`}
              </p>
            )}
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:border-[#0F52BA] outline-none bg-white"
          >
            <option value="relevance">Most Relevant</option>
            <option value="rating">Top Rated</option>
            <option value="price-low">Lowest Price</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                <div className="flex gap-2 mb-3">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && coachings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coachings.map(coaching => (
              <CoachingCard key={coaching.id} coaching={coaching} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <Button
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
              className="h-10 px-5"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 px-4">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
              className="h-10 px-5"
            >
              Next
            </Button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && coachings.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No institutes found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Try adjusting your search or filters to find coaching institutes
            </p>
            <Button onClick={clearFilters} className="bg-[#0F52BA]">Clear Filters</Button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchCoachings} className="bg-[#0F52BA]">Try Again</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachingsPage;