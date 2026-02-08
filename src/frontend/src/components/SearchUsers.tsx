import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Search, UserPlus, Loader2 } from 'lucide-react';
import { useCreateFollowRequest, isValidPrincipalId } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Principal } from '@icp-sdk/core/principal';
import { toast } from 'sonner';

export function SearchUsers() {
  const [principalId, setPrincipalId] = useState('');
  const [error, setError] = useState('');
  const { identity } = useInternetIdentity();
  const createRequestMutation = useCreateFollowRequest();

  const handleSearch = () => {
    setError('');
    
    if (!principalId.trim()) {
      setError('Please enter a Principal ID');
      return;
    }

    if (!isValidPrincipalId(principalId)) {
      setError('Please enter a valid Principal ID');
      return;
    }

    // Check if trying to follow self
    if (identity && principalId === identity.getPrincipal().toString()) {
      setError('You cannot send a follow request to yourself');
      return;
    }
  };

  const handleSendRequest = async () => {
    if (!identity) {
      toast.error('Please connect your Internet Identity first');
      return;
    }

    if (!isValidPrincipalId(principalId)) {
      setError('Please enter a valid Principal ID');
      return;
    }

    try {
      const followerId = identity.getPrincipal();
      const followedId = Principal.fromText(principalId);

      await createRequestMutation.mutateAsync({
        followerId,
        followedId,
      });

      toast.success('Follow request sent successfully', {
        description: `Request sent to ${principalId.slice(0, 12)}...`,
      });
      setPrincipalId('');
      setError('');
    } catch (error) {
      toast.error('Failed to send follow request', {
        description: 'Please try again later',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Users
        </CardTitle>
        <CardDescription>Find and connect with other users by their Principal ID</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="principal-search">Principal ID</Label>
          <div className="flex gap-2">
            <Input
              id="principal-search"
              placeholder="Enter Principal ID to search"
              value={principalId}
              onChange={(e) => {
                setPrincipalId(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button onClick={handleSearch} variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        {principalId && isValidPrincipalId(principalId) && !error && (
          <div className="rounded-lg border border-border p-4 space-y-4">
            <div>
              <p className="text-sm font-medium">User Found</p>
              <p className="text-xs text-muted-foreground break-all">{principalId}</p>
            </div>
            <Button
              onClick={handleSendRequest}
              disabled={createRequestMutation.isPending}
              className="w-full"
            >
              {createRequestMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Send Follow Request
                </>
              )}
            </Button>
          </div>
        )}

        <div className="rounded-lg bg-muted/50 p-4 space-y-2">
          <p className="text-sm font-medium">How to find Principal IDs:</p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Ask users to share their Principal ID directly</li>
            <li>Principal IDs are unique identifiers on the Internet Computer</li>
            <li>They look like: "2vxsx-fae-aaaa-aaaaa-cai"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
