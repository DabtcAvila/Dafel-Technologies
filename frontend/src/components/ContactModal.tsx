'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ValidationMessages = {
  contactModal: {
    validation: {
      nameRequired: string;
      emailRequired: string;
      emailInvalid: string;
      companyRequired: string;
    };
  };
};

const createContactSchema = (messages: ValidationMessages) => z.object({
  fullName: z.string().min(1, messages.contactModal.validation.nameRequired),
  email: z.string()
    .min(1, messages.contactModal.validation.emailRequired)
    .email(messages.contactModal.validation.emailInvalid),
  company: z.string().min(1, messages.contactModal.validation.companyRequired),
  phone: z.string().optional(),
  message: z.string().optional(),
  preferredTime: z.enum(['morning', 'afternoon', 'flexible']).optional(),
});

type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;

export default function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const { messages } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const contactSchema = createContactSchema(messages as ValidationMessages);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      preferredTime: 'flexible'
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Contact Form Data:', data);
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Close modal after success message
    setTimeout(() => {
      setShowSuccess(false);
      reset();
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl"
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.2, type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="relative p-6 sm:p-8">
                  {/* Close button */}
                  <Dialog.Close asChild>
                    <button
                      className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                      aria-label="Close"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </Dialog.Close>

                  {/* Header */}
                  <div className="mb-6">
                    <Dialog.Title className="text-2xl font-light text-gray-900">
                      {messages.contactModal.title}
                    </Dialog.Title>
                    <Dialog.Description className="mt-2 text-sm text-gray-600">
                      {messages.contactModal.subtitle}
                    </Dialog.Description>
                  </div>

                  {/* Success Message */}
                  <AnimatePresence>
                    {showSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <p className="text-green-800 text-sm font-medium">
                          {messages.contactModal.successMessage}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form */}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        {messages.contactModal.form.fullName} *
                      </label>
                      <input
                        {...register('fullName')}
                        type="text"
                        id="fullName"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                        placeholder={messages.contactModal.form.fullNamePlaceholder}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        {messages.contactModal.form.email} *
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                        placeholder={messages.contactModal.form.emailPlaceholder}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Company */}
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                        {messages.contactModal.form.company} *
                      </label>
                      <input
                        {...register('company')}
                        type="text"
                        id="company"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                        placeholder={messages.contactModal.form.companyPlaceholder}
                      />
                      {errors.company && (
                        <p className="mt-1 text-xs text-red-600">{errors.company.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        {messages.contactModal.form.phone}
                      </label>
                      <input
                        {...register('phone')}
                        type="tel"
                        id="phone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                        placeholder={messages.contactModal.form.phonePlaceholder}
                      />
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-1">
                        {messages.contactModal.form.preferredTime}
                      </label>
                      <select
                        {...register('preferredTime')}
                        id="preferredTime"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none bg-white"
                      >
                        <option value="flexible">{messages.contactModal.form.timeOptions.flexible}</option>
                        <option value="morning">{messages.contactModal.form.timeOptions.morning}</option>
                        <option value="afternoon">{messages.contactModal.form.timeOptions.afternoon}</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        {messages.contactModal.form.message}
                      </label>
                      <textarea
                        {...register('message')}
                        id="message"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
                        placeholder={messages.contactModal.form.messagePlaceholder}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-3 pt-4">
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all"
                        >
                          {messages.contactModal.form.cancel}
                        </button>
                      </Dialog.Close>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {isSubmitting ? messages.contactModal.form.submitting : messages.contactModal.form.submit}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}