
List of entities

User
? UserInvites - we could add this to `UserPod` table and add a status
UserPod
 - used to track the relationship between Pod and User
 - Will have terms and conditions for the Pod when giving private POD for public
Pod
PodReviews
Trip
 - Should be modeled in a way that we can rebook
ExtendTrip
 - used to track user's behavior
Location
Payment
? Wallet - do we also add this to `User` table
WalletHistory
Notifications
Coupons
UserCoupons
AppContent
AppConfig
Station
PickUpDropRequest
OfferManagement
UserRelationships
 - private rider, private owner relationship

What can the user do?

User
```SQL
CREATE TABLE Users (
    UserId varchar(255),
    Name varchar(255),
    Dob Date,
    Phone varchar(15),
    Email varchar(150),
    Address varchar(255),
    DocumentUrl varchar(255),
    ?UserImageForVerification varchar(255),
    Status varchar(255),
    LastLoggedIn Date,
    WalletBalance int,
    Currency int, -- need to confirm whether it is needed
    PRIMARY KEY (UserId),
);
CREATE TABLE Pods (
    PodId varchar(255),
    PodNumber varchar(255),
    MaxKms int,
    CreatedDate Date,
    ModelNumber varchar(255),
    Status varchar(255), -- active or inactive
    StationId varchar(255), -- wont be used for private owner
    range int, -- need to confirm whether to put range or charge percent
    PodTerms varchar(255),
    Latitude int,
    Longitudes int,
    FOREIGN KEY (StationId) REFERENCES Stations(StationId),
);
CREATE TABLE PodReviews(
    Id varchar(255),
    PodId varchar(255),
    UserId varchar(255),
    Rating int,
    Description varchar(255),
    FOREIGN KEY (PodId) REFERENCES Pods(PodId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
);
CREATE TABLE UserPods (
    PodRelationshipId varchar(255),
    PodId varchar(255),
    PodNumber varchar(255),
    UserId Date,
    RelationshipType varchar(255), -- owned or private rider
    Status varchar(255),
    FOREIGN KEY (PodId) REFERENCES Pods(PodId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
);
CREATE TABLE Notifications (
    NotificationId varchar(255),
    NotificationType varchar(255),
    Title varchar(255),
    TitleReplacements Object,
    date Date,
    UserId varchar(255),
    IsRead boolean,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
);
CREATE TABLE Coupons(
    CouponId varchar(255),
    Title varchar(255),
    TitleReplacements Object,
    CouponType varchar(255),
    CouponCode varchar(255),
);
CREATE TABLE UserCoupons(
    CouponRelationshipId varchar(255),
    UserId  varchar(255),
    CouponId  varchar(255),
    DateAssigned Date,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (CouponId) REFERENCES Coupons(CouponId),
);
CREATE TABLE Trips(
    TripId varchar(255),
    UserId varchar(255),
    PodId varchar(255),
    TripType varchar(10),  -- rent or lease
    Cost int,
    Currency int,
    BookingDate Date,
    StartStationName varchar(255),
    EndStationName varchar(255),
    StartStationId varchar(255),
    EndStationId varchar(255),  -- final end location after extend trip
    StartDate Date,
    EndDate Date,
    StartLatitude int, -- If dropped at users location
    StartLongitudes int,
    EndLatitude int, -- Needed if trip status is CancelledSupport
    EndLongitudes int,
    NoOfPauses int,
    StopId varchar(255),
    InsuranceId varchar(255),
    TripRating int,
    RatingDescription varchar(255),
    Status varchar(50), -- Pending, Cancelled, Ongoing, CancelledSupport, Completed
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (PodId) REFERENCES Pods(PodId),
    FOREIGN KEY (StartStationId) REFERENCES Stations(StationId),
    FOREIGN KEY (EndStationId) REFERENCES Stations(StationId),
    FOREIGN KEY (StopId) REFERENCES Stops(StopId),
    FOREIGN KEY (PaymentId) REFERENCES Payments(Id),
    FOREIGN KEY (InsuranceId) REFERENCES Insurance(Id),
);
CREATE TABLE Payments(
    Id varchar(255),
    TripId varchar(255), -- used for Trip
    ExtendTripId varchar(255), -- used for ExtendTrip
    UserId varchar(255), -- used for wallet
    Amount int,
    Currency varchar(255),
    PaymentMethod int, -- will add more fields based on integration
    PaymentType int, -- payment or refund
    createdDate Date,
    FOREIGN KEY (TripId) REFERENCES Trips(TripId),
);
CREATE TABLE ExtendTrip(
    ExtendTripId varchar(255),
    date Date,
    extendedDate Date, -- for lease
    TripId varchar(255),
    CurrentAddress varchar(255), -- optional
    CurrentAddressLatitude int, -- optional
    CurrentAddressLongitudes int, -- optional
    StartStationName varchar(255), -- optional
    EndStationName varchar(255), -- optional
    StartStationId varchar(255), -- optional
    EndStationId varchar(255), -- optional
    FOREIGN KEY (TripId) REFERENCES Trips(TripId),
);
CREATE TABLE Stops(
    StopId varchar(255),
    position int, -- order in the trip, index zero means start location, last index is end location
    Latitude int,
    Longitudes int,
    Address varchar(255),
);
CREATE TABLE PickUpDropRequests(
    Id varchar(255),
    UserId varchar(255),
    PodId varchar(255),
    TripId varchar(255),
    Type varchar(255), -- pick up or drop
    Latitude int,
    Longitudes int,
    Address varchar(255),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (PodId) REFERENCES Pods(PodId),
    FOREIGN KEY (TripId) REFERENCES Trips(TripId),
);
CREATE TABLE Stations(
    StationId varchar(255),
    Address varchar(255),
    Name varchar(255),
    Latitude int,
    Longitudes int,
);
CREATE TABLE WalletHistory(
    date Date,
    Amount int,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
);
CREATE TABLE Insurance(
    Id  varchar(255),
    Name varchar(255),
    Description varchar(255),
    Logo varchar(255),
    Cost int,
    DocumentUrl varchar(255),
    CoverageDetails varchar(255),
);
CREATE TABLE UserRelationships(
    Id varchar(255),
    OwnerId varchar(255),
    RiderId varchar(255),
    FOREIGN KEY (OwnerId) REFERENCES Users(UserId),
    FOREIGN KEY (RiderId) REFERENCES Users(UserId),
);
```


# Questions:

- How does a trip that got extended look like in the `Past trips` page
- What should I do when they rebook a trip that got extended
- Do we add extend trip as a stop in the trip when he is extending at a station
- Do we add extend trip as a stop in the trip when he is extending without reaching a station
- Money in wallet and free first 15kms is inconsistent. When he has 15 kms free, can he use the free kms even when he didn't add any money to his wallet.

## Extended Trip scenarios:

- Rent: Extended a ongoing trip - increase distance
- Rent: Extended a ongoing trip - decrease distance
- Lease: Extended a ongoing trip - increase duration
- Lease: Extended a ongoing trip - decrease duration
- Rent: Extend trip at station - increase distance
- Lease: Extend trip at station - increase duration
