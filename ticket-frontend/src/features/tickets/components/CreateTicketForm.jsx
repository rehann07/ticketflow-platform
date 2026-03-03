"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import api from "@/api/axiosConfig"
import { useNavigate } from "react-router-dom"

// hadcn Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters.")
    .max(100, "Title cannot exceed 100 characters."),
  
  description: z.string()
    .min(10, "Description must be at least 10 characters.")
    .max(500, "Description cannot exceed 500 characters."),
})

export function CreateTicketForm({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
    },
  })

  async function onSubmit(data) {
    setLoading(true)
    setServerError("")

    try {
      await api.post("/tickets", data)

      if (onClose) onClose()

    } catch (err) {
      console.error(err)
      setServerError("Failed to create ticket. Please try again.")
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="grid gap-4 py-4">
        {serverError && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                {serverError}
            </div>
        )}

        <form id="create-ticket-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Title */}
            <div className="grid gap-2">
                <Label htmlFor="title">Ticket Subject</Label>
                <Input
                  {...form.register("title")}
                  id="title"
                  placeholder="Enter the subject"
                  disabled={loading}
                />
                {form.formState.errors.title && (
                    <p className="text-sm font-medium text-red-500">
                        {form.formState.errors.title.message}
                    </p>
                )}
            </div>

            {/* Description */}
            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <div className="relative">
                    <Textarea
                      {...form.register("description")}
                      id="description"
                      placeholder="Enter the description"
                      className="min-h-[100px] resize-none"
                      disabled={loading}
                    />
                    <div className="text-xs text-muted-foreground text-right mt-1">
                        {form.watch("description")?.length || 0}/500
                    </div>
                </div>
                {form.formState.errors.description && (
                    <p className="text-sm font-medium text-red-500">
                        {form.formState.errors.description.message}
                    </p>
                )}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4">
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onClose ? onClose() : navigate("/dashboard")}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Submit Ticket"}
                </Button>
            </div>

        </form>
    </div>
  )
}