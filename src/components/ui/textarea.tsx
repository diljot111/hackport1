"use client";

import React from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";

interface HackathonFormData extends FieldValues {
  // Define the fields for HackathonFormData
  [key: string]: any;
}

interface TextAreaProps {
  id: string;
  placeholder: string;
//   register: UseFormRegister<FieldValues>; 
  register: UseFormRegister<HackathonFormData>; 
  className?: string;
}

export default function TextArea({ id, placeholder, register, className }: TextAreaProps) {
  return (
    <textarea
      id={id}
      {...register(id, { required: `${placeholder} is required` })} // Correct usage
      placeholder={placeholder}
      className={`w-full rounded-lg p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-900 shadow-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out resize-none min-h-[120px] ${className}`}
    />
  );
}
