import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { RootState } from '../store';
import HomeScreen from '../screens/main/HomeScreen';
import SearchScreen from '../screens/main/SearchScreen';
import OrdersScreen from '../screens/main/OrdersScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import CartScreen from '../screens/main/CartScreen';
import RestaurantDetailsScreen from '../screens/main/RestaurantDetailsScreen';
import MealDetailsScreen from '../screens/main/MealDetailsScreen';
import OrderTrackingScreen from '../screens/main/OrderTrackingScreen';
import SubscriptionsScreen from '../screens/main/SubscriptionsScreen';
import colors from '../constants/theme';

// Define the types for our tab navigation parameters
export type MainTabParamList = {
  HomeStack: undefined;
  Search: undefined;
  OrdersStack: undefined;
  Profile: undefined;
};

// Define the types for the Home stack navigation parameters
export type HomeStackParamList = {
  Home: undefined;
  RestaurantDetails: { id: number };
  MealDetails: { id: number };
  Cart: undefined;
};

// Define the types for the Orders stack navigation parameters
export type OrdersStackParamList = {
  Orders: undefined;
  OrderTracking: { id: number };
  SubscriptionsList: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const OrdersStack = createStackNavigator<OrdersStackParamList>();

// Home Stack Navigator
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <HomeStack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Campus Foods' }}
      />
      <HomeStack.Screen 
        name="RestaurantDetails" 
        component={RestaurantDetailsScreen} 
        options={({ route }) => ({ title: 'Restaurant Details' })}
      />
      <HomeStack.Screen 
        name="MealDetails" 
        component={MealDetailsScreen} 
        options={({ route }) => ({ title: 'Meal Details' })}
      />
      <HomeStack.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ title: 'Your Cart' }}
      />
    </HomeStack.Navigator>
  );
};

// Orders Stack Navigator
const OrdersStackNavigator = () => {
  return (
    <OrdersStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <OrdersStack.Screen 
        name="Orders" 
        component={OrdersScreen} 
        options={{ title: 'Your Orders' }}
      />
      <OrdersStack.Screen 
        name="OrderTracking" 
        component={OrderTrackingScreen} 
        options={{ title: 'Track Order' }}
      />
      <OrdersStack.Screen 
        name="SubscriptionsList" 
        component={SubscriptionsScreen} 
        options={{ title: 'Your Subscriptions' }}
      />
    </OrdersStack.Navigator>
  );
};

// Animated icon that uses Reanimated for smooth animations
const AnimatedTabIcon = ({ name, color, size, focused }: { name: string, color: string, size: number, focused: boolean }) => {
  const animatedScale = Animated.useSharedValue(1);
  
  React.useEffect(() => {
    if (focused) {
      animatedScale.value = Animated.withSpring(1.2);
    } else {
      animatedScale.value = Animated.withSpring(1);
    }
  }, [focused]);
  
  const animatedStyle = Animated.useAnimatedStyle(() => {
    return {
      transform: [{ scale: animatedScale.value }]
    };
  });
  
  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={name as any} size={size} color={color} />
    </Animated.View>
  );
};

// Main Tab Navigator
const MainNavigator = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.disabled,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#f5f5f5',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = 'home';
          
          if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'OrdersStack') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <AnimatedTabIcon name={iconName} color={color} size={size} focused={focused} />;
        },
      })}
    >
      <Tab.Screen 
        name="HomeStack" 
        component={HomeStackNavigator} 
        options={{ 
          headerShown: false,
          title: 'Home',
          tabBarBadge: cartItems.length > 0 ? cartItems.length : undefined,
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ 
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#fff',
          title: 'Search',
        }}
      />
      <Tab.Screen 
        name="OrdersStack" 
        component={OrdersStackNavigator}
        options={{ 
          headerShown: false,
          title: 'Orders'
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#fff',
          title: 'Profile'
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
