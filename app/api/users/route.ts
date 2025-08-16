import { type NextRequest, NextResponse } from "next/server"
import { userStore } from "@/lib/user-store"

export async function GET() {
  try {
    const result = await userStore.getUsers()

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      })
    } else {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    const result = await userStore.createUser(userData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: "User created successfully",
      })
    } else {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
