
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { UserPlus, Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import WorkersList from '@/components/Workers/WorkersList';
import { useToast } from '@/hooks/use-toast';

const Workers = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { toast } = useToast();

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

  const handleCreateWorker = () => {
    toast({
      title: "Feature coming soon",
      description: "Worker creation functionality will be added in the next update."
    });
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
        <Button onClick={handleCreateWorker}>
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
        <WorkersList workers={filteredWorkers} />
      )}
    </div>
  );
};

export default Workers;
