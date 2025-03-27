import { prisma } from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params

    const bookId = parseInt(id)

    if (isNaN(bookId)) {
      return NextResponse.json({ error: "Invalid book id" }, { status: 400 })
    }

    await prisma.book.delete({
      where: {
        id: bookId,
      },
    })

    return NextResponse.json({ message: "Book deleted" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting book" }, { status: 500 })
  }
}
