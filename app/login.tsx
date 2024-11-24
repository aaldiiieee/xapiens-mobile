import React, { useEffect, useState } from "react";
import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import callReqResAPI from "@/api/callReqResAPI";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import ButtonSubmit from "@/components/ui/ButtonSubmit";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState(null);

  // Google OAuth
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "459053274171-00gr631nvss49hpbvui6kvi916heojfq.apps.googleusercontent.com",
    androidClientId:
      "459053274171-ppobrgfh2ondc68pt88sl88o3l33m5pv.apps.googleusercontent.com",
    webClientId:
      "459053274171-svetlkmr0k7cgbq7iks0ng168p4sr8qt.apps.googleusercontent.com",
    redirectUri: Platform.select({
      ios: "com.aaldiiieee.dev.xapiensmobiletest:/oauthredirect",
      android: "com.aaldiiieee.dev.xapiensmobiletest:/oauthredirect",
    }),
  });

  useEffect(() => {
    handleLoginWithGoogle();
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);

      const payload: LoginPayload = { email, password };
      const response = await callReqResAPI.post<LoginResponse>(
        "/login",
        payload
      );

      const token = response.data.token;
      await AsyncStorage.setItem("authToken", token);

      Alert.alert("Login Successful", "You are now logged in.");
      router.push("/(app)");
    } catch (error: any) {
      console.error("Login Error:", error);
      Alert.alert("Login Failed", error?.error || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    const user = await AsyncStorage.getItem("@user");

    if (!user) {
      if (
        response &&
        response.type === "success" &&
        response.authentication?.accessToken
      ) {
        await getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  };

  const getUserInfo = async (token: string) => {
    if (!token) return;
    try {
      const response = await axios.get(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = response.data;
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
      router.push("/(app)");
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <ButtonSubmit
        loading={loading}
        text="Login"
        onPress={handleLogin}
        textStyle={{ color: "white" }}
      />

      <Text style={styles.orText}>Or</Text>

      <ButtonSubmit
        loading={false}
        text="Login With Google"
        onPress={() => promptAsync()}
        buttonStyle={styles.buttonLoginGoogle}
      >
        <FontAwesome name="google" size={20} />
      </ButtonSubmit>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },

  link: {
    marginTop: 10,
    color: "#007BFF",
  },

  buttonLoginGoogle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    gap: 10,
    width: "100%",
  },

  orText: {
    marginVertical: 15,
    fontSize: 16,
    color: "#888",
  },
});
