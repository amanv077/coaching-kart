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
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'Economics'];
  const exams = ['JEE Main', 'JEE Advanced', 'NEET', 'GATE', 'CAT', 'UPSC', 'SSC', 'Banking'];
  const quickFilters = ['Top Rated', 'Near Me', 'Affordable', 'Online Available', 'Test Series'];

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
    <div className="w-full max-w-6xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Main Search Bar */}
      <div className="bg-card/95 backdrop-blur-lg rounded-2xl border border-border shadow-lg p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search coaching institutes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base bg-background/50 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 hover:border-border/80"
            />
          </div>

          {/* Location Input */}
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Enter city or area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-12 h-12 text-base bg-background/50 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 hover:border-border/80"
            />
          </div>
        </div>

        {/* Quick Mode Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={selectedModes.includes("online") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleMode("online")}
            className={`h-10 px-4 rounded-xl font-medium transition-all duration-200 ${
              selectedModes.includes("online")
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                : "bg-background border-border hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <Wifi size={16} className="mr-2" />
            Online
          </Button>
          <Button
            variant={selectedModes.includes("offline") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleMode("offline")}
            className={`h-10 px-4 rounded-xl font-medium transition-all duration-200 ${
              selectedModes.includes("offline")
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                : "bg-background border-border hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {" "}
            <WifiOff size={16} className="mr-2" />
            Offline
          </Button>
        </div>

        {/* Quick Filters and Advanced Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Quick filters:</span>
            {quickFilters.map((filter) => (
              <Button
                key={filter}
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (selectedFilters.includes(filter)) {
                    setSelectedFilters((prev) =>
                      prev.filter((f) => f !== filter)
                    );
                  } else {
                    setSelectedFilters((prev) => [...prev, filter]);
                  }
                }}
                className={`h-8 px-3 rounded-lg text-xs transition-all duration-200 ${
                  selectedFilters.includes(filter)
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                }`}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="h-10 px-4 rounded-xl font-medium bg-background border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200"
        >
          <Filter size={16} className="mr-2" />
          <span className="hidden sm:inline">Advanced Filters</span>
          <span className="sm:hidden">Filters</span>
          {totalActiveFilters > 0 && (
            <span className="ml-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-semibold">
              {totalActiveFilters}
            </span>
          )}
          <ChevronDown
            size={16}
            className={`ml-2 transition-transform duration-200 ${
              showAdvancedFilters ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>
      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-card/95 backdrop-blur-lg rounded-2xl border border-border shadow-lg p-4 sm:p-6 space-y-6 animate-in slide-in-from-top duration-300">
          {/* Subject Search */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              Subjects
            </h3>
            <div className="flex gap-3">
              <Input
                placeholder="Type subject name..."
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && addSubject(subjectInput)
                }
                className="flex-1 h-10 bg-background/50 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
              <Button
                size="sm"
                onClick={() => addSubject(subjectInput)}
                disabled={!subjectInput}
                className="h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </Button>
            </div>
            {/* Subject Suggestions */}
            <div className="flex flex-wrap gap-2">
              {subjects
                .filter(
                  (s) =>
                    !selectedSubjects.includes(s) &&
                    s.toLowerCase().includes(subjectInput.toLowerCase())
                )
                .slice(0, 5)
                .map((subject) => (
                  <Button
                    key={subject}
                    variant="outline"
                    size="sm"
                    onClick={() => addSubject(subject)}
                    className="h-8 px-3 text-xs rounded-lg bg-background border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                  >
                    + {subject}
                  </Button>
                ))}
            </div>

            {/* Selected Subjects */}
            {selectedSubjects.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedSubjects.map((subject) => (
                  <div
                    key={subject}
                    className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg"
                  >
                    {subject}
                    <X
                      size={14}
                      className="cursor-pointer hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
                      onClick={() => removeFilter(subject, "subject")}
                    />
                  </div>
                ))}{" "}
              </div>
            )}
          </div>

          {/* Exam Search */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              Competitive Exams
            </h3>
            <div className="flex gap-3">
              <Input
                placeholder="Type exam name..."
                value={examInput}
                onChange={(e) => setExamInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addExam(examInput)}
                className="flex-1 h-10 bg-background/50 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
              <Button
                size="sm"
                onClick={() => addExam(examInput)}
                disabled={!examInput}
                className="h-10 px-6 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </Button>
            </div>

            {/* Exam Suggestions */}
            <div className="flex flex-wrap gap-2">
              {exams
                .filter(
                  (e) =>
                    !selectedExams.includes(e) &&
                    e.toLowerCase().includes(examInput.toLowerCase())
                )
                .slice(0, 5)
                .map((exam) => (
                  <Button
                    key={exam}
                    variant="outline"
                    size="sm"
                    onClick={() => addExam(exam)}
                    className="h-8 px-3 text-xs rounded-lg bg-background border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                  >
                    + {exam}
                  </Button>
                ))}
            </div>

            {/* Selected Exams */}
            {selectedExams.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedExams.map((exam) => (
                  <div
                    key={exam}
                    className="bg-secondary text-secondary-foreground px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg"
                  >
                    {exam}
                    <X
                      size={14}
                      className="cursor-pointer hover:bg-secondary-foreground/20 rounded-full p-0.5 transition-colors"
                      onClick={() => removeFilter(exam, "exam")}
                    />
                  </div>
                ))}{" "}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              Monthly Fee Range
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Min ₹"
                  value={priceRange[0] || ""}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value) || 0, priceRange[1]])
                  }
                  className="h-10 bg-background/50 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
              </div>
              <span className="text-muted-foreground font-medium">to</span>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Max ₹"
                  value={priceRange[1] === 100000 ? "" : priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([
                      priceRange[0],
                      Number(e.target.value) || 100000,
                    ])
                  }
                  className="h-10 bg-background/50 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
              </div>
            </div>

            {/* Quick Price Options */}
            <div className="flex flex-wrap gap-2">
              {[
                {
                  label: "Under ₹5K",
                  max: 5000,
                },
                {
                  label: "Under ₹10K",
                  max: 10000,
                },
                {
                  label: "Under ₹20K",
                  max: 20000,
                },
                {
                  label: "Under ₹50K",
                  max: 50000,
                },
              ].map(({ label, max }) => (
                <Button
                  key={max}
                  variant="outline"
                  size="sm"
                  onClick={() => setPriceRange([0, max])}
                  className="h-8 px-3 text-xs rounded-lg bg-background border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Clear All Filters */}
          {hasActiveFilters && (
            <div className="pt-6 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="w-full h-11 bg-background border-destructive/50 hover:bg-destructive hover:text-destructive-foreground rounded-xl font-medium transition-all duration-200"
              >
                {" "}
                <X size={16} className="mr-2" />
                Clear All Filters ({totalActiveFilters})
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="bg-muted/50 rounded-2xl border border-border p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-semibold text-foreground">
              Active filters:
            </span>

            {location && (
              <div className="bg-card border border-border px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
                <MapPin size={14} className="text-primary" />
                {location}
                <X
                  size={14}
                  className="cursor-pointer text-muted-foreground hover:text-destructive transition-colors"
                  onClick={() => setLocation("")}
                />
              </div>
            )}

            {selectedModes.map((mode) => (
              <div
                key={mode}
                className="bg-card border border-border px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 capitalize shadow-sm hover:shadow-md transition-shadow"
              >
                {mode === "online" ? (
                  <Wifi size={14} className="text-primary" />
                ) : (
                  <WifiOff size={14} className="text-secondary" />
                )}
                {mode}
                <X
                  size={14}
                  className="cursor-pointer text-muted-foreground hover:text-destructive transition-colors"
                  onClick={() => removeFilter(mode, "mode")}
                />
              </div>
            ))}

            {(priceRange[0] > 0 || priceRange[1] < 100000) && (
              <div className="bg-card border border-border px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-accent-foreground">
                  ₹{priceRange[0].toLocaleString()} - ₹
                  {priceRange[1].toLocaleString()}
                </span>
                <X
                  size={14}
                  className="cursor-pointer text-muted-foreground hover:text-destructive transition-colors"
                  onClick={() => setPriceRange([0, 100000])}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachingFilters;