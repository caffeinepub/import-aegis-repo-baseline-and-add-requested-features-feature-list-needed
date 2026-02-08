import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { FollowRequest, FollowRequestId, UserId } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

// Query keys
const QUERY_KEYS = {
  pendingRequests: ['followRequests', 'pending'] as const,
  followRequest: (id: FollowRequestId) => ['followRequest', id.toString()] as const,
};

// Get all pending follow requests
export function useGetPendingFollowRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<FollowRequest[]>({
    queryKey: QUERY_KEYS.pendingRequests,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPendingFollowRequests();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
  });
}

// Get a specific follow request
export function useGetFollowRequest(requestId: FollowRequestId) {
  const { actor, isFetching } = useActor();

  return useQuery<FollowRequest | null>({
    queryKey: QUERY_KEYS.followRequest(requestId),
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFollowRequest(requestId);
    },
    enabled: !!actor && !isFetching && requestId !== undefined,
  });
}

// Create a follow request
export function useCreateFollowRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<FollowRequestId, Error, { followerId: UserId; followedId: UserId }>({
    mutationFn: async ({ followerId, followedId }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createFollowRequest(followerId, followedId);
    },
    onSuccess: () => {
      // Invalidate pending requests to refresh the list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pendingRequests });
    },
  });
}

// Approve a follow request
export function useApproveFollowRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, FollowRequestId>({
    mutationFn: async (requestId) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.approveFollowRequest(requestId);
    },
    onSuccess: () => {
      // Invalidate pending requests to refresh the list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pendingRequests });
    },
  });
}

// Deny a follow request
export function useDenyFollowRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, FollowRequestId>({
    mutationFn: async (requestId) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.denyFollowRequest(requestId);
    },
    onSuccess: () => {
      // Invalidate pending requests to refresh the list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pendingRequests });
    },
  });
}

// Helper function to validate Principal ID
export function isValidPrincipalId(principalId: string): boolean {
  try {
    Principal.fromText(principalId);
    return true;
  } catch {
    return false;
  }
}
