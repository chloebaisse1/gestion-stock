import { bookSchema } from "@/schemas/productSchema"
import { BookFormData, BookModalProps } from "@/types/types"
import { useEffect, useState } from "react"
import * as yup from "yup"

const initialFormData: BookFormData = {
  title: "",
  author: "",
  reference: "",
  price: 0,
  stock: 0,
}

export default function BookModal({
  isOpen,
  onClose,
  onSubmit,
  bookToEdit,
}: BookModalProps) {
  const [formData, setFormData] = useState<BookFormData>(initialFormData)
  const [errors, setErrors] = useState<
    Partial<Record<keyof BookFormData, string>>
  >({})

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title,
        author: bookToEdit.author,
        reference: bookToEdit.reference,
        price: bookToEdit.price,
        stock: bookToEdit.stock,
      })
    } else {
      setFormData(initialFormData)
    }
  }, [bookToEdit, isOpen])

  const handleClose = () => {
    setFormData(initialFormData)
    setErrors({})
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const validatedData = await bookSchema.validate(formData, {
        abortEarly: false,
      })
      onSubmit(validatedData)
      handleClose()
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: Partial<Record<keyof BookFormData, string>> = {}
        error.inner.forEach((err: yup.ValidationError) => {
          if (err.path) {
            newErrors[err.path as keyof BookFormData] = err.message
          }
        })
        setErrors(newErrors)
      }
    }
  }

  if (!isOpen) {
    return null
  }

  return <div>BookModal</div>
}
