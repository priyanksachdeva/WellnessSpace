import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Heart, Shield, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signUp, signIn } = useAuth();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await signUp(
      email,
      password,
      isAnonymous ? "Anonymous User" : displayName
    );

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-wellness flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full animate-float"></div>
        <div
          className="absolute bottom-20 right-20 w-24 h-24 bg-secondary rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent rounded-full animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 mb-6 group"
          >
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center breathing">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading font-semibold text-2xl text-foreground group-hover:text-primary transition-colors">
              WellnessSpace
            </span>
          </Link>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            Your Safe Space Awaits
          </h1>
          <p className="text-muted-foreground">
            Join thousands of students finding support and healing
          </p>
        </div>

        <Card className="glass shadow-wellness border-border/30">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Sign In Tab */}
            <TabsContent value="signin">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-heading">
                  Welcome Back
                </CardTitle>
                <CardDescription>
                  Sign in to continue your wellness journey
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-border/50 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-border/50 focus:border-primary pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-hero hover:opacity-90 shadow-soft"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <Button
                    variant="ghost"
                    className="text-sm text-muted-foreground"
                  >
                    Forgot your password?
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-heading">
                  Join WellnessSpace
                </CardTitle>
                <CardDescription>
                  Create your account for personalized support
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-border/50 focus:border-primary"
                    />
                  </div>

                  {!isAnonymous && (
                    <div className="space-y-2">
                      <Label htmlFor="display-name">
                        Display Name (Optional)
                      </Label>
                      <Input
                        id="display-name"
                        type="text"
                        placeholder="How you'd like to be called"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="border-border/50 focus:border-primary"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-border/50 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="border-border/50 focus:border-primary"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anonymous"
                      checked={isAnonymous}
                      onCheckedChange={(checked) =>
                        setIsAnonymous(checked as boolean)
                      }
                    />
                    <Label htmlFor="anonymous" className="text-sm">
                      I prefer to remain anonymous
                    </Label>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-hero hover:opacity-90 shadow-soft"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>

          {/* Privacy Notice */}
          <div className="p-6 pt-0">
            <div className="flex items-start space-x-2 text-xs text-muted-foreground bg-wellness/50 p-3 rounded-lg">
              <Shield className="w-4 h-4 mt-0.5 text-primary" />
              <p>
                Your data is encrypted and confidential. We follow strict
                privacy policies to protect your mental health information.
              </p>
            </div>
          </div>
        </Card>

        {/* Emergency Resources */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            <strong>Student Crisis Support:</strong> If you're having thoughts
            of self-harm
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              className="border-accent text-accent-foreground hover:bg-accent/10"
            >
              Call KIRAN 1800-599-0019
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-accent text-accent-foreground hover:bg-accent/10"
            >
              Call iCALL 9152987821
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
