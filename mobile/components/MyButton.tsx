import { ReactNode } from "react";
import {
  GestureResponderEvent,
  Linking,
  Text,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";

type BtnProps = {
  className?: string;
  children: ReactNode;
  to?: string;
  href?: string;
  onPress?: (event: GestureResponderEvent) => void;
};

export function SubmitButton({ children, onPress }: BtnProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={
        "btn h-16 items-center justify-center rounded-md bg-[#5046E4] p-4 shadow-sm hover:bg-red-400"
      }
      onPress={onPress}
    >
      <Text className="uppercase text-slate-200">{children}</Text>
    </TouchableOpacity>
  );
}

export function MyButton({ children, onPress }: BtnProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={
        "h-8 items-center justify-center rounded-sm bg-[#5046E4] p-4 shadow-sm hover:bg-gray-400"
      }
      onPress={onPress}
    >
      <Text className="uppercase text-slate-200">{children}</Text>
    </TouchableOpacity>
  );
}

export function MyLinkButton({ children, href }: BtnProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={
        "transition hover:scale-110 duration-300 h-8 items-center justify-center rounded-sm bg-[#5046E4] px-4 py-2 shadow-sm hover:bg-indigo-400"
      }
      onPress={() => {
        href && Linking.openURL(href);
      }}
    >
      <Text className="uppercase text-slate-200">
        {children} <Feather name="external-link" size={18} color="white" />
      </Text>
    </TouchableOpacity>
  );
}
