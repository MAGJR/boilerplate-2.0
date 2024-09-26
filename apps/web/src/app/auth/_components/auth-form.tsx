'use client'

import React from 'react'

import { Logo } from '@/components/logo'
import { toast } from '@design-system/react/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendGTMEvent } from '@next/third-parties/google'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { EmailForm } from './email-form'
import { SocialLoginButtons } from './social-login-buttons'
import { TermsOfUse } from './terms-of-use'

const authFormSchema = z.object({
  email: z.string().email(),
})

type AuthFormSchema = z.infer<typeof authFormSchema>

export function AuthForm() {
  const form = useForm({
    resolver: zodResolver(authFormSchema),
  })

  const [isLoading, setIsLoading] = React.useState({
    google: false,
    github: false,
    email: false,
  })

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }))
    try {
      await signIn(provider)
      sendGTMEvent({ event: 'register', value: 'lead' })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading((prev) => ({ ...prev, [provider]: false }))
    }
  }

  const handleEmailSubmit = form.handleSubmit(async (data: AuthFormSchema) => {
    setIsLoading((prev) => ({ ...prev, email: true }))
    try {
      await signIn('email', { email: data.email, redirect: false })
      sendGTMEvent({ event: 'register', value: 'lead' })
      toast({
        title: 'Email sent',
        description: `We have sent an email to ${data.email} with a verification code.`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error sending email',
        description: `An error occurred while sending the email to ${data.email}.`,
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, email: false }))
    }
  })

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <Logo onlyIcon className="h-12 mb-4" />

      <EmailForm
        form={form as any}
        onSubmit={handleEmailSubmit}
        isLoading={isLoading.email}
      />

      <SocialLoginButtons
        onSocialLogin={handleSocialLogin}
        isLoading={isLoading}
      />

      <TermsOfUse />
    </div>
  )
}
