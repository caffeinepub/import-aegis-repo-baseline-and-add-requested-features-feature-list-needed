import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import List "mo:core/List";

actor {
  type UserId = Principal;
  type FollowRequestId = Nat;
  type DossierId = Nat;

  type PolicyType = {
    #dataRetention;
    #informationSharing;
    #accessControl;
    #privacy;
    #security;
  };

  type Administrator = {
    id : UserId;
    name : Text;
  };

  type SelfSovereignIdentity = {
    id : UserId;
    credentials : List.List<Credential>;
    verified : Bool;
  };

  type Visibility = { #publicVisibility; #privateVisibility };

  type Post = {
    id : Nat;
    authorId : UserId;
    content : Text;
    visibility : Visibility;
  };

  type Credential = {
    name : Text;
    issuedBy : Text;
    valid : Bool;
  };

  type SecureCredential = Credential;

  type SecurityIncident = { id : Nat; authorId : UserId; description : Text };
  type CyberThreat = { id : Nat; authorId : UserId; description : Text };

  type Policy = {
    id : Nat;
    name : Text;
    policyType : PolicyType;
    effectiveDate : Text;
    expiryDate : ?Text;
    reputationScoreImpact : Int;
    regulatoryComplianceReference : ?Text;
  };

  type FollowRequest = {
    id : FollowRequestId;
    followerId : UserId;
    followedId : UserId;
    status : { #pending; #approved; #denied };
  };

  type Employee = {
    id : Nat;
    userId : UserId;
    firstName : Text;
    lastName : Text;
    organization : Text;
    departmentId : Nat;
    salaryRange : SalaryRange;
    employmentType : { #fullTime; #partTime; #contractor };
    benefits : [Benefit];
    taxRate : Float;
    hourlyWage : Float;
    performanceReviews : [Text];
    kpis : [KPI];
    achievements : [Text];
  };

  type SalaryRange = {
    min : Float;
    max : Float;
    median : Float;
  };

  type Benefit = {
    name : Text;
    description : Text;
    type_ : { #healthInsurance; #retirementPlan; #other };
  };

  type KPI = {
    name : Text;
    target : Float;
    achieved : Float;
  };

  type FollowConfig = {
    minFollowers : Nat;
    maxFollowers : Nat;
    reciprocalFollowingRequired : Bool;
    followApprovalThreshold : Nat;
    followBackProbability : Float;
    engagementScoreWeight : Float;
    crossPlatformIntegration : Bool;
    automaticFollowerCleanup : Bool;
    geoSpecificFollowingRestrictions : Bool;
    contentTypeFollowing : Bool;
    followerCapsForNewAccounts : Nat;
    engagementRewardThresholds : Float;
    followHistoryLogging : Bool;
  };

  var nextFollowRequestId = 0;
  let followRequests = List.empty<FollowRequest>();

  public shared ({ caller }) func createFollowRequest(followerId : UserId, followedId : UserId) : async FollowRequestId {
    let newId = nextFollowRequestId;
    let newRequest : FollowRequest = {
      id = newId;
      followerId;
      followedId;
      status = #pending;
    };
    followRequests.add(newRequest);
    nextFollowRequestId += 1;
    newId;
  };

  public shared ({ caller }) func approveFollowRequest(requestId : FollowRequestId) : async Bool {
    var updated = false;
    let updatedRequests = followRequests.map<FollowRequest, FollowRequest>(
      func(req) {
        if (req.id == requestId) {
          updated := true;
          { req with status = #approved };
        } else { req };
      }
    );
    followRequests.clear();
    followRequests.addAll(updatedRequests.values());
    updated;
  };

  public shared ({ caller }) func denyFollowRequest(requestId : FollowRequestId) : async Bool {
    var updated = false;
    let updatedRequests = followRequests.map<FollowRequest, FollowRequest>(
      func(req) {
        if (req.id == requestId) {
          updated := true;
          { req with status = #denied };
        } else { req };
      }
    );
    followRequests.clear();
    followRequests.addAll(updatedRequests.values());
    updated;
  };

  public query ({ caller }) func getFollowRequest(requestId : FollowRequestId) : async ?FollowRequest {
    followRequests.find(func(request) { request.id == requestId });
  };

  public query ({ caller }) func getAllPendingFollowRequests() : async [FollowRequest] {
    let pendingRequests = followRequests.filter(func(req) { req.status == #pending });
    pendingRequests.toArray();
  };
};
