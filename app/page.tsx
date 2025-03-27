"use client"
import { Book, BookFormData } from "@/types/types"
import { useEffect, useState } from "react"
import BookModal from "./components/BookModal"
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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-500">
            Gestion des stocks - Librairie
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            Ajouter un livre
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-gray-100">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Titre
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Auteur
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Référence
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Prix unitaire
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 bg-white">
                {books.map((book) => (
                  <tr
                    key={book.id}
                    className="hover:bg-gray-200 transition-all duration-300"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {book.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {book.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {book.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {book.price.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          book.stock <= 5
                            ? "bg-red-100 text-red-800"
                            : book.stock <= 10
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-grenn-100 text-green-800"
                        }`}
                      >
                        {book.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(book)}
                          className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
                          disabled={isLoading}
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book.id)}
                          className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-all duration-300 disabled:opacity-50"
                          disabled={isLoading}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <BookModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setBookToEdit(undefined)
          }}
          onSubmit={bookToEdit ? handleEditBook : handleAddBook}
          bookToEdit={bookToEdit}
        />
      </div>
    </div>
  )
}
