import { HTMLAttributes } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useLogin } from '@/lib/api-hooks'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
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
import { PasswordInput } from '@/components/password-input'

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  loginId: z.string().min(1, { message: 'Please enter your login ID' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const { setAccessToken, setUser } = useAuthStore((s) => s.auth)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loginId: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await loginMutation.mutateAsync(data, {
      onSuccess: (res) => {
        if (res.success) {
          toast.success('Login successful!')
          setAccessToken(res.data.accessToken)
          setUser(res.data)
          navigate({ to: '/' })
        } else {
          toast.error(res.message || 'Login failed. Please try again.')
        }
      },
      onError: (error) => {
        toast.error(error.message || 'An unexpected error occurred.')
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='loginId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Login ID</FormLabel>
              <FormControl>
                <Input placeholder='your-login-id' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </Button>

        {/*<div className='relative my-2'>*/}
        {/*  <div className='absolute inset-0 flex items-center'>*/}
        {/*    <span className='w-full border-t' />*/}
        {/*  </div>*/}
        {/*  <div className='relative flex justify-center text-xs uppercase'>*/}
        {/*    <span className='bg-background text-muted-foreground px-2'>*/}
        {/*      Or continue with*/}
        {/*    </span>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/*<div className='grid grid-cols-2 gap-2'>*/}
        {/*  <Button*/}
        {/*    variant='outline'*/}
        {/*    type='button'*/}
        {/*    disabled={loginMutation.isPending}*/}
        {/*  >*/}
        {/*    <IconBrandGithub className='h-4 w-4' /> GitHub*/}
        {/*  </Button>*/}
        {/*  <Button*/}
        {/*    variant='outline'*/}
        {/*    type='button'*/}
        {/*    disabled={loginMutation.isPending}*/}
        {/*  >*/}
        {/*    <IconBrandFacebook className='h-4 w-4' /> Facebook*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </form>
    </Form>
  )
}
