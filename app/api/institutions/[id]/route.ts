import { NextResponse } from "next/server"
import { institutionStore } from "@/lib/institution-store"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const institution = institutionStore.getById(params.id)

    if (!institution) {
      return NextResponse.json(
        {
          success: false,
          message: "Institution not found",
          data: null,
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: institution,
      message: "Institution retrieved successfully",
    })
  } catch (error) {
    console.error("Error fetching institution:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        data: null,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, email, phone, website, address, logoUrl } = body

    // Validate required fields
    if (!name || !email || !address) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: name, email, and address are required",
          data: null,
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
          data: null,
        },
        { status: 400 },
      )
    }

    // Check if email already exists (excluding current institution)
    if (institutionStore.emailExists(email, params.id)) {
      return NextResponse.json(
        {
          success: false,
          message: "An institution with this email already exists",
          data: null,
        },
        { status: 400 },
      )
    }

    // Validate phone number if provided
    if (phone && !/^\d+$/.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number should contain only digits",
          data: null,
        },
        { status: 400 },
      )
    }

    // Validate website URL if provided
    if (website && !/^https?:\/\/.+\..+/.test(website)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid URL (e.g., https://example.com)",
          data: null,
        },
        { status: 400 },
      )
    }

    const updatedInstitution = institutionStore.update(params.id, {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
      website: website?.trim(),
      address: address.trim(),
      logoUrl: logoUrl?.trim(),
    })

    if (!updatedInstitution) {
      return NextResponse.json(
        {
          success: false,
          message: "Institution not found",
          data: null,
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Institution updated successfully",
      data: updatedInstitution,
    })
  } catch (error) {
    console.error("Error updating institution:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        data: null,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const success = institutionStore.delete(params.id)

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Institution not found",
          data: null,
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Institution deleted successfully",
      data: null,
    })
  } catch (error) {
    console.error("Error deleting institution:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        data: null,
      },
      { status: 500 },
    )
  }
}
