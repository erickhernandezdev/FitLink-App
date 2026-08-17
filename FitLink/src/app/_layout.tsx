import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { theme } from '../constants/theme';
import { useFonts } from "expo-font";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { ActivityIndicator, View } from "react-native";

const RootLayout: React.FC = () => {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
  return <RootLayoutNav />;
};

const RootLayoutNav: React.FC = () => {
  const router = useRouter();
  const segments = useSegments();

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();

      setSession(data.session);
      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthScreens =
      segments[0] === 'login' ||
      segments[0] === 'register';

    const inPrivateScreens = segments[0] === '(tabs)';

    if (!session && inPrivateScreens) {
      router.replace('/login');
    }

    if (session && inAuthScreens) {
      router.replace('/routines');
    }
  }, [session, loading, segments]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
        />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};

export default RootLayout;
