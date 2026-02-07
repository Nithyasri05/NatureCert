import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Leaf, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Login form schema
const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

// Register form schema
const registerFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function AuthPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const resp = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err?.error || 'Login failed');
      }

      toast({ title: 'Login successful', description: 'Welcome back!', variant: 'default' });
      // notify other UI parts about auth change (header)
      window.dispatchEvent(new Event('authChanged'));
      setLocation('/home');
    } catch (error: any) {
      // clear entered credentials on failed login
      loginForm.reset({ email: '', password: '' });
      toast({
        title: "Login failed",
        description: error?.message || 'Invalid email or password. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      const resp = await fetch('/api/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err?.error || 'Registration failed');
      }

      toast({ title: 'Registration successful', description: 'Your account has been created.', variant: 'default' });
      window.dispatchEvent(new Event('authChanged'));
      setLocation('/home');
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error?.message || 'There was an error creating your account. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReset = async () => {
    if (!forgotEmail || !forgotEmail.includes('@')) {
      toast({ title: 'Invalid email', description: 'Please provide a valid email address', variant: 'destructive' });
      return;
    }

    // Simulate sending reset link — in production this would call an API
    toast({ title: 'Password reset', description: `If an account exists for ${forgotEmail}, a reset link has been sent.`, variant: 'default' });
    setShowForgot(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Auth forms */}
      <div className="md:w-1/2 p-8 md:p-12 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <Leaf className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-2xl font-bold text-neutral-800">NatureCert</h1>
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">Welcome</h2>
            <p className="text-neutral-600">Sign in to your account or create a new one</p>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            {/* Forgot password modal */}
            {showForgot && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
                  <h3 className="text-lg font-semibold mb-3">Reset your password</h3>
                  <p className="text-sm text-neutral-600 mb-4">Enter your email and we'll send a reset link if an account exists.</p>
                  <div className="mb-4">
                    <Input value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="youremail@example.com" />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setShowForgot(false)}>Cancel</Button>
                    <Button onClick={handleSendReset}>Send reset link</Button>
                  </div>
                </div>
              </div>
            )}
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            
            {/* Login Form */}
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                            <Input 
                              type="email" 
                              className="pl-10" 
                              placeholder="youremail@example.com" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                            <Input 
                              type="password" 
                              className="pl-10" 
                              placeholder="••••••••" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="remember-me" className="h-4 w-4 text-primary" />
                      <label htmlFor="remember-me" className="text-sm text-neutral-600">Remember me</label>
                    </div>
                    <button type="button" onClick={() => setShowForgot(true)} className="text-sm font-medium text-primary hover:text-primary-dark">
                      Forgot password?
                    </button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-dark"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            {/* Register Form */}
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                            <Input 
                              className="pl-10" 
                              placeholder="John Doe" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                            <Input 
                              type="email" 
                              className="pl-10" 
                              placeholder="youremail@example.com" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                            <Input 
                              type="password" 
                              className="pl-10" 
                              placeholder="••••••••" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                            <Input 
                              type="password" 
                              className="pl-10" 
                              placeholder="••••••••" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="text-sm text-neutral-600">
                    By signing up, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-dark"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 text-center">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                // mark auth state change and navigate guest to recycling guide
                window.dispatchEvent(new Event('authChanged'));
                setLocation('/recycling-guide');
              }}
            >
              Continue as Guest
            </Button>
          </div>
        </div>
      </div>
      
      {/* Right side - Hero section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-600 to-teal-600 text-white p-12 items-center justify-center">
        <div className="max-w-md">
          <div className="mb-8">
            <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
              <Leaf className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Understand Environmental Certifications</h2>
            <p className="text-lg opacity-90 mb-6">
              NatureCert helps you navigate the complex world of environmental certifications and understand their real impact on the planet.
            </p>
            
            <div className="border-t border-white/20 pt-6 mt-6">
              <h3 className="text-xl font-bold mb-4">Benefits of joining NatureCert:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 mr-2 mt-0.5" />
                  <span>Access to detailed certification comparisons</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 mr-2 mt-0.5" />
                  <span>Track your business's certification progress</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 mr-2 mt-0.5" />
                  <span>Receive personalized certification recommendations</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 mr-2 mt-0.5" />
                  <span>Join a community of sustainability advocates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}