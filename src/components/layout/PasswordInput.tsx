"use client";

import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

type PasswordInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  enableValidation?: boolean;
  onValidate?: (isValid: boolean) => void;
};

const PasswordInput = ({
  value: password,
  onChange,
  enableValidation = false,
  onValidate,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [isLongText, setIsLongText] = useState(false);
  const [startWithCapital, setStartWithCapital] = useState(false);
  const [containsNumber, setContainsNumber] = useState(false);

  useEffect(() => {
    if (!enableValidation || !onValidate) return;

    const isLong = password.length >= 8;
    const startCapital = /[A-Z]/.test(password);
    const numberInput = /[0-9]/.test(password);
    const isValid = isLongText && startWithCapital && containsNumber;

    setIsLongText(isLong);
    setStartWithCapital(startCapital);
    setContainsNumber(numberInput);

    if (onValidate) {
      onValidate(isValid);
    }
  }, [
    password,
    onValidate,
    enableValidation,
    isLongText,
    startWithCapital,
    containsNumber,
  ]);

  return (
    <div className="relative">
      <label
        htmlFor="password"
        className="block text-sm font-bold text-gray-700 mb-1"
      >
        Password
      </label>
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={onChange}
        onFocus={() => setShowRules(true)}
        onBlur={() => setShowRules(false)}
        className={
          enableValidation
            ? "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            : "w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        }
        placeholder={enableValidation ? "Create a strong password" : ""}
      />

      {enableValidation && showRules && (
        <ul id="passwordRules">
          <li id="lengthRule" className="text-gray-400 invalid">
            Minimal 8 karakter {isLongText ? "✅" : "❌"}
          </li>
          <li id="capitalRule" className="text-gray-400 invalid">
            Huruf pertama kapital {startWithCapital ? "✅" : "❌"}
          </li>
          <li id="numberRule" className="text-gray-400 invalid">
            Mengandung angka {containsNumber ? "✅" : "❌"}
          </li>
        </ul>
      )}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-9 text-gray-600"
      >
        {showPassword ? (
          <EyeSlashIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
