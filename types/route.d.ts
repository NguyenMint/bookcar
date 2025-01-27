// type RootStackParamList = {
//     Home: {id: number;title: string; rate: number;}| undefined;
//     Details: {id: number;title: string; rate: number;}| undefined;
//     About: undefined;
//     // Profile: { userId: string };
//     // Feed: { sort: 'latest' | 'top' } | undefined;
//   };

  declare module "*.png"

  declare module '@env' {
    const GOOGLE_MAPS_API_KEY: string;
  }

  // import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
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
};

export type TripListNavigationProp = StackNavigationProp<RootStackParamList, 'TripList'>;

export type TripListRouteProp = RouteProp<RootStackParamList, 'TripList'>;

export type BusBookingAppNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "BusBooking"
>;