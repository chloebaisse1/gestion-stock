"use client"
import { Book, BookFormData } from "@/types/types"
import { useEffect, useState } from "react"

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [bookToEdit, setBookToEdit] = useState<Book | undefined>(undefined)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books")
      const data = await response.json()
      setBooks(data)
    } catch (error) {
      console.error("Error fetching books", error)
    }
  }

  const handleAddBook = async (data: BookFormData) => {
    setIsLoading(true)

    try {
      await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      await fetchBooks()
    } catch (error) {
      console.error("Error creating book, error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBook = async (id: number) => {
    if (!window.confirm("Êtes-vous sur de vouloir supprimer le livre")) {
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Error deleting book")
      }

      await fetchBooks()
    } catch (error) {
      console.error("Error lors de la suppression du livre")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditBook = async (data: BookFormData) => {
    setIsLoading(true)

    try {
      await fetch(`/api/books/${bookToEdit?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      await fetchBooks()
      setBookToEdit(undefined)
    } catch (error) {
      console.error("Error editing book", error)
    } finally {
      setIsLoading(false)
    }
  }

  const openEditModal = (book: Book) => {
    setBookToEdit(book)
    setIsModalOpen(true)
  }

  return <></>
}
