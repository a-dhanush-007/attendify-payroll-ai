
import React from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  name: string | null;
  email: string;
  role: string;
  created_at: string;
}

interface WorkersListProps {
  workers: Profile[];
}

const WorkersList: React.FC<WorkersListProps> = ({ workers }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'supervisor':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-green-100 text-green-800 hover:bg-green-200';
    }
  };

  const handleViewAttendance = (workerId: string, name: string) => {
    toast({
      title: "Feature coming soon",
      description: `Viewing attendance for ${name} will be available in the next update.`
    });
  };

  const handleViewPayroll = (workerId: string, name: string) => {
    toast({
      title: "Feature coming soon",
      description: `Viewing payroll for ${name} will be available in the next update.`
    });
  };

  const handleEditWorker = (id: string) => {
    toast({
      title: "Feature coming soon",
      description: "Worker editing functionality will be added in the next update."
    });
  };

  const handleDeleteWorker = (id: string, name: string) => {
    toast({
      title: "Feature coming soon",
      description: `Deleting ${name || 'worker'} will be available in the next update.`
    });
  };

  if (workers.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No workers found. Add workers to manage them here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {workers.map((worker) => (
        <Card key={worker.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Avatar className="h-10 w-10 mb-2">
                <AvatarFallback className="bg-attendify-100 text-attendify-800">
                  {getInitials(worker.name)}
                </AvatarFallback>
              </Avatar>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditWorker(worker.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteWorker(worker.id, worker.name || '')}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardTitle>{worker.name || 'Unknown'}</CardTitle>
            <CardDescription className="truncate">{worker.email}</CardDescription>
            <Badge className={`mt-1 font-normal capitalize ${getRoleColor(worker.role)}`}>
              {worker.role}
            </Badge>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground">
              Member since {new Date(worker.created_at).toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter className="pt-1 flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 h-8"
              onClick={() => handleViewAttendance(worker.id, worker.name || 'Worker')}
            >
              <Clock className="h-3.5 w-3.5 mr-1" />
              Attendance
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-8"
              onClick={() => handleViewPayroll(worker.id, worker.name || 'Worker')}
            >
              <DollarSign className="h-3.5 w-3.5 mr-1" />
              Payroll
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default WorkersList;
