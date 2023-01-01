import { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

type InputProps = {
  defaultValue?: string;
  min?: number;
  rightIcon?: React.ReactNode;
  showIcon?: React.ReactNode;
  hideIcon?: React.ReactNode;
  children?: React.ReactNode;
  title?: string;
  pattern?: string;
  error?: any;
  errorText?: string;
  leftIcon: React.ReactNode;
  name: string;
  label: string;
  type: "text" | "secret" | "email";
  value: string;
  placeholder: string;
} & TextInputProps;

export function MyInput({
  name,
  min,
  rightIcon,
  leftIcon,
  hideIcon,
  showIcon,
  label,
  type,
  title,
  placeholder,
  pattern,
  children,
  value,
  onBlur,
  error,
  errorText,
  ...otherProps
}: InputProps) {
  const [hideSecret, setHideSecret] = useState(true);
  const [extraStyles, setExtraStyles] = useState("bg-blue-500");

  return (
    <>
      <Text className="pl-1.5 capitalize block text-sm font-medium text-slate-200">
        {label}
      </Text>

      <View className="">
        <View className="absolute z-10 pr-4 border-r-2 top-7 left-4 border-slate-300">
          {leftIcon}
        </View>

        <View className="flex flex-row w-full pt-3">
          <TextInput
            editable={true}
            // only ios
            clearButtonMode="always"
            className={
              extraStyles +
              " shadow-sm w-full h-16 text-xl pl-[90px] pr-16 my-1 mb-2 border-2 rounded-lg " +
              (error ? "border-purple-400" : "border-slate-200")
            }
            placeholder={placeholder}
            onFocus={() => {
              setExtraStyles("bg-rose-200 text-black");
            }}
            onBlur={(e) => {
              setExtraStyles("bg-blue-500 text-slate-100");
              onBlur?.(e);
            }}
            keyboardType={type == "email" ? "email-address" : "default"}
            secureTextEntry={type == "secret"}
            value={value}
            {...otherProps}
          />
        </View>

        {rightIcon && (
          <View className="absolute z-10 pl-4 border-l-2 top-7 right-4 border-slate-300">
            {rightIcon}
          </View>
        )}

        {type == "secret" && (
          <TouchableOpacity
            onPress={() => setHideSecret(!hideSecret)}
            className="absolute z-10 pl-4 border-l-2 top-7 right-4 border-slate-300"
          >
            {hideSecret ? hideIcon : showIcon}
          </TouchableOpacity>
        )}
      </View>

      {errorText && (
        <Text className="text-right text-purple-600">
          {errorText.toString()}
        </Text>
      )}
    </>
  );
}

export function MyReadInput({
  name,
  min,
  rightIcon,
  leftIcon,
  hideIcon,
  showIcon,
  label,
  type,
  title,
  placeholder,
  pattern,
  children,
  value,
  onBlur,
  error,
  errorText,
  ...otherProps
}: InputProps) {
  const [hideSecret, setHideSecret] = useState(true);
  const [extraStyles, setExtraStyles] = useState("bg-blue-500");

  return (
    <>
      <Text className="pl-1.5 capitalize block text-sm font-medium text-slate-200">
        {label}
      </Text>

      <View className="">
        <View className="absolute z-10 pr-4 border-r-2 top-7 left-4 border-slate-300">
          {leftIcon}
        </View>

        <View className="flex flex-row w-full pt-3">
          <TextInput
            editable={false}
            // only ios
            clearButtonMode="always"
            className={
              extraStyles +
              " shadow-sm w-full h-16 text-xl pl-[90px] pr-16 my-1 mb-2 border-2 rounded-lg " +
              (error ? "border-purple-400" : "border-slate-200")
            }
            placeholder={placeholder}
            onFocus={() => {
              setExtraStyles("bg-rose-200 text-black");
            }}
            onBlur={(e) => {
              setExtraStyles("bg-blue-500 text-slate-100");
              onBlur?.(e);
            }}
            keyboardType={type == "email" ? "email-address" : "default"}
            secureTextEntry={type == "secret"}
            value={value}
            {...otherProps}
          />
        </View>

        {rightIcon && (
          <View className="absolute z-10 pl-4 border-l-2 top-7 right-4 border-slate-300">
            {rightIcon}
          </View>
        )}

        {type == "secret" && (
          <TouchableOpacity
            onPress={() => setHideSecret(!hideSecret)}
            className="absolute z-10 pl-4 border-l-2 top-7 right-4 border-slate-300"
          >
            {hideSecret ? hideIcon : showIcon}
          </TouchableOpacity>
        )}
      </View>

      {errorText && (
        <Text className="text-right text-purple-600">
          {errorText.toString()}
        </Text>
      )}
    </>
  );
}
