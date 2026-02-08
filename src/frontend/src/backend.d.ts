import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export interface FollowRequest {
    id: FollowRequestId;
    status: Variant_pending_denied_approved;
    followedId: UserId;
    followerId: UserId;
}
export type FollowRequestId = bigint;
export enum Variant_pending_denied_approved {
    pending = "pending",
    denied = "denied",
    approved = "approved"
}
export interface backendInterface {
    approveFollowRequest(requestId: FollowRequestId): Promise<boolean>;
    createFollowRequest(followerId: UserId, followedId: UserId): Promise<FollowRequestId>;
    denyFollowRequest(requestId: FollowRequestId): Promise<boolean>;
    getAllPendingFollowRequests(): Promise<Array<FollowRequest>>;
    getFollowRequest(requestId: FollowRequestId): Promise<FollowRequest | null>;
}
