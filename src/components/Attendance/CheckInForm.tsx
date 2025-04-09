
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const CheckInForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [employeeId, setEmployeeId] = useState(user?.id || '');
  const [shift, setShift] = useState<string>('morning');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Insert attendance record into Supabase
      const { data, error } = await supabase
        .from('attendance')
        .insert({
          user_id: employeeId,
          shift,
          status: 'present', // Default status
          notes: notes.trim() || null
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Check-in recorded",
        description: `Employee #${employeeId} checked in for the ${shift} shift.`,
      });
      
      // Clear form
      setNotes('');
    } catch (error) {
      console.error('Error recording check-in:', error);
      toast({
        title: "Check-in failed",
        description: "There was an error recording your check-in.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Check-In</CardTitle>
        <CardDescription>Record your attendance for today's shift</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="employeeId" className="text-sm font-medium">
              Employee ID
            </label>
            <Input
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter employee ID"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="shift" className="text-sm font-medium">
              Shift
            </label>
            <Select value={shift} onValueChange={setShift}>
              <SelectTrigger id="shift">
                <SelectValue placeholder="Select shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning Shift (8AM - 4PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon Shift (4PM - 12AM)</SelectItem>
                <SelectItem value="night">Night Shift (12AM - 8AM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes (Optional)
            </label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-attendify-600 hover:bg-attendify-700" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Check In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CheckInForm;
