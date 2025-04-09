
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/Dashboard/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, CheckCircle, AlertCircle, BarChart3, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const attendanceData = [
  { day: 'Mon', present: 42, late: 3, absent: 2 },
  { day: 'Tue', present: 45, late: 2, absent: 0 },
  { day: 'Wed', present: 40, late: 5, absent: 2 },
  { day: 'Thu', present: 44, late: 3, absent: 0 },
  { day: 'Fri', present: 38, late: 2, absent: 7 },
  { day: 'Sat', present: 30, late: 0, absent: 0 },
  { day: 'Sun', present: 15, late: 0, absent: 0 },
];

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || 'User'}! Here's an overview of your workforce data.
        </p>
      </div>
      
      <div className="dashboard-grid">
        <StatCard
          title="Total Workers"
          value="47"
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Active Today"
          value="38"
          icon={<CheckCircle className="h-5 w-5" />}
          trend={{ value: 2, isPositive: true }}
        />
        <StatCard
          title="Late Arrivals"
          value="3"
          icon={<Clock className="h-5 w-5" />}
          trend={{ value: 1, isPositive: false }}
        />
        <StatCard
          title="Pending Approvals"
          value="5"
          icon={<AlertCircle className="h-5 w-5" />}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Attendance Overview</CardTitle>
            <CardDescription>Attendance trends for the current week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={attendanceData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="present" stroke="#2596ed" strokeWidth={2} />
                  <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payroll Summary</CardTitle>
            <CardDescription>Current billing period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Regular hours</span>
                <span className="font-medium">1,560 hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overtime hours</span>
                <span className="font-medium">68 hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total amount</span>
                <span className="font-medium">$24,680.00</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <BarChart3 className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm font-medium">Overtime by Shift</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span>Morning</span>
                    <span>12 hrs</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-attendify-500 h-full rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span>Afternoon</span>
                    <span>26 hrs</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-attendify-500 h-full rounded-full" style={{ width: '38%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span>Night</span>
                    <span>30 hrs</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-attendify-500 h-full rounded-full" style={{ width: '44%' }} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
