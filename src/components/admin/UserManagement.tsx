"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Search, 
  Filter,
  Edit,
  Trash2,
  MoreHorizontal,
  Shield,
  User,
  GraduationCap,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  city?: string;
  age?: number;
  roles: Array<{ role: string }>;
  createdAt: string;
  _count?: {
    ownedCoachings?: number;
    enrolledCourses?: number;
  };
}

interface UserManagementProps {
  users: User[];
  onUpdateUser: (userId: string, data: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateRole: (userId: string, role: string) => void;
  isLoading?: boolean;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onUpdateUser,
  onDeleteUser,
  onUpdateRole,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<string | null>(null);

  // Filter users based on search and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || 
                       user.roles.some(r => r.role.toLowerCase() === roleFilter.toLowerCase());
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return <Shield className="h-4 w-4" />;
      case 'COACH':
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'COACH':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Management
        </CardTitle>
        
        {/* Search and Filter Controls */}
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="coach">Coaches</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Users List */}
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No users found
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || roleFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No users have been registered yet.'
                }
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    {/* User Info */}
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {user.name}
                          </h3>
                          <div className="flex gap-1">
                            {user.roles.map((roleObj, index) => (
                              <Badge 
                                key={index} 
                                className={`text-xs ${getRoleBadgeColor(roleObj.role)}`}
                              >
                                <span className="mr-1">{getRoleIcon(roleObj.role)}</span>
                                {roleObj.role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          {user.phoneNumber && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{user.phoneNumber}</span>
                            </div>
                          )}
                          {user.city && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{user.city}</span>
                            </div>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Joined: {formatDate(user.createdAt)}</span>
                          {user._count?.ownedCoachings !== undefined && (
                            <span>Coachings: {user._count.ownedCoachings}</span>
                          )}
                          {user._count?.enrolledCourses !== undefined && (
                            <span>Enrollments: {user._count.enrolledCourses}</span>
                          )}
                          {user.age && <span>Age: {user.age}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {/* Role Update */}
                      <Select
                        value={user.roles[0]?.role || 'STUDENT'}
                        onValueChange={(value) => onUpdateRole(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="STUDENT">Student</SelectItem>
                          <SelectItem value="COACH">Coach</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete user "${user.name}"?`)) {
                            onDeleteUser(user.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Edit Form */}
                  {editingUser === user.id && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <Input
                            defaultValue={user.name}
                            onChange={(e) => {
                              // You can implement real-time updates here
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Phone</label>
                          <Input
                            defaultValue={user.phoneNumber || ''}
                            onChange={(e) => {
                              // You can implement real-time updates here
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">City</label>
                          <Input
                            defaultValue={user.city || ''}
                            onChange={(e) => {
                              // You can implement real-time updates here
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Age</label>
                          <Input
                            type="number"
                            defaultValue={user.age || ''}
                            onChange={(e) => {
                              // You can implement real-time updates here
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => {
                          // Implement save functionality
                          setEditingUser(null);
                        }}>
                          Save Changes
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditingUser(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination could be added here */}
        {filteredUsers.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filteredUsers.length} of {users.length} users</span>
            {/* Add pagination controls here if needed */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;
