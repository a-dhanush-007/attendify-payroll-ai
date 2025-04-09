
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PayrollCardProps {
  period: string;
  regularHours: number;
  overtimeHours: number;
  rate: number;
  status: "pending" | "approved" | "paid";
  onExport?: () => void;
}

const PayrollCard = ({ period, regularHours, overtimeHours, rate, status, onExport }: PayrollCardProps) => {
  const totalRegularPay = regularHours * rate;
  const totalOvertimePay = overtimeHours * (rate * 1.5);
  const totalPay = totalRegularPay + totalOvertimePay;
  
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
    approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    paid: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{period}</CardTitle>
          <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", statusColors[status])}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <CardDescription>Payroll Summary</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Regular Hours</p>
            <p className="text-lg font-medium">{regularHours}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Regular Pay</p>
            <p className="text-lg font-medium">${totalRegularPay.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Overtime Hours</p>
            <p className="text-lg font-medium">{overtimeHours}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Overtime Pay</p>
            <p className="text-lg font-medium">${totalOvertimePay.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <p className="text-base font-semibold">Total Pay</p>
            <p className="text-xl font-bold">${totalPay.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          Export Payslip
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PayrollCard;
