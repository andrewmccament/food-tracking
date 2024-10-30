import { Redirect } from "expo-router";

export default function LandingPage() {
  return <Redirect href="/(auth)/sign-in" />;
}
