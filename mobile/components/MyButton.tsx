import { ReactNode } from "react";
import { GestureResponderEvent, Text, TouchableOpacity } from "react-native";

type BtnProps = {
  className?: string;
  children: ReactNode;
  to?: string;
  onPress: (event: GestureResponderEvent) => void;
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
        "btn h-16 items-center justify-center rounded-md bg-[#5046E4] p-4 shadow-sm hover:bg-gray-400"
      }
      onPress={onPress}
    >
      <Text className="uppercase text-slate-200">{children}</Text>
    </TouchableOpacity>
  );
}