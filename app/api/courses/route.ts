import { type NextRequest, NextResponse } from "next/server"
import { courseStore } from "@/lib/course-store"

export async function GET() {
  try {
    const result = await courseStore.getCourses()

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
    const courseData = await request.json()

    const result = await courseStore.createCourse(courseData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: "Course created successfully",
      })
    } else {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
