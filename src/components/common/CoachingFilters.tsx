import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Filter, X, ChevronDown, Wifi, WifiOff } from 'lucide-react';

interface FilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  location: string;
  setLocation: (location: string) => void;
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
  selectedExams: string[];
  setSelectedExams: (exams: string[]) => void;
  selectedModes: string[];
  setSelectedModes: (modes: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

const CoachingFilters = ({
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
  selectedSubjects,
  setSelectedSubjects,
  selectedExams,
  setSelectedExams,
  selectedModes,
  setSelectedModes,
  priceRange,
  setPriceRange,
  onClearFilters
}: FilterProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [subjectInput, setSubjectInput] = useState('');
  const [examInput, setExamInput] = useState('');

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'Economics'];
  const exams = ['JEE Main', 'JEE Advanced', 'NEET', 'GATE', 'CAT', 'UPSC', 'SSC', 'Banking'];

  const addSubject = (subject: string) => {
    if (subject && !selectedSubjects.includes(subject)) {
      setSelectedSubjects([...selectedSubjects, subject]);
      setSubjectInput('');
    }
  };

  const addExam = (exam: string) => {
    if (exam && !selectedExams.includes(exam)) {
      setSelectedExams([...selectedExams, exam]);
      setExamInput('');
    }
  };

  const removeFilter = (value: string, type: 'subject' | 'exam' | 'mode') => {
    switch (type) {
      case 'subject':
        setSelectedSubjects(selectedSubjects.filter(s => s !== value));
        break;
      case 'exam':
        setSelectedExams(selectedExams.filter(e => e !== value));
        break;
      case 'mode':
        setSelectedModes(selectedModes.filter(m => m !== value));
        break;
    }
  };

  const toggleMode = (mode: string) => {
    if (selectedModes.includes(mode)) {
      setSelectedModes(selectedModes.filter(m => m !== mode));
    } else {
      setSelectedModes([...selectedModes, mode]);
    }
  };

  const hasActiveFilters = selectedSubjects.length > 0 || selectedExams.length > 0 || 
    selectedModes.length > 0 || location || priceRange[0] > 0 || priceRange[1] < 100000;

  const totalActiveFilters = selectedSubjects.length + selectedExams.length + selectedModes.length + 
    (location ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 100000 ? 1 : 0);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Search Bar */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-xl shadow-gray-100/50 p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
            <Input
              placeholder="Search coaching institutes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base bg-gray-50/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
            />
          </div>
          
          {/* Location Input */}
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
            <Input
              placeholder="Enter city or area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-12 h-12 text-base bg-gray-50/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
            />
          </div>
        </div>

        {/* Quick Mode Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={selectedModes.includes('online') ? "default" : "outline"}
            size="sm"
            onClick={() => toggleMode('online')}
            className={`h-10 px-4 rounded-xl font-medium transition-all duration-200 ${
              selectedModes.includes('online')
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25'
                : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700'
            }`}
          >
            <Wifi size={16} className="mr-2" />
            Online
          </Button>
          <Button
            variant={selectedModes.includes('offline') ? "default" : "outline"}
            size="sm"
            onClick={() => toggleMode('offline')}
            className={`h-10 px-4 rounded-xl font-medium transition-all duration-200 ${
              selectedModes.includes('offline')
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25'
                : 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-700 hover:text-green-700'
            }`}
          >
            <WifiOff size={16} className="mr-2" />
            Offline
          </Button>
          
          {/* Advanced Filters Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="h-10 px-4 rounded-xl font-medium ml-auto bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-all duration-200"
          >
            <Filter size={16} className="mr-2" />
            Advanced Filters {totalActiveFilters > 0 && (
              <span className="ml-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                {totalActiveFilters}
              </span>
            )}
            <ChevronDown size={16} className={`ml-2 transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-xl shadow-gray-100/50 p-6 space-y-6 animate-in slide-in-from-top duration-300">
          {/* Subject Search */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Subjects
            </h3>
            <div className="flex gap-3">
              <Input
                placeholder="Type subject name..."
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSubject(subjectInput)}
                className="flex-1 h-10 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
              <Button 
                size="sm" 
                onClick={() => addSubject(subjectInput)}
                disabled={!subjectInput}
                className="h-10 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl font-medium shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </Button>
            </div>
            
            {/* Subject Suggestions */}
            <div className="flex flex-wrap gap-2">
              {subjects.filter(s => !selectedSubjects.includes(s) && 
                s.toLowerCase().includes(subjectInput.toLowerCase())).slice(0, 5).map(subject => (
                <Button
                  key={subject}
                  variant="outline"
                  size="sm"
                  onClick={() => addSubject(subject)}
                  className="h-8 px-3 text-xs rounded-lg bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-600 hover:text-blue-700 transition-all duration-200"
                >
                  + {subject}
                </Button>
              ))}
            </div>

            {/* Selected Subjects */}
            {selectedSubjects.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedSubjects.map(subject => (
                  <div key={subject} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-500/25">
                    {subject}
                    <X 
                      size={14} 
                      className="cursor-pointer hover:bg-white/20 rounded-full p-0.5 transition-colors" 
                      onClick={() => removeFilter(subject, 'subject')} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exam Search */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Competitive Exams
            </h3>
            <div className="flex gap-3">
              <Input
                placeholder="Type exam name..."
                value={examInput}
                onChange={(e) => setExamInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addExam(examInput)}
                className="flex-1 h-10 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
              />
              <Button 
                size="sm" 
                onClick={() => addExam(examInput)}
                disabled={!examInput}
                className="h-10 px-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-xl font-medium shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </Button>
            </div>

            {/* Exam Suggestions */}
            <div className="flex flex-wrap gap-2">
              {exams.filter(e => !selectedExams.includes(e) && 
                e.toLowerCase().includes(examInput.toLowerCase())).slice(0, 5).map(exam => (
                <Button
                  key={exam}
                  variant="outline"
                  size="sm"
                  onClick={() => addExam(exam)}
                  className="h-8 px-3 text-xs rounded-lg bg-white border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-600 hover:text-orange-700 transition-all duration-200"
                >
                  + {exam}
                </Button>
              ))}
            </div>

            {/* Selected Exams */}
            {selectedExams.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedExams.map(exam => (
                  <div key={exam} className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-orange-500/25">
                    {exam}
                    <X 
                      size={14} 
                      className="cursor-pointer hover:bg-white/20 rounded-full p-0.5 transition-colors" 
                      onClick={() => removeFilter(exam, 'exam')} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Monthly Fee Range
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Min ₹"
                  value={priceRange[0] || ''}
                  onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                  className="h-10 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <span className="text-gray-400 font-medium">to</span>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Max ₹"
                  value={priceRange[1] === 100000 ? '' : priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 100000])}
                  className="h-10 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                />
              </div>
            </div>
            
            {/* Quick Price Options */}
            <div className="flex flex-wrap gap-2">
              {[
                {
                  label: 'Under ₹5K',
                  max: 5000
                },
                {
                  label: 'Under ₹10K',
                  max: 10000
                },
                {
                  label: 'Under ₹20K',
                  max: 20000
                },
                {
                  label: 'Under ₹50K',
                  max: 50000
                }
              ].map(({ label, max }) => (
                <Button
                  key={max}
                  variant="outline"
                  size="sm"
                  onClick={() => setPriceRange([0, max])}
                  className="h-8 px-3 text-xs rounded-lg bg-white border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-600 hover:text-green-700 transition-all duration-200"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Clear All Filters */}
          {hasActiveFilters && (
            <div className="pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="w-full h-11 bg-white border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-xl font-medium transition-all duration-200"
              >
                <X size={16} className="mr-2" />
                Clear All Filters ({totalActiveFilters})
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl border border-gray-200/50 p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-semibold text-gray-700">Active filters:</span>
            
            {location && (
              <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
                <MapPin size={14} className="text-blue-500" />
                {location}
                <X size={14} className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors" onClick={() => setLocation('')} />
              </div>
            )}

            {selectedModes.map(mode => (
              <div key={mode} className="bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 capitalize shadow-sm hover:shadow-md transition-shadow">
                {mode === 'online' ? <Wifi size={14} className="text-blue-500" /> : <WifiOff size={14} className="text-green-500" />}
                {mode}
                <X size={14} className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors" onClick={() => removeFilter(mode, 'mode')} />
              </div>
            ))}

            {(priceRange[0] > 0 || priceRange[1] < 100000) && (
              <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-green-600">₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}</span>
                <X size={14} className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors" onClick={() => setPriceRange([0, 100000])} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachingFilters;