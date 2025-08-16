import { NextResponse } from "next/server"
import { institutionStore } from "@/lib/institution-store"

export async function GET() {
  try {
    const institutions = institutionStore.getAll()

    return NextResponse.json({
      status: 200,
      data: institutions,
      total: institutions.length,
    })
  } catch (error) {
    console.error("Error fetching institutions:", error)
    return NextResponse.json(
      {
        status: 500,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, website, address, logoUrl } = body

    // Validate required fields
    if (!name || !email || !address) {
      return NextResponse.json(
        {
          status: 400,
          message: "Missing required fields: name, email, and address are required",
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          status: 400,
          message: "Invalid email format",
        },
        { status: 400 },
      )
    }

    // Check if email already exists
    if (institutionStore.emailExists(email)) {
      return NextResponse.json(
        {
          status: 400,
          message: "An institution with this email already exists",
        },
        { status: 400 },
      )
    }

    // Validate phone number if provided
    if (phone && !/^\d+$/.test(phone)) {
      return NextResponse.json(
        {
          status: 400,
          message: "Phone number should contain only digits",
        },
        { status: 400 },
      )
    }

    // Validate website URL if provided
    if (website && !/^https?:\/\/.+\..+/.test(website)) {
      return NextResponse.json(
        {
          status: 400,
          message: "Please enter a valid URL (e.g., https://example.com)",
        },
        { status: 400 },
      )
    }

    const newInstitution = institutionStore.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
      website: website?.trim(),
      address: address.trim(),
      logoUrl: logoUrl?.trim() || "/generic-institution-logo.png",
    })

    return NextResponse.json({
      status: 201,
      message: "Institution created successfully",
      data: newInstitution,
    })
  } catch (error) {
    console.error("Error creating institution:", error)
    return NextResponse.json(
      {
        status: 500,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
