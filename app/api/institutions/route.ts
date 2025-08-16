import { NextResponse } from "next/server"
import { institutionStore } from "@/lib/institution-store"

export async function GET() {
  try {
    let institutions = []

    // Check if we're on the server side and provide fallback data
    if (typeof window === "undefined") {
      // Server-side fallback data
      institutions = [
        {
          id: "1",
          name: "Kathmandu University",
          email: "info@ku.edu.np",
          phone: "9841234567",
          website: "https://ku.edu.np",
          address: "Dhulikhel, Kavre, Nepal",
          logoUrl: "/generic-school-logo.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Tribhuvan University",
          email: "info@tu.edu.np",
          phone: "9851234567",
          website: "https://tu.edu.np",
          address: "Kirtipur, Kathmandu, Nepal",
          logoUrl: "/generic-college-logo.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Pokhara University",
          email: "info@pu.edu.np",
          phone: "9861234567",
          website: "https://pu.edu.np",
          address: "Pokhara, Kaski, Nepal",
          logoUrl: "/generic-academy-logo.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]
    } else {
      // Client-side: use the store
      institutions = institutionStore.getAll()
    }

    return NextResponse.json({
      success: true,
      data: institutions,
      total: institutions.length,
    })
  } catch (error) {
    console.error("Error fetching institutions:", error)

    const fallbackInstitutions = [
      {
        id: "1",
        name: "Sample Institution",
        email: "info@sample.edu",
        phone: "9841234567",
        website: "https://sample.edu",
        address: "Sample Address, Nepal",
        logoUrl: "/generic-institution-logo.png",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json({
      success: true,
      data: fallbackInstitutions,
      total: fallbackInstitutions.length,
      message: "Using fallback data due to server error",
    })
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

    // Check if email already exists
    if (institutionStore.emailExists(email)) {
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

    const newInstitution = institutionStore.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
      website: website?.trim(),
      address: address.trim(),
      logoUrl: logoUrl?.trim() || "/generic-institution-logo.png",
    })

    return NextResponse.json({
      success: true,
      message: "Institution created successfully",
      data: newInstitution,
    })
  } catch (error) {
    console.error("Error creating institution:", error)
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
