'use client';

import React, { useState, useEffect } from 'react';
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
  const { messages, locale } = useLanguage();
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

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Contact Form Data:', data);
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Close drawer after success message
    setTimeout(() => {
      setShowSuccess(false);
      reset();
      onOpenChange(false);
    }, 2500);
  };

  const breadcrumbText = locale === 'es' ? 'CONTACTO > PROGRAMAR CONSULTA' : 'CONTACT > SCHEDULE CONSULTATION';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
            </Dialog.Overlay>

            {/* Drawer Panel */}
            <Dialog.Content asChild>
              <motion.div
                className="fixed right-0 top-0 h-screen w-full sm:w-[480px] bg-white shadow-2xl z-50 focus:outline-none"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ 
                  type: 'spring', 
                  damping: 30, 
                  stiffness: 300,
                  duration: 0.3 
                }}
              >
                <div className="h-full flex flex-col">
                  {/* Fixed Header */}
                  <div className="flex-shrink-0 border-b border-gray-100">
                    <div className="px-8 py-6">
                      {/* Close button */}
                      <Dialog.Close asChild>
                        <button
                          className="absolute right-6 top-6 rounded-md p-2 text-gray-400 transition-all hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                          aria-label="Close"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </Dialog.Close>

                      {/* Breadcrumb */}
                      <div className="mb-4">
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                          {breadcrumbText}
                        </span>
                      </div>

                      {/* Title and Subtitle */}
                      <div>
                        <Dialog.Title className="text-3xl font-bold text-gray-900 mb-2">
                          {messages.contactModal.title}
                        </Dialog.Title>
                        <Dialog.Description className="text-base text-gray-500">
                          {messages.contactModal.subtitle}
                        </Dialog.Description>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="px-8 py-8">
                      {/* Success Message */}
                      <AnimatePresence>
                        {showSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-6 overflow-hidden"
                          >
                            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                              <p className="text-green-800 text-sm font-medium">
                                {messages.contactModal.successMessage}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Form */}
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Full Name */}
                        <div>
                          <label 
                            htmlFor="fullName" 
                            className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2"
                          >
                            {messages.contactModal.form.fullName} *
                          </label>
                          <input
                            {...register('fullName')}
                            type="text"
                            id="fullName"
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                            placeholder={messages.contactModal.form.fullNamePlaceholder}
                            disabled={isSubmitting}
                          />
                          {errors.fullName && (
                            <motion.p 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-2 text-xs text-red-600"
                            >
                              {errors.fullName.message}
                            </motion.p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label 
                            htmlFor="email" 
                            className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2"
                          >
                            {messages.contactModal.form.email} *
                          </label>
                          <input
                            {...register('email')}
                            type="email"
                            id="email"
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                            placeholder={messages.contactModal.form.emailPlaceholder}
                            disabled={isSubmitting}
                          />
                          {errors.email && (
                            <motion.p 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-2 text-xs text-red-600"
                            >
                              {errors.email.message}
                            </motion.p>
                          )}
                        </div>

                        {/* Company */}
                        <div>
                          <label 
                            htmlFor="company" 
                            className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2"
                          >
                            {messages.contactModal.form.company} *
                          </label>
                          <input
                            {...register('company')}
                            type="text"
                            id="company"
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                            placeholder={messages.contactModal.form.companyPlaceholder}
                            disabled={isSubmitting}
                          />
                          {errors.company && (
                            <motion.p 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-2 text-xs text-red-600"
                            >
                              {errors.company.message}
                            </motion.p>
                          )}
                        </div>

                        {/* Phone */}
                        <div>
                          <label 
                            htmlFor="phone" 
                            className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2"
                          >
                            {messages.contactModal.form.phone}
                          </label>
                          <input
                            {...register('phone')}
                            type="tel"
                            id="phone"
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                            placeholder={messages.contactModal.form.phonePlaceholder}
                            disabled={isSubmitting}
                          />
                        </div>

                        {/* Preferred Time */}
                        <div>
                          <label 
                            htmlFor="preferredTime" 
                            className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2"
                          >
                            {messages.contactModal.form.preferredTime}
                          </label>
                          <select
                            {...register('preferredTime')}
                            id="preferredTime"
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none bg-white text-gray-900"
                            disabled={isSubmitting}
                          >
                            <option value="flexible">{messages.contactModal.form.timeOptions.flexible}</option>
                            <option value="morning">{messages.contactModal.form.timeOptions.morning}</option>
                            <option value="afternoon">{messages.contactModal.form.timeOptions.afternoon}</option>
                          </select>
                        </div>

                        {/* Message */}
                        <div>
                          <label 
                            htmlFor="message" 
                            className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2"
                          >
                            {messages.contactModal.form.message}
                          </label>
                          <textarea
                            {...register('message')}
                            id="message"
                            rows={5}
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-400"
                            placeholder={messages.contactModal.form.messagePlaceholder}
                            disabled={isSubmitting}
                          />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-6 py-4 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                          >
                            {isSubmitting ? (
                              <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {messages.contactModal.form.submitting}
                              </span>
                            ) : (
                              messages.contactModal.form.submit
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}