import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, ChevronRight, Star, Target, Clock, X } from 'lucide-react';
import Link from 'next/link';

interface ProfileCompletionPromptProps {
  onDismiss?: () => void;
  className?: string;
}

export function ProfileCompletionPrompt({ onDismiss, className }: ProfileCompletionPromptProps) {
  return (
    <Card className={`border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <User className="h-5 w-5" />
            Complete Your Profile
          </CardTitle>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0 text-orange-600 hover:text-orange-800"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-orange-200 bg-orange-50">
          <Star className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Complete your profile to get personalized coaching recommendations and unlock premium features!
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <h4 className="font-semibold text-orange-900">What you'll get:</h4>
          <ul className="space-y-1 text-sm text-orange-700">
            <li className="flex items-center gap-2">
              <Target className="h-3 w-3" />
              Personalized coaching matches based on your preferences
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Priority access to demo sessions and courses
            </li>
            <li className="flex items-center gap-2">
              <Star className="h-3 w-3" />
              Enhanced dashboard with tailored recommendations
            </li>
          </ul>
        </div>

        <div className="flex gap-2 pt-2">
          <Button asChild className="flex-1 bg-orange-600 hover:bg-orange-700">
            <Link href="/complete-profile" className="flex items-center justify-center gap-2">
              Complete Profile
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
          {onDismiss && (
            <Button variant="outline" onClick={onDismiss} className="text-orange-600 border-orange-200">
              Later
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
