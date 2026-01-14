import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function AvailabilityLayout() {
  const router = useRouter();

  // Check if user has permission to access availability settings
  useEffect(() => {
    const checkPermissions = async () => {
      const hasPermission = await checkUserAvailabilityPermission();
      if (!hasPermission) {
        router.replace("/(tabs)/(event-types)" as never);
      }
    };
    checkPermissions();
  }, [router]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="availability-detail" />
    </Stack>
  );
}

// Mock permission check function
async function checkUserAvailabilityPermission(): Promise<boolean> {
  // In a real app, this would check user permissions from context/API
  return true;
}
