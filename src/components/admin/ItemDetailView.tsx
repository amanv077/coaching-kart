"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DetailField {
  label: string;
  key: string;
  render?: (value: any, item: any) => React.ReactNode;
  fullWidth?: boolean;
}

interface DetailSection {
  title: string;
  fields: DetailField[];
}

interface ItemDetailViewProps {
  title: string;
  item: any;
  sections: DetailSection[];
  loading: boolean;
  error: string | null;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  backHref: string;
  backLabel?: string;
}

const ItemDetailView: React.FC<ItemDetailViewProps> = ({
  title,
  item,
  sections,
  loading,
  error,
  onEdit,
  onDelete,
  backHref,
  backLabel = 'Back to List'
}) => {
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={() => router.push(backHref)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backLabel}
          </Button>
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Error Loading {title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {error || `${title} not found`}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push(backHref)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLabel}
            </Button>
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="outline"
                onClick={() => onEdit(item)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                onClick={() => onDelete(item)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Detail Sections */}
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.fields.map((field, fieldIndex) => (
                    <div
                      key={fieldIndex}
                      className={field.fullWidth ? 'md:col-span-2' : ''}
                    >
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          {field.label}
                        </label>
                        <div className="text-sm text-foreground">
                          {field.render
                            ? field.render(item[field.key], item)
                            : item[field.key] || 'Not provided'
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailView;
