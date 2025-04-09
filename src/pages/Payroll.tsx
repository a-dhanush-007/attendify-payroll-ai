
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PayrollCard from '@/components/Payroll/PayrollCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Download, Printer, Calendar, DollarSign, Search } from 'lucide-react';

const mockPayrollPeriods = [
  {
    id: "1",
    period: "April 1-15, 2023",
    regularHours: 72,
    overtimeHours: 5.5,
    rate: 25,
    status: "paid" as const,
  },
  {
    id: "2",
    period: "March 16-31, 2023",
    regularHours: 80,
    overtimeHours: 2,
    rate: 25,
    status: "paid" as const,
  },
  {
    id: "3",
    period: "March 1-15, 2023",
    regularHours: 76,
    overtimeHours: 0,
    rate: 25,
    status: "paid" as const,
  },
  {
    id: "4",
    period: "February 16-28, 2023",
    regularHours: 80,
    overtimeHours: 8,
    rate: 25,
    status: "paid" as const,
  },
];

const mockPayrollReports = [
  {
    id: "1",
    name: "March 2023 Monthly Report",
    date: "April 2, 2023",
    type: "Monthly",
    totalAmount: 12480.25,
  },
  {
    id: "2",
    name: "Q1 2023 Quarterly Report",
    date: "April 5, 2023",
    type: "Quarterly",
    totalAmount: 36250.75,
  },
  {
    id: "3",
    name: "February 2023 Monthly Report",
    date: "March 3, 2023",
    type: "Monthly",
    totalAmount: 11780.50,
  },
];

const Payroll = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const handleExport = () => {
    toast({
      title: "Export initiated",
      description: "Your payroll report is being generated.",
    });
  };
  
  const handleDownloadReport = (reportName: string) => {
    toast({
      title: "Report download",
      description: `Downloading ${reportName}...`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
        <p className="text-muted-foreground">
          Manage employee compensation and payroll reporting
        </p>
      </div>
      
      <Tabs defaultValue="periods" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
          <TabsTrigger value="periods">Pay Periods</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="periods">
          <div className="grid gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Recent Pay Periods</CardTitle>
                  <CardDescription>View and export pay period information</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  className="h-8 gap-1" 
                  onClick={handleExport}
                >
                  <Download className="h-3 w-3" />
                  <span>Export All</span>
                </Button>
              </CardHeader>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockPayrollPeriods.map((period) => (
                <PayrollCard
                  key={period.id}
                  period={period.period}
                  regularHours={period.regularHours}
                  overtimeHours={period.overtimeHours}
                  rate={period.rate}
                  status={period.status}
                  onExport={() => handleDownloadReport(`Payslip - ${period.period}`)}
                />
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Reports</CardTitle>
              <CardDescription>Access and download payroll reports and summaries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search reports" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="flex-1"
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Report Name</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Date Generated</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Type</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {mockPayrollReports.map(report => (
                      <tr key={report.id} className="hover:bg-muted/50">
                        <td className="p-3 text-sm font-medium">{report.name}</td>
                        <td className="p-3 text-sm">{report.date}</td>
                        <td className="p-3 text-sm">{report.type}</td>
                        <td className="p-3 text-sm">${report.totalAmount.toFixed(2)}</td>
                        <td className="p-3 text-sm">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadReport(report.name)}
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span className="sr-only">Download</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              <Printer className="h-3.5 w-3.5" />
                              <span className="sr-only">Print</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payroll;
