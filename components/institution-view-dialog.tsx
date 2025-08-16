"use client"

import type { Institution } from "@/lib/institution-store"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Building2, Mail, Phone, Globe, MapPin, Calendar } from "lucide-react"

interface InstitutionViewDialogProps {
  institution: Institution | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InstitutionViewDialog({ institution, open, onOpenChange }: InstitutionViewDialogProps) {
  if (!institution) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-heading">Institution Details</DialogTitle>
          <DialogDescription>View complete information about this educational institution.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Institution Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={institution.logoUrl || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">
                {institution.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-heading text-xl font-semibold">{institution.name}</h3>
              <Badge variant="secondary" className="mt-1">
                <Building2 className="mr-1 h-3 w-3" />
                Educational Institution
              </Badge>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Contact Information</h4>

            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{institution.email}</span>
              </div>

              {institution.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{institution.phone}</span>
                </div>
              )}

              {institution.website && (
                <div className="flex items-center space-x-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={institution.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:underline"
                  >
                    {institution.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{institution.address}</span>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">System Information</h4>

            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="text-muted-foreground">Created on </span>
                <span>{formatDate(institution.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="text-muted-foreground">Institution ID: </span>
                <code className="bg-muted px-1 py-0.5 rounded text-xs">{institution.id}</code>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
