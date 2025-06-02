
// src/app/admin/login/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, ShieldAlert } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { login, isAuthenticated } from '@/lib/authUtils';
import Link from 'next/link';

const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/admin'); // Redirect to dashboard if already logged in
    } else {
      setAuthCheckComplete(true);
    }
  }, [router]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    const success = login(values.username, values.password);

    if (success) {
      toast({
        title: 'Login Successful!',
        description: 'Redirecting to admin dashboard...',
      });
      router.push('/admin');
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid username or password.',
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  }

  if (!authCheckComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <span className="text-8xl font-headline font-bold text-primary animate-pulse">H.</span>
        <p className="mt-4 text-lg text-muted-foreground">Checking Authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Admin Login</CardTitle>
          </div>
          <CardDescription className="text-md pt-1">
            Please enter your credentials to access the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
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
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <LogIn className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Logging In...' : 'Login'}
              </Button>
            </form>
          </Form>
           <div className="mt-6 text-center">
            <Button variant="link" asChild className="text-sm">
              <Link href="/">Back to Main Site</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
