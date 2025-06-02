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
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="bg-card rounded-xl border p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coaching institutes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          
          {/* Location Input */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter city or area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </div>

        {/* Quick Mode Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedModes.includes('online') ? "default" : "outline"}
            size="sm"
            onClick={() => toggleMode('online')}
            className="h-8"
          >
            <Wifi size={14} className="mr-1" />
            Online
          </Button>
          <Button
            variant={selectedModes.includes('offline') ? "default" : "outline"}
            size="sm"
            onClick={() => toggleMode('offline')}
            className="h-8"
          >
            <WifiOff size={14} className="mr-1" />
            Offline
          </Button>
          
          {/* Advanced Filters Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="h-8 ml-auto"
          >
            <Filter size={14} className="mr-1" />
            Filters {totalActiveFilters > 0 && `(${totalActiveFilters})`}
            <ChevronDown size={14} className={`ml-1 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-card rounded-xl border p-4 space-y-4">
          {/* Subject Search */}
          <div>
            <label className="block text-sm font-medium mb-2">Add Subjects</label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Type subject name..."
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSubject(subjectInput)}
                className="h-9"
              />
              <Button 
                size="sm" 
                onClick={() => addSubject(subjectInput)}
                disabled={!subjectInput}
                className="h-9"
              >
                Add
              </Button>
            </div>
            
            {/* Subject Suggestions */}
            <div className="flex flex-wrap gap-1 mb-2">
              {subjects.filter(s => !selectedSubjects.includes(s) && 
                s.toLowerCase().includes(subjectInput.toLowerCase())).slice(0, 5).map(subject => (
                <Button
                  key={subject}
                  variant="outline"
                  size="sm"
                  onClick={() => addSubject(subject)}
                  className="h-7 text-xs"
                >
                  {subject}
                </Button>
              ))}
            </div>

            {/* Selected Subjects */}
            {selectedSubjects.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedSubjects.map(subject => (
                  <div key={subject} className="bg-coaching-primary text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    {subject}
                    <X 
                      size={12} 
                      className="cursor-pointer hover:bg-white/20 rounded" 
                      onClick={() => removeFilter(subject, 'subject')} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exam Search */}
          <div>
            <label className="block text-sm font-medium mb-2">Add Exams</label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Type exam name..."
                value={examInput}
                onChange={(e) => setExamInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addExam(examInput)}
                className="h-9"
              />
              <Button 
                size="sm" 
                onClick={() => addExam(examInput)}
                disabled={!examInput}
                className="h-9"
              >
                Add
              </Button>
            </div>

            {/* Exam Suggestions */}
            <div className="flex flex-wrap gap-1 mb-2">
              {exams.filter(e => !selectedExams.includes(e) && 
                e.toLowerCase().includes(examInput.toLowerCase())).slice(0, 5).map(exam => (
                <Button
                  key={exam}
                  variant="outline"
                  size="sm"
                  onClick={() => addExam(exam)}
                  className="h-7 text-xs"
                >
                  {exam}
                </Button>
              ))}
            </div>

            {/* Selected Exams */}
            {selectedExams.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedExams.map(exam => (
                  <div key={exam} className="bg-coaching-accent text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    {exam}
                    <X 
                      size={12} 
                      className="cursor-pointer hover:bg-white/20 rounded" 
                      onClick={() => removeFilter(exam, 'exam')} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium mb-2">Monthly Fee Range</label>
            <div className="flex items-center gap-2 mb-2">
              <Input
                type="number"
                placeholder="Min ₹"
                value={priceRange[0] || ''}
                onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                className="h-9"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="number"
                placeholder="Max ₹"
                value={priceRange[1] === 100000 ? '' : priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 100000])}
                className="h-9"
              />
            </div>
            
            {/* Quick Price Options */}
            <div className="flex flex-wrap gap-1">
              {[
                { label: 'Under ₹5K', max: 5000 },
                { label: 'Under ₹10K', max: 10000 },
                { label: 'Under ₹20K', max: 20000 },
                { label: 'Under ₹50K', max: 50000 }
              ].map(({ label, max }) => (
                <Button
                  key={max}
                  variant="outline"
                  size="sm"
                  onClick={() => setPriceRange([0, max])}
                  className="h-7 text-xs"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Clear All Filters */}
          {hasActiveFilters && (
            <div className="pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="w-full h-9"
              >
                <X size={14} className="mr-1" />
                Clear All Filters ({totalActiveFilters})
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium">Active filters:</span>
            
            {location && (
              <div className="bg-background border px-2 py-1 rounded text-xs flex items-center gap-1">
                <MapPin size={12} />
                {location}
                <X size={12} className="cursor-pointer" onClick={() => setLocation('')} />
              </div>
            )}

            {selectedModes.map(mode => (
              <div key={mode} className="bg-background border px-2 py-1 rounded text-xs flex items-center gap-1 capitalize">
                {mode === 'online' ? <Wifi size={12} /> : <WifiOff size={12} />}
                {mode}
                <X size={12} className="cursor-pointer" onClick={() => removeFilter(mode, 'mode')} />
              </div>
            ))}

            {(priceRange[0] > 0 || priceRange[1] < 100000) && (
              <div className="bg-background border px-2 py-1 rounded text-xs flex items-center gap-1">
                ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                <X size={12} className="cursor-pointer" onClick={() => setPriceRange([0, 100000])} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachingFilters;