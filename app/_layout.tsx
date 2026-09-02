import "react-native-reanimated";
import React, { useEffect, useState } from "react";
import { Stack, Redirect, usePathname, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme, Alert, View, ActivityIndicator } from "react-native";
import { useNetworkState } from "expo-network";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { SubscriptionProvider, useSubscription } from "@/contexts/SubscriptionContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { supabase } from "@/utils/supabase";

// Only wrap with ErrorBoundary in dev — production apps should not include it
const DevErrorBoundary = __DEV__
  ? ErrorBoundary
  : ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

const AUTH_ROUTES = ["/auth", "/auth-popup", "/auth-callback"];
const PUBLIC_ROUTES = ["/auth", "/auth-popup", "/auth-callback", "/onboarding", "/paywall"];

function NavigationGuard() {
  const { session, loading: authLoading } = useAuth();
  const { isSubscribed, loading: subLoading } = useSubscription();
  const pathname = usePathname();
  const router = useRouter();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    if (!session) {
      setOnboardingDone(null);
      return;
    }
    console.log('[NavigationGuard] Checking onboarding for user:', session.user.id);
    supabase
      .from('onboarding_responses')
      .select('id')
      .eq('user_id', session.user.id)
      .limit(1)
      .then(({ data, error }) => {
        if (error) {
          console.warn('[NavigationGuard] Onboarding check error:', error.message);
          setOnboardingDone(false);
        } else {
          const done = Array.isArray(data) && data.length > 0;
          console.log('[NavigationGuard] Onboarding complete:', done);
          setOnboardingDone(done);
        }
      });
  }, [session]);

  useEffect(() => {
    if (authLoading) return;

    // Not logged in → go to auth (unless already on a public route)
    if (!session) {
      if (!AUTH_ROUTES.includes(pathname)) {
        console.log('[NavigationGuard] No session — redirecting to /auth');
        router.replace('/auth');
      }
      return;
    }

    // Logged in but onboarding status not yet known
    if (onboardingDone === null) return;

    // On auth screen but logged in → redirect away
    if (AUTH_ROUTES.includes(pathname)) {
      if (!onboardingDone) {
        router.replace('/onboarding');
      } else if (!isSubscribed && !subLoading) {
        router.replace('/paywall');
      } else {
        router.replace('/(tabs)/command-center');
      }
      return;
    }

    // Onboarding not done → go to onboarding
    if (!onboardingDone && pathname !== '/onboarding') {
      console.log('[NavigationGuard] Onboarding incomplete — redirecting');
      router.replace('/onboarding');
      return;
    }

    // Onboarding done but not subscribed → go to paywall
    if (onboardingDone && !isSubscribed && !subLoading && pathname !== '/paywall') {
      console.log('[NavigationGuard] Not subscribed — redirecting to paywall');
      router.replace('/paywall');
    }
  }, [authLoading, session, onboardingDone, isSubscribed, subLoading, pathname]);

  return null;
}

function AppContent() {
  const { loading: authLoading } = useAuth();
  const colorScheme = useColorScheme();
  const networkState = useNetworkState();
  const [loaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  React.useEffect(() => {
    if (
      !networkState.isConnected &&
      networkState.isInternetReachable === false
    ) {
      Alert.alert(
        "You are offline",
        "You can keep using the app! Your changes will be saved locally and synced when you are back online."
      );
    }
  }, [networkState.isConnected, networkState.isInternetReachable]);

  if (!loaded || authLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00C9A7" />
      </View>
    );
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "#0D9488",
      background: "#F0F4F3",
      card: "#FFFFFF",
      text: "#0F2420",
      border: "rgba(13, 148, 136, 0.08)",
      notification: "#EF4444",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "#0D9488",
      background: "#0A1512",
      card: "#111E1B",
      text: "#E8F5F3",
      border: "rgba(255,255,255,0.07)",
      notification: "#EF4444",
    },
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}>
      <SafeAreaProvider>
        <WidgetProvider>
          <GestureHandlerRootView>
            <NavigationGuard />
            <Stack>
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="paywall" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="recommendation/[id]"
                options={{
                  headerShown: true,
                  headerTitle: "Recommendation",
                  headerBackButtonDisplayMode: "minimal",
                  headerTransparent: true,
                  headerBlurEffect: "systemMaterial",
                }}
              />
              <Stack.Screen
                name="campaign/[id]"
                options={{
                  headerShown: true,
                  headerTitle: "Campaign",
                  headerBackButtonDisplayMode: "minimal",
                  headerTransparent: true,
                  headerBlurEffect: "systemMaterial",
                }}
              />
            </Stack>
            <SystemBars style={"auto"} />
          </GestureHandlerRootView>
        </WidgetProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <DevErrorBoundary>
          <StatusBar style="auto" animated />
          <AppContent />
        </DevErrorBoundary>
      </SubscriptionProvider>
    </AuthProvider>
  );
}
