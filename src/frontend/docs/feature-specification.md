# AEGIS Feature Specification

## Overview
AEGIS is a decentralized social networking and identity management platform built on the Internet Computer. The system provides secure follow request management, self-sovereign identity verification, and comprehensive user interaction features.

## Feature List

### Feature 1: Follow Request Management System
**User Story**: As a user, I want to send, approve, and deny follow requests so that I can control who can see my content and build my network.

**UI Screens/Components**:
- Follow request creation form
- Pending follow requests list (inbox)
- Follow request action buttons (Approve/Deny)
- Follow request status indicators

**Data to Store**:
- Follow request ID (auto-generated)
- Follower Principal ID
- Followed user Principal ID
- Request status (pending/approved/denied)

**Backend Integration**:
- `createFollowRequest(followerId, followedId)` - Create new follow request
- `getAllPendingFollowRequests()` - Fetch all pending requests
- `approveFollowRequest(requestId)` - Approve a request
- `denyFollowRequest(requestId)` - Deny a request
- `getFollowRequest(requestId)` - Get specific request details

**Acceptance Criteria**:
- Users can send follow requests to other users by Principal ID
- Users can view all pending follow requests they've received
- Users can approve or deny follow requests with immediate UI feedback
- Request status updates are reflected in real-time
- Approved/denied requests are removed from pending list

**Non-functional Requirements**:
- Response time < 2 seconds for all operations
- Support for at least 1000 concurrent follow requests per user
- Secure authentication via Internet Identity

---

### Feature 2: User Authentication & Identity
**User Story**: As a user, I want to securely log in using Internet Identity so that my identity is protected and decentralized.

**UI Screens/Components**:
- Login button/modal
- User profile indicator (Principal ID display)
- Logout button
- Authentication status indicator

**Data to Store**:
- User Principal ID (from Internet Identity)
- Authentication state (logged in/out)

**Backend Integration**:
- Internet Identity authentication flow
- Principal-based authorization for all backend calls

**Acceptance Criteria**:
- Users can log in via Internet Identity
- Principal ID is displayed after successful login
- All backend operations use authenticated identity
- Users can log out and clear their session
- Unauthenticated users see limited functionality

**Non-functional Requirements**:
- Secure authentication using Internet Identity
- Session persistence across page refreshes
- Clear visual feedback for authentication state

---

### Feature 3: User Dashboard
**User Story**: As a user, I want to see an overview of my network activity including pending requests, followers, and following counts.

**UI Screens/Components**:
- Dashboard home page
- Statistics cards (pending requests, followers, following)
- Recent activity feed
- Quick action buttons

**Data to Store**:
- Aggregated statistics from follow requests
- User activity history

**Backend Integration**:
- `getAllPendingFollowRequests()` - For pending count
- Future: `getFollowers()`, `getFollowing()` endpoints

**Acceptance Criteria**:
- Dashboard displays accurate counts of pending requests
- Users can navigate to detailed views from dashboard
- Dashboard updates when actions are taken
- Responsive design for mobile and desktop

**Non-functional Requirements**:
- Dashboard loads in < 3 seconds
- Real-time updates using React Query
- Accessible UI following WCAG 2.1 AA standards

---

### Feature 4: User Discovery & Search
**User Story**: As a user, I want to search for other users by their Principal ID so that I can send them follow requests.

**UI Screens/Components**:
- Search bar with Principal ID input
- User search results display
- Follow button on search results
- Search history (optional)

**Data to Store**:
- Search queries (client-side only)
- User lookup results

**Backend Integration**:
- Principal ID validation
- Follow request creation from search results

**Acceptance Criteria**:
- Users can enter a valid Principal ID to search
- Invalid Principal IDs show appropriate error messages
- Search results display user information
- Users can send follow requests directly from search results
- Duplicate follow requests are prevented

**Non-functional Requirements**:
- Principal ID validation on client-side
- Clear error messaging for invalid inputs
- Search completes in < 1 second

---

### Feature 5: Notifications System
**User Story**: As a user, I want to receive notifications when someone sends me a follow request or responds to my request.

**UI Screens/Components**:
- Notification bell icon with badge count
- Notification dropdown/panel
- Notification items with actions
- Mark as read functionality

**Data to Store**:
- Notification read/unread state (client-side)
- Notification timestamp

**Backend Integration**:
- Poll `getAllPendingFollowRequests()` for new requests
- React Query automatic refetching

**Acceptance Criteria**:
- Badge shows count of unread notifications
- Clicking notification navigates to relevant screen
- Notifications update in real-time
- Users can mark notifications as read
- Notification history is maintained

**Non-functional Requirements**:
- Notifications appear within 5 seconds of event
- Support for at least 100 notifications per user
- Efficient polling strategy to minimize backend calls

---

## Future Features (Not in Current Scope)

The backend includes types for the following features that are not yet implemented:
- Post creation and visibility management
- Self-sovereign identity credentials
- Employee management system
- Security incident reporting
- Cyber threat tracking
- Policy management
- Department and organization structure

These features will require additional backend endpoints and frontend implementation in future iterations.

---

## Technical Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Query + React Context
- **Authentication**: Internet Identity
- **Backend**: Motoko on Internet Computer
- **Routing**: TanStack Router (if multi-page)

---

## Design Requirements
- Modern, clean interface with warm color palette (non-blue/non-purple)
- Responsive design for mobile, tablet, and desktop
- Dark mode support
- Accessible UI components
- Consistent spacing and typography
- Loading states for all async operations
- Error handling with user-friendly messages

---

## User-Facing Copy (English)

### Authentication
- Login button: "Connect with Internet Identity"
- Logout button: "Disconnect"
- Welcome message: "Welcome to AEGIS"
- Login prompt: "Please connect your Internet Identity to continue"

### Follow Requests
- Send request button: "Send Follow Request"
- Approve button: "Accept"
- Deny button: "Decline"
- Pending status: "Pending"
- Approved status: "Following"
- Denied status: "Declined"
- Empty state: "No pending follow requests"
- Success message: "Follow request sent successfully"
- Error message: "Failed to send follow request. Please try again."

### Dashboard
- Page title: "Dashboard"
- Pending requests card: "Pending Requests"
- Followers card: "Followers"
- Following card: "Following"
- Recent activity: "Recent Activity"

### Search
- Search placeholder: "Enter Principal ID to search"
- Search button: "Search"
- No results: "No user found with this Principal ID"
- Invalid input: "Please enter a valid Principal ID"

### Notifications
- Notification title: "Notifications"
- New request: "{user} sent you a follow request"
- Request approved: "{user} accepted your follow request"
- Mark all read: "Mark all as read"
- No notifications: "No new notifications"
