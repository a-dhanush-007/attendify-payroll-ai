
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CheckInForm from '@/components/Attendance/CheckInForm';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, CheckCircle, Search, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockAttendanceRecords = [
  {
    id: '1',
    date: '2023-04-08',
    employeeId: '1001',
    name: 'John Smith',
    checkIn: '08:03 AM',
    checkOut: '04:12 PM',
    shift: 'morning',
    status: 'present',
    hours: 8.15,
  },
  {
    id: '2',
    date: '2023-04-08',
    employeeId: '1002',
    name: 'Jane Doe',
    checkIn: '08:15 AM',
    checkOut: '04:05 PM',
    shift: 'morning',
    status: 'late',
    hours: 7.83,
  },
  {
    id: '3',
    date: '2023-04-08',
    employeeId: '1003',
    name: 'Robert Johnson',
    checkIn: '07:55 AM',
    checkOut: '04:30 PM',
    shift: 'morning',
    status: 'present',
    hours: 8.58,
  },
  {
    id: '4',
    date: '2023-04-08',
    employeeId: '1004',
    name: 'Lisa Chen',
    checkIn: '04:02 PM',
    checkOut: '12:10 AM',
    shift: 'afternoon',
    status: 'present',
    hours: 8.13,
  },
  {
    id: '5',
    date: '2023-04-08',
    employeeId: '1005',
    name: 'Michael Brown',
    checkIn: '12:05 AM',
    checkOut: '08:15 AM',
    shift: 'night',
    status: 'present',
    hours: 8.17,
  },
];

const Attendance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterShift, setFilterShift] = useState('all');
  const { toast } = useToast();
  
  const filteredRecords = mockAttendanceRecords.filter(record => {
    const matchesSearch = 
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.name.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesShift = filterShift === 'all' || record.shift === filterShift;
    
    return matchesSearch && matchesStatus && matchesShift;
  });
  
  const handleExport = () => {
    toast({
      title: "Export initiated",
      description: "Your attendance report is being generated.",
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'absent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground">
          Manage employee attendance records and shifts
        </p>
      </div>
      
      <Tabs defaultValue="records" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
          <TabsTrigger value="records">Attendance Records</TabsTrigger>
          <TabsTrigger value="check-in">Check In/Out</TabsTrigger>
        </TabsList>
        
        <TabsContent value="records" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance</CardTitle>
              <CardDescription>View and manage attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name or ID" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="flex-1"
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterShift} onValueChange={setFilterShift}>
                  <SelectTrigger id="shift">
                    <SelectValue placeholder="Filter by shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Shifts</SelectItem>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Employee</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Shift</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Time In</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Time Out</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Hours</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredRecords.map(record => (
                        <tr key={record.id} className="hover:bg-muted/50">
                          <td className="p-3 text-sm">{record.date}</td>
                          <td className="p-3 text-sm">
                            <div>
                              <div className="font-medium">{record.name}</div>
                              <div className="text-xs text-muted-foreground">ID: {record.employeeId}</div>
                            </div>
                          </td>
                          <td className="p-3 text-sm capitalize">{record.shift}</td>
                          <td className="p-3 text-sm">{record.checkIn}</td>
                          <td className="p-3 text-sm">{record.checkOut}</td>
                          <td className="p-3 text-sm">{record.hours.toFixed(2)}</td>
                          <td className="p-3 text-sm">
                            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium capitalize", getStatusColor(record.status))}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredRecords.length} of {mockAttendanceRecords.length} records
                </div>
                <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="check-in">
          <div className="grid gap-6 md:grid-cols-2">
            <CheckInForm />
            
            <Card>
              <CardHeader>
                <CardTitle>Check-Out Form</CardTitle>
                <CardDescription>Record your shift completion</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="employeeIdOut" className="text-sm font-medium">
                      Employee ID
                    </label>
                    <Input
                      id="employeeIdOut"
                      placeholder="Enter employee ID"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">
                      Notes (Optional)
                    </label>
                    <Input
                      id="notes"
                      placeholder="Any additional information"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-attendify-600 hover:bg-attendify-700"
                  >
                    Check Out
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;
