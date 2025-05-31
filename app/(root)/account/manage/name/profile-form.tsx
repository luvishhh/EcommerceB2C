'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { UserNameSchema } from '@/lib/validator'
import { updateUserName } from '@/lib/actions/user.action'

export const ProfileForm = () => {
  const router = useRouter()
  const { data: session, update } = useSession()
  const form = useForm<z.infer<typeof UserNameSchema>>({
    resolver: zodResolver(UserNameSchema),
    defaultValues: {
      name: session?.user?.name!,
    },
  })

  async function onSubmit(values: z.infer<typeof UserNameSchema>) {
    const res = await updateUserName(values)
    if (!res.success) {
      toast.error(res.message)
      return
    }
    const { data, message } = res
    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: data.name,
      },
    }
    await update(newSession)
    toast.success(message)
    router.push('/account/manage')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 w-full'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full rounded-full'>
          Save Changes
        </Button>
      </form>
    </Form>
  )
}
