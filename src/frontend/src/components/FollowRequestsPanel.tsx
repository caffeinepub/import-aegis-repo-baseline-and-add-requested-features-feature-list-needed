import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Loader2, UserCheck, UserX, Inbox } from 'lucide-react';
import { useGetPendingFollowRequests, useApproveFollowRequest, useDenyFollowRequest } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { FollowRequest } from '../backend';

export function FollowRequestsPanel() {
  const { data: requests, isLoading } = useGetPendingFollowRequests();
  const approveMutation = useApproveFollowRequest();
  const denyMutation = useDenyFollowRequest();

  const handleApprove = async (request: FollowRequest) => {
    try {
      await approveMutation.mutateAsync(request.id);
      toast.success('Follow request accepted', {
        description: `You are now connected with ${request.followerId.toString().slice(0, 8)}...`,
      });
    } catch (error) {
      toast.error('Failed to accept request', {
        description: 'Please try again later',
      });
    }
  };

  const handleDeny = async (request: FollowRequest) => {
    try {
      await denyMutation.mutateAsync(request.id);
      toast.success('Follow request declined');
    } catch (error) {
      toast.error('Failed to decline request', {
        description: 'Please try again later',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Inbox className="h-5 w-5" />
              Pending Requests
            </CardTitle>
            <CardDescription>Follow requests waiting for your response</CardDescription>
          </div>
          {requests && requests.length > 0 && (
            <Badge variant="secondary">{requests.length}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !requests || requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Inbox className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-sm text-muted-foreground">No pending follow requests</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id.toString()}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {request.followerId.toString().slice(0, 12)}...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Request ID: {request.id.toString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(request)}
                      disabled={approveMutation.isPending || denyMutation.isPending}
                    >
                      {approveMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-1" />
                          Accept
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeny(request)}
                      disabled={approveMutation.isPending || denyMutation.isPending}
                    >
                      {denyMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <UserX className="h-4 w-4 mr-1" />
                          Decline
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
