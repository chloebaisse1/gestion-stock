import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

// DELETE
export async function DELETE(request: NextRequest, context: any) {
  const id = context.params.id;
  const bookId = parseInt(id);

  if (isNaN(bookId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  try {
    await prisma.book.delete({
      where: { id: bookId },
    });

    return NextResponse.json({ message: "Livre supprimé avec succès" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}

// PUT
export async function PUT(request: NextRequest, context: any) {
  const id = context.params.id;
  const bookId = parseInt(id);

  if (isNaN(bookId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  try {
    const data = await request.json();

    const book = await prisma.book.update({
      where: { id: bookId },
      data: {
        title: data.title,
        author: data.author,
        reference: data.reference,
        price: data.price,
        stock: data.stock,
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la modification" },
      { status: 500 }
    );
  }
}
