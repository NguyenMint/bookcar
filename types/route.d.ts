// type RootStackParamList = {
//     Home: {id: number;title: string; rate: number;}| undefined;
//     Details: {id: number;title: string; rate: number;}| undefined;
//     About: undefined;
//     // Profile: { userId: string };
//     // Feed: { sort: 'latest' | 'top' } | undefined;
//   };

declare module "*.png";

declare module "@env" {
  const GOOGLE_MAPS_API_KEY: string;
}

// import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from "@react-navigation/native";

type user = {
  id: number;
  name: string;
  email: string;
  Role: number;
};

export type RootStackParamList = {
  Main: { user: user } | undefined;
  BusBooking: undefined;
  VehicleSelection: {
    departure: string;
    destination: string;
    date: string;
    isRoundTrip: boolean;
  };
  TripList: {
    vehicleType: string;
    departure: string;
    destination: string;
    date: string;
    isRoundTrip: boolean;
  };
  SignUp: {};
  Profile: { user: user }; // Ensure Profile receives user
  Login: {};
  Saved: { user: { id: number; name: string } } | undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Bookings: undefined;
  Saved: undefined;
  Profile: undefined;
};
export type TripListNavigationProp = StackNavigationProp<
  RootStackParamList,
  "TripList"
>;

export type TripListRouteProp = RouteProp<RootStackParamList, "TripList">;

export type BusBookingAppNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "BusBooking"
>;

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  BottomTabParamList,
  "Home"
>;
export type HomeScreenRouteProp = RouteProp<BottomTabParamList, "Home">;

export type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;
export type ProfileScreenRouteProp = RouteProp<RootStackParamList, "Profile">;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
}

export type SavedScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Saved"
>;

export type SavedScreenRouteProp = RouteProp<RootStackParamList, "Saved">;

interface SavedScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "Saved">;
  route: RouteProp<RootStackParamList, "Saved">;
}

interface Booking {
  AppointmentID: number;
  ServiceName: string;
  DateSlot: string;
  StartTime: string;
  Price: number;
  Status: number;
}
export type SignupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SignUp"
>;
