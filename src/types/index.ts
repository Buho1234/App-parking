export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  userType: 'seeker' | 'provider';
  profileImage?: string;
  rating: number;
  totalRatings: number;
  createdAt: Date;
  isVerified: boolean;
}

export interface ParkingSpace {
  id: string;
  providerId: string;
  providerName: string;
  providerPhone: string;
  providerRating: number;
  title: string;
  description: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  pricePerHour: number;
  pricePerDay?: number;
  images: string[];
  amenities: string[];
  maxVehicleSize: 'small' | 'medium' | 'large' | 'extra-large';
  isAvailable: boolean;
  availableFrom: Date;
  availableTo: Date;
  createdAt: Date;
  totalSpaces: number;
  occupiedSpaces: number;
  isSecure: boolean;
  isCovered: boolean;
  hasElectricCharging: boolean;
  accessInstructions?: string;
}

export interface BookingRequest {
  id: string;
  seekerId: string;
  seekerName: string;
  seekerPhone: string;
  parkingSpaceId: string;
  parkingSpaceTitle: string;
  parkingSpaceAddress: string;
  startDateTime: Date;
  endDateTime: Date;
  totalHours: number;
  proposedPrice: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: Date;
  vehicleInfo: VehicleInfo;
}

export interface VehicleInfo {
  type: 'car' | 'motorcycle' | 'truck' | 'van' | 'rv';
  licensePlate: string;
  color: string;
  make?: string;
  model?: string;
}

export interface Booking {
  id: string;
  requestId: string;
  seekerId: string;
  providerId: string;
  parkingSpaceId: string;
  startDateTime: Date;
  endDateTime: Date;
  totalHours: number;
  agreedPrice: number;
  status: 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
  completedAt?: Date;
  seekerRating?: number;
  providerRating?: number;
  seekerReview?: string;
  providerReview?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking_request' | 'booking_accepted' | 'booking_rejected' | 'booking_completed' | 'payment' | 'general';
  isRead: boolean;
  createdAt: Date;
  relatedId?: string; // booking or request ID
}

export interface SearchFilters {
  maxDistance: number; // in km
  maxPricePerHour: number;
  startDateTime: Date;
  endDateTime: Date;
  vehicleType: VehicleInfo['type'];
  amenities: string[];
  isSecure?: boolean;
  isCovered?: boolean;
  hasElectricCharging?: boolean;
}

export type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  Register: undefined;
  UserTypeSelection: undefined;
  Main: undefined;
  Home: undefined;
  Search: undefined;
  Bookings: undefined;
  Profile: undefined;
  ParkingDetails: { parkingSpace: ParkingSpace };
  BookingRequest: { parkingSpace: ParkingSpace };
  MyParkingSpaces: undefined;
  AddParkingSpace: undefined;
  EditParkingSpace: { parkingSpace: ParkingSpace };
  BookingDetails: { booking: Booking };
  RequestDetails: { request: BookingRequest };
  ChatScreen: { 
    otherUserId: string; 
    otherUserName: string;
    bookingId?: string;
  };
  Notifications: undefined;
  Settings: undefined;
  VehicleInfo: undefined;
  PaymentMethods: undefined;
  Help: undefined;
};