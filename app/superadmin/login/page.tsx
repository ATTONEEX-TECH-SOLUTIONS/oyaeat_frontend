 'use client'
 
 import { useState } from 'react'
 import { useRouter } from 'next/navigation'
 import { z } from 'zod'
 import { useForm } from 'react-hook-form'
 import { zodResolver } from '@hookform/resolvers/zod'
 import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
 import { Input } from '@/components/ui/input'
 import { Button } from '@/components/ui/button'
 import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
 
 const schema = z.object({
   email: z.string().email(),
   password: z.string().min(6),
 })
 
 export default function AdminLoginPage() {
   const router = useRouter()
   const [submitting, setSubmitting] = useState(false)
   const [error, setError] = useState<string | null>(null)
 
   const form = useForm<z.infer<typeof schema>>({
     resolver: zodResolver(schema),
     defaultValues: { email: '', password: '' },
   })
 
   const onSubmit = async (values: z.infer<typeof schema>) => {
     setError(null)
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000'
     setSubmitting(true)
     try {
       const res = await fetch(`${base}/admin/auth/login`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(values),
       })
       if (!res.ok) {
         setError('Invalid credentials')
         return
       }
       const data = await res.json()
       if (data?.token) {
         localStorage.setItem('admin_token', data.token)
       }
       if (data?.admin) {
         localStorage.setItem('admin_user', JSON.stringify(data.admin))
       }
       router.replace('/superadmin/dashboard')
     } catch (e) {
       setError('Network error')
     } finally {
       setSubmitting(false)
     }
   }
 
   return (
     <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
       <Card className="w-full max-w-md bg-white">
         <CardHeader>
           <CardTitle>Admin Login</CardTitle>
           <CardDescription>Sign in to access the dashboard</CardDescription>
         </CardHeader>
         <CardContent>
           <Form {...form}>
             <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
               <FormField
                 control={form.control}
                 name="email"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Email</FormLabel>
                     <FormControl>
                       <Input type="email" placeholder="admin@example.com" {...field} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               <FormField
                 control={form.control}
                 name="password"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Password</FormLabel>
                     <FormControl>
                       <Input type="password" placeholder="••••••••" {...field} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               {error && (
                 <div className="text-sm font-medium text-destructive">{error}</div>
               )}
               <Button type="submit" className="w-full" disabled={submitting}>
                 {submitting ? 'Signing in...' : 'Sign In'}
               </Button>
             </form>
           </Form>
         </CardContent>
         <CardFooter />
       </Card>
     </div>
   )
 }
