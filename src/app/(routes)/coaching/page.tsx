'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CardLoader } from '@/components/ui/loader';
import PublicCoachingCard from '@/components/common/PublicCoachingCard';
import CoachingFilters from '@/components/common/CoachingFilters';
import { SlidersHorizontal, Grid, List } from 'lucide-react';

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
	const [selectedModes, setSelectedModes] = useState<string[]>([]);
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
	}, [searchQuery, location, selectedSubjects, selectedExams, priceRange, sortBy]);
	const clearFilters = () => {
		setSearchQuery('');
		setLocation('');
		setSelectedSubjects([]);
		setSelectedExams([]);
		setSelectedModes([]);
		setPriceRange([0, 100000]);
	};

	const handlePageChange = (newPage: number) => {
		setPagination(prev => ({ ...prev, page: newPage }));
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="bg-gradient-to-r from-coaching-primary/10 to-coaching-accent/10 py-12">
				<div className="container mx-auto px-4">
					<div className="text-center">
						<h1 className="text-4xl md:text-5xl font-bold mb-4 bg-coaching-gradient bg-clip-text  ">
							Find the Perfect Coaching
						</h1>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Discover top-rated coaching institutes near you. Compare, connect, and
							kickstart your learning journey.
						</p>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Filters Sidebar */}
					<div
						className={`lg:w-80 ${
							showFilters ? 'block' : 'hidden lg:block'
						}`}
					>
						<div className="sticky top-8">
							<CoachingFilters
								searchQuery={searchQuery}
								setSearchQuery={setSearchQuery}
								location={location}
								setLocation={setLocation}
								selectedSubjects={selectedSubjects}
								setSelectedSubjects={setSelectedSubjects}
								selectedExams={selectedExams}
								setSelectedExams={setSelectedExams}
								selectedModes={selectedModes}
								setSelectedModes={setSelectedModes}
								priceRange={priceRange}
								setPriceRange={setPriceRange}
								onClearFilters={clearFilters}
							/>
						</div>
					</div>

					{/* Main Content */}
					<div className="flex-1">						{/* Results Header */}
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
							<div>
								{!loading && (
									<h2 className="text-2xl font-bold">
										{`${pagination.total} Coaching${pagination.total !== 1 ? 's' : ''} Found`}
									</h2>
								)}
								<p className="text-muted-foreground">
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
									className="lg:hidden"
								>
									<SlidersHorizontal size={16} className="mr-2" />
									Filters
								</Button>

								{/* Sort Dropdown */}
								<select
									value={sortBy}
									onChange={e => setSortBy(e.target.value)}
									className="px-3 py-2 border rounded-md text-sm bg-background"
								>
									<option value="relevance">Most Relevant</option>
									<option value="rating">Highest Rated</option>
									<option value="price-low">Price: Low to High</option>
									<option value="price-high">Price: High to Low</option>
									<option value="newest">Newest First</option>
								</select>

								{/* View Toggle */}
								<div className="flex border rounded-md">
									<Button
										variant={viewMode === 'grid' ? 'default' : 'ghost'}
										size="sm"
										onClick={() => setViewMode('grid')}
									>
										<Grid size={16} />
									</Button>
									<Button
										variant={viewMode === 'list' ? 'default' : 'ghost'}
										size="sm"
										onClick={() => setViewMode('list')}
									>
										<List size={16} />
									</Button>
								</div>
							</div>
						</div>						{/* Loading State */}
						{loading && (
							<CardLoader text="Loading coaching institutes..." />
						)}{/* Results Grid */}
						{!loading && !error && coachings.length > 0 && (
							<div
								className={
									viewMode === 'grid'
										? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
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
							<div className="flex justify-center items-center gap-4 mt-8">
								<Button
									variant="outline"
									disabled={pagination.page === 1}
									onClick={() => handlePageChange(pagination.page - 1)}
								>
									Previous
								</Button>
								<span className="text-sm text-muted-foreground">
									Page {pagination.page} of {pagination.totalPages}
								</span>
								<Button
									variant="outline"
									disabled={pagination.page === pagination.totalPages}
									onClick={() => handlePageChange(pagination.page + 1)}
								>
									Next
								</Button>
							</div>
						)}

						{/* No Results */}
						{!loading && !error && coachings.length === 0 && (
							<div className="text-center py-16">
								<div className="text-6xl mb-4">🔍</div>
								<h3 className="text-xl font-semibold mb-2">
									No coaching institutes found
								</h3>
								<p className="text-muted-foreground mb-4">
									Try adjusting your filters or search criteria
								</p>
								<Button onClick={clearFilters}>Clear All Filters</Button>
							</div>
						)}

						{/* Error State */}
						{!loading && error && (
							<div className="text-center py-16">
								<div className="text-6xl mb-4">⚠️</div>
								<h3 className="text-xl font-semibold mb-2">
									Something went wrong
								</h3>
								<p className="text-muted-foreground mb-4">
									{error}
								</p>
								<Button onClick={fetchCoachings}>Try Again</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CoachingsPage;