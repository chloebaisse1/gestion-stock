import { prisma } from "@/utils/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const books = await prisma.book.findMany()
    return NextResponse.json(books, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Error fetching book" }, { status: 500 })
  }
}

export async function POST(request: NextResponse) {
  try {
    const data = await request.json()

    const book = await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        reference: data.reference,
        price: data.price,
        stock: data.stock,
      },
    })
    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error creating book" }, { status: 500 })
  }
}
