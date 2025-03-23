import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowLeft, 
  AlertCircle, 
  User,
  CheckCircle2,
  XCircle 
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type PasswordStrength = 'weak' | 'medium' | 'strong' | 'none';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('none');
  
  const { toast } = useToast();
  const { registerUser } = useAppContext();
  const navigate = useNavigate();

  // Password validation criteria
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const passwordsMatch = password === confirmPassword;

  // Calculate password strength based on criteria
  useEffect(() => {
    if (password.length === 0) {
      setPasswordStrength('none');
    } else if (
      hasMinLength && 
      hasUppercase && 
      hasLowercase && 
      hasNumber && 
      hasSpecialChar
    ) {
      setPasswordStrength('strong');
    } else if (
      hasMinLength && 
      (hasUppercase || hasLowercase) && 
      (hasNumber || hasSpecialChar)
    ) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('weak');
    }
  }, [password, hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar]);

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-secondary/30';
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (!agreeTerms) {
      setError('You must agree to the terms and privacy policy');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (passwordStrength === 'weak') {
      setError('Please choose a stronger password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const success = await registerUser(name, email, password);
      
      if (success) {
        toast({
          title: "Registration successful",
          description: "Your account has been created",
          duration: 3000,
        });
        navigate('/register-donor');
      } else {
        setError('Email already in use or registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link to="/" className="absolute top-4 left-4 flex items-center text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span>Return to Website</span>
      </Link>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img src="/logo.svg" alt="BloodBuddy Logo" className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-400 text-sm">
            Join BloodBuddy to help save lives
          </p>
        </div>

        <Card className="bg-secondary/20 border-secondary/50 p-6">
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-900/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-400">
                Full Name
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="pl-10 h-11 bg-secondary/30 border-secondary/60"
                  disabled={loading}
                />
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-400">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10 h-11 bg-secondary/30 border-secondary/60"
                  disabled={loading}
                />
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-400">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="pl-10 pr-10 h-11 bg-secondary/30 border-secondary/60"
                  disabled={loading}
                />
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="h-1 w-full bg-secondary/30 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStrengthColor()} transition-all`}
                      style={{ width: passwordStrength === 'none' ? '0%' : passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%' }}
                    ></div>
                  </div>
                  <div className="flex flex-wrap gap-y-2 mt-2">
                    <div className="w-1/2 flex items-center">
                      {hasMinLength ? 
                        <CheckCircle2 className="h-3 w-3 text-green-500 mr-1.5" /> : 
                        <XCircle className="h-3 w-3 text-red-500 mr-1.5" />
                      }
                      <span className="text-xs text-gray-400">At least 8 characters</span>
                    </div>
                    <div className="w-1/2 flex items-center">
                      {hasUppercase ? 
                        <CheckCircle2 className="h-3 w-3 text-green-500 mr-1.5" /> : 
                        <XCircle className="h-3 w-3 text-red-500 mr-1.5" />
                      }
                      <span className="text-xs text-gray-400">Uppercase letter</span>
                    </div>
                    <div className="w-1/2 flex items-center">
                      {hasLowercase ? 
                        <CheckCircle2 className="h-3 w-3 text-green-500 mr-1.5" /> : 
                        <XCircle className="h-3 w-3 text-red-500 mr-1.5" />
                      }
                      <span className="text-xs text-gray-400">Lowercase letter</span>
                    </div>
                    <div className="w-1/2 flex items-center">
                      {hasNumber ? 
                        <CheckCircle2 className="h-3 w-3 text-green-500 mr-1.5" /> : 
                        <XCircle className="h-3 w-3 text-red-500 mr-1.5" />
                      }
                      <span className="text-xs text-gray-400">Number</span>
                    </div>
                    <div className="w-1/2 flex items-center">
                      {hasSpecialChar ? 
                        <CheckCircle2 className="h-3 w-3 text-green-500 mr-1.5" /> : 
                        <XCircle className="h-3 w-3 text-red-500 mr-1.5" />
                      }
                      <span className="text-xs text-gray-400">Special character</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-400">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10 h-11 bg-secondary/30 border-secondary/60"
                  disabled={loading}
                />
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {confirmPassword.length > 0 && (
                <div className="flex items-center mt-1">
                  {passwordsMatch ? 
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1.5" /> : 
                    <XCircle className="h-3 w-3 text-red-500 mr-1.5" />
                  }
                  <span className="text-xs text-gray-400">
                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                disabled={loading}
                className="mt-1"
              />
              <label
                htmlFor="terms"
                className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400"
              >
                I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-primary hover:bg-primary/90" 
              disabled={loading || !agreeTerms}
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></span>
                  Creating account...
                </>
              ) : "Create account"}
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary/60"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-secondary/20 px-2 text-gray-400">Or sign up with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="bg-secondary/30 border-secondary/60 hover:bg-secondary/50"
                onClick={() => toast({
                  title: "Google Sign-up",
                  description: "Google authentication is not implemented in this demo",
                  variant: "default",
                })}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button 
                variant="outline" 
                className="bg-secondary/30 border-secondary/60 hover:bg-secondary/50"
                onClick={() => toast({
                  title: "Facebook Sign-up",
                  description: "Facebook authentication is not implemented in this demo",
                  variant: "default",
                })}
              >
                <svg className="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">Already have an account?</span>
            <Link 
              to="/auth/login" 
              className="text-primary hover:text-primary/90 ml-1 font-medium transition-colors"
            >
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register; 