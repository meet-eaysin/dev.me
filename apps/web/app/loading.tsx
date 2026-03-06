import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-4">
      <Spinner size="lg" />
      <p className="text-muted-foreground animate-pulse text-sm">
        Loading...
      </p>
      
      {/* Example skeleton layout for background loading feel */}
      <div className="mx-auto w-full max-w-md space-y-4 pt-8 opacity-50">
        <Skeleton className="h-8 w-[250px] mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
