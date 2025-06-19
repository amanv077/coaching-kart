'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CardLoader } from '@/components/ui/loader';
import PublicCoachingCard from '@/components/common/PublicCoachingCard';
import { 
  Search, 
  MapPin, 
  Filter, 
  X, 
  Grid, 
  List, 
  SlidersHorizontal,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  Sliders
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

const CoachingsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
  const [quickFilter, setQuickFilter] = useState<string>('');

  // Popular subjects and exams
  const popularSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'Economics'];
  const popularExams = ['JEE Main', 'JEE Advanced', 'NEET', 'GATE', 'CAT', 'UPSC', 'SSC', 'Bank PO'];
  const quickFilters = [
    { label: 'Top Rated', value: 'top-rated', icon: Star },
    { label: 'Most Popular', value: 'popular', icon: TrendingUp },
    { label: 'Recently Added', value: 'recent', icon: Clock },
    { label: 'Budget Friendly', value: 'budget', icon: DollarSign }
  ];

  // Fetch coachings from API
  const fetchCoachings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
      });

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      if (location.trim()) {
        params.append('location', location.trim());
      }
      if (selectedSubjects.length > 0) {
        params.append('subjects', selectedSubjects.join(','));
      }
      if (selectedExams.length > 0) {
        params.append('exams', selectedExams.join(','));
      }
      if (priceRange[0] > 0 || priceRange[1] < 100000) {
        params.append('minPrice', priceRange[0].toString());
        params.append('maxPrice', priceRange[1].toString());
      }
      if (quickFilter) {
        params.append('quickFilter', quickFilter);
      }

      const response = await fetch(`/api/coaching/public?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch coachings: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      setCoachings(data.coachings);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching coachings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch coachings');
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    searchQuery,
    location,
    selectedSubjects,
    selectedExams,
    priceRange,
    sortBy,
    quickFilter,
  ]);

  // Fetch coachings on component mount and when filters change
  useEffect(() => {
    fetchCoachings();
  }, [fetchCoachings]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [searchQuery, location, selectedSubjects, selectedExams, priceRange, sortBy, quickFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setSelectedSubjects([]);
    setSelectedExams([]);
    setPriceRange([0, 100000]);
    setQuickFilter('');
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addFilter = (value: string, type: 'subject' | 'exam') => {
    if (type === 'subject' && !selectedSubjects.includes(value)) {
      setSelectedSubjects([...selectedSubjects, value]);
    } else if (type === 'exam' && !selectedExams.includes(value)) {
      setSelectedExams([...selectedExams, value]);
    }
  };

  const removeFilter = (value: string, type: 'subject' | 'exam') => {
    if (type === 'subject') {
      setSelectedSubjects(selectedSubjects.filter(s => s !== value));
    } else if (type === 'exam') {
      setSelectedExams(selectedExams.filter(e => e !== value));
    }
  };

  const getActiveFiltersCount = () => {
    return selectedSubjects.length + selectedExams.length + 
      (location ? 1 : 0) + 
      (priceRange[0] > 0 || priceRange[1] < 100000 ? 1 : 0) +
      (quickFilter ? 1 : 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full -translate-x-32 -translate-y-32 opacity-60"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full translate-x-32 translate-y-32 opacity-60"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Coaching Institute
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover top-rated coaching institutes, compare options, and make the right choice for your academic journey
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    placeholder="Search coaching institutes, subjects, or exams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl"
                  />
                </div>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    placeholder="Enter your city or area"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-12 h-14 text-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl"
                  />
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-3">
                {quickFilters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <Button
                      key={filter.value}
                      variant={quickFilter === filter.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setQuickFilter(quickFilter === filter.value ? '' : filter.value)}
                      className="h-11 px-5 rounded-xl transition-all duration-200 hover:scale-105 border-gray-200"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {filter.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Sliders className="w-5 h-5 mr-2" />
                    Filters
                  </h3>
                  {getActiveFiltersCount() > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Active Filters */}
                {getActiveFiltersCount() > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Active Filters</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubjects.map((subject) => (
                        <Badge
                          key={subject}
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          {subject}
                          <X
                            className="w-3 h-3 ml-1 cursor-pointer"
                            onClick={() => removeFilter(subject, 'subject')}
                          />
                        </Badge>
                      ))}
                      {selectedExams.map((exam) => (
                        <Badge
                          key={exam}
                          variant="secondary"
                          className="bg-green-100 text-green-800 hover:bg-green-200"
                        >
                          {exam}
                          <X
                            className="w-3 h-3 ml-1 cursor-pointer"
                            onClick={() => removeFilter(exam, 'exam')}
                          />
                        </Badge>
                      ))}
                      {location && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                          {location}
                          <X
                            className="w-3 h-3 ml-1 cursor-pointer"
                            onClick={() => setLocation('')}
                          />
                        </Badge>
                      )}
                      {quickFilter && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                          {quickFilters.find(f => f.value === quickFilter)?.label}
                          <X
                            className="w-3 h-3 ml-1 cursor-pointer"
                            onClick={() => setQuickFilter('')}
                          />
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Subjects Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Subjects</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {popularSubjects.map((subject) => (
                      <Button
                        key={subject}
                        variant={selectedSubjects.includes(subject) ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          selectedSubjects.includes(subject)
                            ? removeFilter(subject, 'subject')
                            : addFilter(subject, 'subject')
                        }
                        className="h-9 text-xs justify-start px-3 rounded-lg"
                      >
                        {subject}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Exams Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Exams</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {popularExams.map((exam) => (
                      <Button
                        key={exam}
                        variant={selectedExams.includes(exam) ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          selectedExams.includes(exam)
                            ? removeFilter(exam, 'exam')
                            : addFilter(exam, 'exam')
                        }
                        className="h-9 text-xs justify-start px-3 rounded-lg"
                      >
                        {exam}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>₹{priceRange[0].toLocaleString()}</span>
                      <span>₹{priceRange[1].toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                {!loading && (
                  <h2 className="text-2xl font-bold text-gray-900">
                    {`${pagination.total} Coaching${pagination.total !== 1 ? 's' : ''} Found`}
                  </h2>
                )}
                <p className="text-gray-600 mt-1">
                  {location &&
                    `in ${location}${selectedSubjects.length > 0 
                      ? ` for ${selectedSubjects.join(', ')}` 
                      : ''}`}
                </p>
                {error && (
                  <p className="text-red-500 text-sm mt-1">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden border-gray-200"
                >
                  <SlidersHorizontal size={16} className="mr-2" />
                  Filters
                  {getActiveFiltersCount() > 0 && (
                    <Badge className="ml-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </Button>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>

                {/* View Toggle */}
                <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-none border-0"
                  >
                    <Grid size={16} />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-none border-0"
                  >
                    <List size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-20">
                <CardLoader text="Loading coaching institutes..." />
              </div>
            )}

            {/* Results Grid */}
            {!loading && !error && coachings.length > 0 && (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'
                    : 'space-y-6'
                }
              >
                {coachings.map((coaching: Coaching) => (
                  <PublicCoachingCard 
                    key={coaching.id} 
                    coaching={coaching}
                    variant={viewMode === 'list' ? 'compact' : 'default'}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <Button
                  variant="outline"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="border-gray-200"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={pagination.page === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-10 h-10 p-0 border-gray-200"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="border-gray-200"
                >
                  Next
                </Button>
              </div>
            )}

            {/* No Results */}
            {!loading && !error && coachings.length === 0 && (
              <div className="text-center py-20">
                <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                  No coaching institutes found
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your filters or search criteria to find more results
                </p>
                <Button onClick={clearFilters} className="bg-blue-600 hover:bg-blue-700">
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="text-center py-20">
                <div className="w-32 h-32 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                  Something went wrong
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {error}
                </p>
                <Button onClick={fetchCoachings} className="bg-blue-600 hover:bg-blue-700">
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachingsPage;