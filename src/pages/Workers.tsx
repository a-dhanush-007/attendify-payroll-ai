
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { UserPlus, Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import WorkersList from '@/components/Workers/WorkersList';
import WorkerForm from '@/components/Workers/WorkerForm';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';

interface Profile {
  id: string;
  name: string | null;
  email: string;
  role: string;
  created_at: string;
}

interface FormValues {
  name: string;
  email: string;
  role: string;
}

const Workers = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedWorker, setSelectedWorker] = React.useState<Profile | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { hasRole } = useAuth();

  const {
    data: workers,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      return data || [];
    }
  });

  const addWorkerMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // Generate a random UUID for the new worker
      const workerId = crypto.randomUUID();
      
      const { error } = await supabase
        .from('profiles')
        .insert([
          { 
            id: workerId,
            name: values.name,
            email: values.email,
            role: values.role
          }
        ]);

      if (error) {
        throw error;
      }

      return workerId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Worker added",
        description: "The worker has been added successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding worker",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateWorkerMutation = useMutation({
    mutationFn: async (values: FormValues & { id: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          name: values.name,
          email: values.email,
          role: values.role
        })
        .eq('id', values.id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      setIsEditDialogOpen(false);
      setSelectedWorker(null);
      toast({
        title: "Worker updated",
        description: "The worker has been updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating worker",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteWorkerMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      setIsDeleteDialogOpen(false);
      setSelectedWorker(null);
      toast({
        title: "Worker deleted",
        description: "The worker has been deleted successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting worker",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const filteredWorkers = React.useMemo(() => {
    if (!workers) return [];
    
    if (!searchQuery.trim()) return workers;
    
    const query = searchQuery.toLowerCase();
    return workers.filter(worker => 
      worker.name?.toLowerCase().includes(query) || 
      worker.email.toLowerCase().includes(query) ||
      worker.role.toLowerCase().includes(query)
    );
  }, [workers, searchQuery]);

  const handleAddWorker = (values: FormValues) => {
    addWorkerMutation.mutate(values);
  };

  const handleEditWorker = (worker: Profile) => {
    setSelectedWorker(worker);
    setIsEditDialogOpen(true);
  };

  const handleUpdateWorker = (values: FormValues) => {
    if (selectedWorker) {
      updateWorkerMutation.mutate({ ...values, id: selectedWorker.id });
    }
  };

  const handleDeleteWorker = (id: string) => {
    const worker = workers?.find(w => w.id === id);
    if (worker) {
      setSelectedWorker(worker);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDelete = () => {
    if (selectedWorker) {
      deleteWorkerMutation.mutate(selectedWorker.id);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-lg font-medium text-red-800">Error loading workers</h3>
        <p className="text-red-600">{(error as Error).message}</p>
        <Button 
          variant="outline" 
          onClick={() => refetch()} 
          className="mt-2"
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Workers Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Worker
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search workers by name, email or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <WorkersList 
          workers={filteredWorkers} 
          onEditWorker={handleEditWorker}
          onDeleteWorker={handleDeleteWorker}
          refetchWorkers={() => refetch()}
        />
      )}

      {/* Add Worker Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Worker</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new worker to the system.
            </DialogDescription>
          </DialogHeader>
          <WorkerForm 
            onSubmit={handleAddWorker} 
            isSubmitting={addWorkerMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Worker Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Worker</DialogTitle>
            <DialogDescription>
              Update the worker's information.
            </DialogDescription>
          </DialogHeader>
          {selectedWorker && (
            <WorkerForm 
              defaultValues={{
                id: selectedWorker.id,
                name: selectedWorker.name || '',
                email: selectedWorker.email,
                role: selectedWorker.role as any,
              }}
              onSubmit={handleUpdateWorker}
              isSubmitting={updateWorkerMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Worker Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedWorker?.name || 'this worker'}'s 
              account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {deleteWorkerMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Workers;
