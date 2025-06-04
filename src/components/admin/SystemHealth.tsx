"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Database, 
  Shield, 
  Bell, 
  Server,
  BarChart3,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface SystemHealthProps {
  systemStatus: {
    serverStatus: 'healthy' | 'warning' | 'error';
    databaseStatus: 'healthy' | 'warning' | 'error';
    lastBackup: string;
    activeUsers: number;
    systemLoad: number;
    storageUsed: number;
  };
}

const SystemHealth: React.FC<SystemHealthProps> = ({ systemStatus }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Server className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const systemMetrics = [
    {
      title: 'Server Status',
      status: systemStatus.serverStatus,
      description: systemStatus.serverStatus === 'healthy' 
        ? 'All systems operational' 
        : 'Server experiencing issues',
      icon: Server
    },
    {
      title: 'Database',
      status: systemStatus.databaseStatus,
      description: systemStatus.databaseStatus === 'healthy'
        ? 'Database responding normally'
        : 'Database performance issues',
      icon: Database
    },
    {
      title: 'Last Backup',
      status: 'healthy',
      description: `Completed: ${formatDate(systemStatus.lastBackup)}`,
      icon: Shield
    }
  ];

  const quickActions = [
    {
      title: 'User Analytics',
      description: 'View detailed user statistics and behavior',
      icon: BarChart3,
      action: '/admin/analytics'
    },
    {
      title: 'System Logs',
      description: 'Review system activity and error logs',
      icon: FileText,
      action: '/admin/logs'
    },
    {
      title: 'User Reports',
      description: 'Generate and export user reports',
      icon: Users,
      action: '/admin/reports'
    },
    {
      title: 'Notifications',
      description: 'Manage system notifications and alerts',
      icon: Bell,
      action: '/admin/notifications'
    },
    {
      title: 'Platform Settings',
      description: 'Configure platform-wide settings',
      icon: Settings,
      action: '/admin/settings'
    },
    {
      title: 'Security Center',
      description: 'Manage security settings and permissions',
      icon: Shield,
      action: '/admin/security'
    }
  ];

  return (
    <div className="space-y-6">
      {/* System Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {systemMetrics.map((metric, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${getStatusColor(metric.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{metric.title}</h3>
                  {getStatusIcon(metric.status)}
                </div>
                <p className="text-sm">{metric.description}</p>
              </div>
            ))}
          </div>

          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-foreground mb-1">Active Users</h4>
              <p className="text-2xl font-bold text-foreground">{systemStatus.activeUsers}</p>
              <p className="text-xs text-muted-foreground">Currently online</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-foreground mb-1">System Load</h4>
              <p className="text-2xl font-bold text-foreground">{systemStatus.systemLoad}%</p>
              <p className="text-xs text-muted-foreground">CPU usage</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-foreground mb-1">Storage Used</h4>
              <p className="text-2xl font-bold text-foreground">{systemStatus.storageUsed}%</p>
              <p className="text-xs text-muted-foreground">Disk space</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Tools & Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <action.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealth;
