import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

import { useState } from "react";

interface ButtonSubmitProps {
  onPress: () => void;
  loading: boolean;
  text: string;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

const ButtonSubmit = ({
  loading,
  buttonStyle,
  text,
  textStyle,
  children,
  onPress,
}: ButtonSubmitProps) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  
  return (
    <TouchableOpacity
      style={[styles.button, isPressed && styles.buttonPressed, buttonStyle]}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={loading}
    >
      {children}
      <Text style={[styles.buttonSubmitText, textStyle]}>
        {loading ? "Loading..." : text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#151b54",
    boxShadow: "#000 4px 4px 0px 0px",
    borderWidth: 1,
    borderStyle: "solid",
    shadowRadius: 4,
  },

  buttonSubmitText: {
    fontWeight: "500",
    fontSize: 16,
  },

  buttonPressed: {
    boxShadow: "none",
    opacity: 1,
  },
});

export default ButtonSubmit;
