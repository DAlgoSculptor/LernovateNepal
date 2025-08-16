import { type NextRequest, NextResponse } from "next/server"
import { userStore } from "@/lib/user-store"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userData = await request.json()
    const result = await userStore.updateUser(params.id, userData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: "User updated successfully",
      })
    } else {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await userStore.deleteUser(params.id)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "User deleted successfully",
      })
    } else {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
