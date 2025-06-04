"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface DetailPageTemplateProps {
  title: string;
  data: any[];
  columns: Column[];
  loading: boolean;
  error: string | null;
  onView?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  searchable?: boolean;
  backHref?: string;
}

const DetailPageTemplate: React.FC<DetailPageTemplateProps> = ({
  title,
  data,
  columns,
  loading,
  error,
  onView,
  onEdit,
  onDelete,
  searchable = true,
  backHref = '/admin-dashboard'
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data based on search term
  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="outline"
            onClick={() => router.push(backHref)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Error Loading {title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push(backHref)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">{title}</h1>
            <Badge variant="secondary">{filteredData.length} items</Badge>
          </div>
        </div>

        {/* Search */}
        {searchable && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Data Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/20">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className="text-left p-4 font-medium text-muted-foreground"
                      >
                        {column.label}
                      </th>
                    ))}
                    {(onView || onEdit || onDelete) && (
                      <th className="text-left p-4 font-medium text-muted-foreground">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length + 1}
                        className="p-8 text-center text-muted-foreground"
                      >
                        No {title.toLowerCase()} found
                        {searchTerm && ` matching "${searchTerm}"`}
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-muted/10 transition-colors">
                        {columns.map((column) => (
                          <td key={column.key} className="p-4">
                            {column.render
                              ? column.render(item[column.key], item)
                              : item[column.key]
                            }
                          </td>
                        ))}
                        {(onView || onEdit || onDelete) && (
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {onView && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onView(item)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                              {onEdit && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onEdit(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              {onDelete && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onDelete(item)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetailPageTemplate;
