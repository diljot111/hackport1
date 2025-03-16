"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react"; // For a loading spinner
import axios from "axios";

type HackathonFormData = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  prizePool: string;
  location?: string;
  organizerId: string;
  image: string;
};

export default function HackathonForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HackathonFormData>();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: HackathonFormData) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const formattedData = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        prizePool: Number(data.prizePool), // Convert prizePool to a number
      };

      console.log("Submitting data:", formattedData);

      // ✅ Correct Axios Request
      const response = await axios.post("/api/auth/hackathon", formattedData);

      if (response.status !== 201) {
        throw new Error(response.data.error || "Failed to create hackathon");
      }

      reset();
      alert("Hackathon created successfully!");
    } catch (error: any) {
      console.error("Submission error:", error);
      setErrorMessage(error.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }} 
      className="flex flex-col md:flex-row items-center justify-center gap-8 p-8 md:p-16"
    >
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Create Hackathon</h2>

        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-2">{errorMessage}</p>
        )}

        <Label htmlFor="name">Hackathon Name</Label>
        <Input id="name" {...register("name", { required: "Required" })} placeholder="Enter name" className="mb-2" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        <Label htmlFor="description">Description</Label>
        <textarea 
          id="description" 
          {...register("description", { required: "Required" })} 
          className="w-full p-2 mb-2 border rounded text-black"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

        <Label htmlFor="startDate">Start Date</Label>
        <Input id="startDate" type="date" {...register("startDate", { required: "Required" })} className="mb-2" />
        {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}

        <Label htmlFor="endDate">End Date</Label>
        <Input id="endDate" type="date" {...register("endDate", { required: "Required" })} className="mb-2" />
        {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}

        <Label htmlFor="prizePool">Prize Pool</Label>
        <Input 
          id="prizePool"
          type="number"
          {...register("prizePool", { required: "Prize pool is required", valueAsNumber: true })}
          className="mb-2"
        />
        {errors.prizePool && <p className="text-red-500 text-sm">{errors.prizePool.message}</p>}

        <Label htmlFor="location">Location</Label>
        <Input id="location" {...register("location")} className="mb-2" />

        <Label htmlFor="organizerId">Organizer ID</Label>
        <Input id="organizerId" {...register("organizerId", { required: "Required" })} className="mb-2" />
        {errors.organizerId && <p className="text-red-500 text-sm">{errors.organizerId.message}</p>}

        <Label htmlFor="image">Image URL</Label>
        <Input id="image" {...register("image", { required: "Required" })} className="mb-4" />
        {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md w-full flex items-center justify-center"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Create Hackathon"}
        </button>
      </form>
    </motion.div>
  );
}
