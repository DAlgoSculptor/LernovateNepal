"use client"

import { useState, useEffect } from "react"
import type { Institution } from "@/lib/institution-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface InstitutionEditDialogProps {
  institution: Institution | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onInstitutionUpdated: (institution: Institution) => void
}

interface EditFormData {
  name: string
  email: string
  phone: string
  website: string
  address: string
  logoUrl: string
}

export function InstitutionEditDialog({
  institution,
  open,
  onOpenChange,
  onInstitutionUpdated,
}: InstitutionEditDialogProps) {
  const [formData, setFormData] = useState<EditFormData>({
    name: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    logoUrl: "",
  })
  const [formErrors, setFormErrors] = useState<Partial<EditFormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (institution) {
      setFormData({
        name: institution.name,
        email: institution.email,
        phone: institution.phone || "",
        website: institution.website || "",
        address: institution.address,
        logoUrl: institution.logoUrl || "",
      })
      setFormErrors({})
    }
  }, [institution])

  const validateForm = (): boolean => {
    const errors: Partial<EditFormData> = {}

    if (!formData.name.trim()) {
      errors.name = "Institution name is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required"
    }

    if (formData.phone && !/^\d+$/.test(formData.phone)) {
      errors.phone = "Phone number should contain only digits"
    }

    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      errors.website = "Please enter a valid URL (e.g., https://example.com)"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleUpdateInstitution = async () => {
    if (!institution || !validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/institutions/${institution.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        onInstitutionUpdated(result.data)
        onOpenChange(false)
        toast({
          title: "Success!",
          description: "Institution updated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update institution.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating institution:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!institution) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-heading">Edit Institution</DialogTitle>
          <DialogDescription>Update the information for {institution.name}.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Institution Name *</Label>
            <Input
              id="edit-name"
              placeholder="e.g., Kathmandu Public School"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className={formErrors.name ? "border-destructive" : ""}
            />
            {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">Email Address *</Label>
            <Input
              id="edit-email"
              type="email"
              placeholder="admin@institution.edu.np"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className={formErrors.email ? "border-destructive" : ""}
            />
            {formErrors.email && <p className="text-sm text-destructive">{formErrors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone Number</Label>
            <Input
              id="edit-phone"
              placeholder="9800000000"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              className={formErrors.phone ? "border-destructive" : ""}
            />
            {formErrors.phone && <p className="text-sm text-destructive">{formErrors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-website">Website</Label>
            <Input
              id="edit-website"
              placeholder="https://institution.edu.np"
              value={formData.website}
              onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
              className={formErrors.website ? "border-destructive" : ""}
            />
            {formErrors.website && <p className="text-sm text-destructive">{formErrors.website}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-address">Address *</Label>
            <Input
              id="edit-address"
              placeholder="e.g., Bagbazar, Kathmandu"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              className={formErrors.address ? "border-destructive" : ""}
            />
            {formErrors.address && <p className="text-sm text-destructive">{formErrors.address}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-logo">Logo URL</Label>
            <Input
              id="edit-logo"
              placeholder="https://example.com/logo.png"
              value={formData.logoUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, logoUrl: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateInstitution} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Institution"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
