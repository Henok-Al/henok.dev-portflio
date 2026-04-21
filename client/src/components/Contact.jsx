import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { RiSendPlaneFill } from "react-icons/ri"
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa"
import { messagesAPI } from "../services/api"

const Contact = ({ loadingHook }) => {
  const form = useForm()
  const { register, reset, handleSubmit, formState } = form
  const { errors, isSubmitSuccessful, isSubmitting } = formState
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', null
  const [submitMessage, setSubmitMessage] = useState("")

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
      // Clear status after 5 seconds
      const timer = setTimeout(() => {
        setSubmitStatus(null)
        setSubmitMessage("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isSubmitSuccessful, reset])

  useEffect(() => {
    if (loadingHook) {
      loadingHook.setComponentLoading("contact", false)
    }
  }, [loadingHook.setComponentLoading])

  const submitHandler = async (data) => {
    const { name, email, subject, message } = data

    try {
      setSubmitStatus(null)
      setSubmitMessage("")

      const response = await messagesAPI.sendMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      })

      if (response.data.success) {
        setSubmitStatus("success")
        setSubmitMessage(
          response.data.message ||
            "Message sent successfully! I'll get back to you soon.",
        )
      } else {
        throw new Error(response.data.message || "Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setSubmitStatus("error")
      setSubmitMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to send message. Please try again later.",
      )
    }
  }

  return (
    <section
      id="contact"
      className="-mt-4 w-full bg-[#e7e7e7] p-10 transition-colors duration-300 dark:bg-gray-800"
    >
      <div>
        <h2 className="text-5xl capitalize text-[#ff4500] transition-colors duration-300 lg:ml-20 lg:p-8 lg:text-7xl dark:text-[#ff6b35]">
          Contact Me
        </h2>
        <p className="ml-1 text-sm capitalize transition-colors duration-300 lg:ml-28 lg:text-5xl dark:text-gray-300">
          Questions , Thoughts , Or Just Want To Say Hello
        </p>

        {/* Status Message */}
        {submitStatus && (
          <div
            className={`mx-auto mb-6 flex w-full max-w-4xl items-center gap-3 rounded-lg p-4 lg:ml-28 ${
              submitStatus === "success"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {submitStatus === "success" ? (
              <FaCheckCircle className="text-xl" />
            ) : (
              <FaExclamationTriangle className="text-xl" />
            )}
            <span className="text-sm lg:text-base">{submitMessage}</span>
          </div>
        )}

        <form
          noValidate
          onSubmit={handleSubmit(submitHandler)}
          className="mx-4 my-8 flex w-full max-w-6xl flex-col justify-center gap-6 sm:mx-8 lg:mx-20 lg:ml-28 md:gap-5"
        >
          <div className="w-full">
            <input
              className={`h-10 w-full px-4 py-2 text-base font-medium shadow-md transition-colors duration-300 rounded-md border border-gray-300 focus:border-[#ff4500] focus:outline-none focus:ring-2 focus:ring-[#ff4500]/20 lg:text-lg lg:px-6 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 dark:border-gray-600 dark:focus:border-[#ff6b35] dark:focus:ring-[#ff6b35]/20 ${
                errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
              }`}
              type="text"
              placeholder="Enter Your Name *"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Name must be less than 50 characters",
                },
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <input
              className={`h-10 w-full px-4 py-2 text-base font-medium shadow-md transition-colors duration-300 rounded-md border border-gray-300 focus:border-[#ff4500] focus:outline-none focus:ring-2 focus:ring-[#ff4500]/20 lg:text-lg lg:px-6 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 dark:border-gray-600 dark:focus:border-[#ff6b35] dark:focus:ring-[#ff6b35]/20 ${
                errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
              }`}
              type="email"
              placeholder="Enter Your Email *"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <input
              className={`h-10 w-full px-4 py-2 text-base font-medium shadow-md transition-colors duration-300 rounded-md border border-gray-300 focus:border-[#ff4500] focus:outline-none focus:ring-2 focus:ring-[#ff4500]/20 lg:text-lg lg:px-6 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 dark:border-gray-600 dark:focus:border-[#ff6b35] dark:focus:ring-[#ff6b35]/20 ${
                errors.subject ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
              }`}
              type="text"
              placeholder="Enter Your Subject *"
              {...register("subject", {
                required: "Subject is required",
                minLength: {
                  value: 3,
                  message: "Subject must be at least 3 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Subject must be less than 100 characters",
                },
              })}
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <textarea
              className={`w-full px-4 py-3 text-base font-medium shadow-md transition-colors duration-300 rounded-md border border-gray-300 focus:border-[#ff4500] focus:outline-none focus:ring-2 focus:ring-[#ff4500]/20 lg:text-lg lg:px-6 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 dark:border-gray-600 dark:focus:border-[#ff6b35] dark:focus:ring-[#ff6b35]/20 resize-vertical ${
                errors.message ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
              }`}
              rows="8"
              placeholder="Enter Your Message *"
              {...register("message", {
                required: "Message is required",
                minLength: {
                  value: 10,
                  message: "Message must be at least 10 characters",
                },
                maxLength: {
                  value: 1000,
                  message: "Message must be less than 1000 characters",
                },
              })}
            ></textarea>
            {errors.message && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.message.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`relative z-10 flex w-fit items-center justify-center gap-3 px-6 py-3 text-lg font-medium text-white shadow-lg transition-all duration-300 rounded-md lg:px-9 lg:text-xl ${
              isSubmitting
                ? "cursor-not-allowed bg-gray-400 dark:bg-gray-600"
                : "bg-[#ff4500] hover:bg-[#e63e00] hover:shadow-xl transform hover:scale-105 dark:bg-[#ff6b35] dark:hover:bg-[#ff5722]"
            }`}
          >
            <p>{isSubmitting ? "Sending..." : "Send Message"}</p>
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <RiSendPlaneFill />
            )}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact
