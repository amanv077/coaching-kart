'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import CoachingCard from '@/components/common/CoachingCard';
import CoachingFilters from '@/components/common/CoachingFilters';
import { Loader2, SlidersHorizontal, Grid, List } from 'lucide-react';

// Mock data - replace with actual API call
const mockCoachings = [
	{
		id: '1',
		name: 'Excel Physics Academy',
		description:
			'Premier coaching institute for JEE preparation with 15+ years of experience and top-notch faculty.',
		image: '/images/coaching/excel-physics.jpg',
		location: { city: 'Delhi', area: 'Rajouri Garden', distance: '2.5 km' },
		rating: 4.8,
		totalReviews: 324,
		subjects: ['Physics', 'Mathematics', 'Chemistry'],
		exams: ['JEE Main', 'JEE Advanced', 'BITSAT'],
		modes: ['offline', 'online'] as ('online' | 'offline')[],
		price: { from: 15000, to: 25000, period: 'month' },
		features: [
			'Small Batch Size',
			'Doubt Sessions',
			'Test Series',
			'Study Material',
		],
		established: 2008,
		totalStudents: 5000,
		successRate: 92,
		isVerified: true,
		isFeatured: true,
	},
	{
		id: '2',
		name: 'Bright Future Medical Institute',
		description:
			'Specialized NEET coaching with experienced doctors as faculty and proven track record.',
		image: '/images/coaching/bright-future.jpg',
		location: { city: 'Mumbai', area: 'Andheri West', distance: '1.8 km' },
		rating: 4.6,
		totalReviews: 256,
		subjects: ['Biology', 'Chemistry', 'Physics'],
		exams: ['NEET', 'AIIMS'],
		modes: ['offline'] as ('online' | 'offline')[],
		price: { from: 18000, period: 'month' },
		features: ['Expert Faculty', 'Regular Tests', 'Personal Mentoring'],
		established: 2012,
		totalStudents: 3500,
		successRate: 89,
		isVerified: true,
		isFeatured: false,
	},
	{
		id: '3',
		name: 'TechMaster Coding Academy',
		description:
			'Modern approach to computer science education with hands-on projects and industry experts.',
		image: '/images/coaching/techmaster.jpg',
		location: { city: 'Bangalore', area: 'Koramangala', distance: '3.2 km' },
		rating: 4.7,
		totalReviews: 189,
		subjects: ['Computer Science', 'Mathematics', 'Programming'],
		exams: ['GATE', 'Placement Tests'],
		modes: ['online', 'offline'] as ('online' | 'offline')[],
		price: { from: 12000, to: 20000, period: 'month' },
		features: ['Live Projects', 'Industry Mentors', 'Placement Assistance'],
		established: 2015,
		totalStudents: 2800,
		successRate: 94,
		isVerified: true,
		isFeatured: false,
	},
];

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
	const [loading, setLoading] = useState(false);

	// Filter and sort logic
	const filteredCoachings = useMemo(() => {
		let filtered = mockCoachings;

		// Search filter
		if (searchQuery) {
			filtered = filtered.filter(coaching =>
				coaching.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				coaching.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				coaching.subjects.some(subject =>
					subject.toLowerCase().includes(searchQuery.toLowerCase())
				)
			);
		}

		// Location filter
		if (location) {
			filtered = filtered.filter(coaching =>
				coaching.location.city.toLowerCase().includes(location.toLowerCase()) ||
				coaching.location.area.toLowerCase().includes(location.toLowerCase())
			);
		}

		// Subjects filter
		if (selectedSubjects.length > 0) {
			filtered = filtered.filter(coaching =>
				selectedSubjects.some(subject => coaching.subjects.includes(subject))
			);
		}

		// Exams filter
		if (selectedExams.length > 0) {
			filtered = filtered.filter(coaching =>
				selectedExams.some(exam => coaching.exams.includes(exam))
			);
		}

		// Modes filter
		if (selectedModes.length > 0) {
			filtered = filtered.filter(coaching =>
				selectedModes.some(mode => coaching.modes.includes(mode as 'online' | 'offline'))
			);
		}

		// Price filter
		filtered = filtered.filter(coaching =>
			coaching.price.from >= priceRange[0] && coaching.price.from <= priceRange[1]
		);

		// Sort
		switch (sortBy) {
			case 'rating':
				filtered.sort((a, b) => b.rating - a.rating);
				break;
			case 'price-low':
				filtered.sort((a, b) => a.price.from - b.price.from);
				break;
			case 'price-high':
				filtered.sort((a, b) => b.price.from - a.price.from);
				break;
			case 'newest':
				filtered.sort((a, b) => (b.established || 0) - (a.established || 0));
				break;
			default:
				// Featured first, then by rating
				filtered.sort((a, b) => {
					if (a.isFeatured && !b.isFeatured) return -1;
					if (!a.isFeatured && b.isFeatured) return 1;
					return b.rating - a.rating;
				});
		}

		return filtered;
	}, [
		searchQuery,
		location,
		selectedSubjects,
		selectedExams,
		selectedModes,
		priceRange,
		sortBy,
	]);

	const clearFilters = () => {
		setSearchQuery('');
		setLocation('');
		setSelectedSubjects([]);
		setSelectedExams([]);
		setSelectedModes([]);
		setPriceRange([0, 100000]);
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
					<div className="flex-1">
						{/* Results Header */}
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
							<div>
								<h2 className="text-2xl font-bold">
									{filteredCoachings.length} Coaching
									{filteredCoachings.length !== 1 ? 's' : ''} Found
								</h2>
								<p className="text-muted-foreground">
									{location &&
										`in ${location} ${selectedSubjects.length > 0 &&
											`for ${selectedSubjects.join(', ')}`}`}
								</p>
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
						</div>

						{/* Loading State */}
						{loading && (
							<div className="flex justify-center items-center py-16">
								<Loader2 className="h-8 w-8 animate-spin text-coaching-primary" />
							</div>
						)}

						{/* Results Grid */}
						{!loading && (
							<div
								className={
									viewMode === 'grid'
										? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
										: 'space-y-6'
								}
							>
								{filteredCoachings.map(coaching => (
									<CoachingCard key={coaching.id} {...coaching} />
								))}
							</div>
						)}

						{/* No Results */}
						{!loading && filteredCoachings.length === 0 && (
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
					</div>
				</div>
			</div>
		</div>
	);
};

export default CoachingsPage;