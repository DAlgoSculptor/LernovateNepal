import { type NextRequest, NextResponse } from "next/server"
import { courseStore } from "@/lib/course-store"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const courseData = await request.json()
    const result = await courseStore.updateCourse(params.id, courseData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: "Course updated successfully",
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
    const result = await courseStore.deleteCourse(params.id)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Course deleted successfully",
      })
    } else {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
