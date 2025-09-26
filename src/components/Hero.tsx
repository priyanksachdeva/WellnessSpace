import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-wellness pt-16">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Hero Content */}
          <div className="animate-fade-in">
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Mental{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Wellness
              </span>{" "}
              Companion
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              24/7 confidential support, resources, and professional connections. 
              Your mental health journey starts here, in a safe and judgment-free space.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {user ? (
                <Link to="/chat">
                  <Button 
                    size="lg" 
                    className="bg-gradient-hero hover:opacity-90 shadow-soft px-8 py-4 text-lg font-medium"
                  >
                    Continue to Chat
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    className="bg-gradient-hero hover:opacity-90 shadow-soft px-8 py-4 text-lg font-medium"
                  >
                    Get Support Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary/30 hover:bg-primary/5 px-8 py-4 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-slide-up">
            <div className="flex flex-col items-center p-6 glass rounded-2xl shadow-wellness">
              <div className="w-12 h-12 bg-gradient-soft rounded-full flex items-center justify-center mb-4 breathing">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">10,000+ Students</h3>
              <p className="text-muted-foreground text-center">Trusted by students worldwide</p>
            </div>

            <div className="flex flex-col items-center p-6 glass rounded-2xl shadow-wellness">
              <div className="w-12 h-12 bg-gradient-soft rounded-full flex items-center justify-center mb-4 breathing">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">24/7 Available</h3>
              <p className="text-muted-foreground text-center">Support whenever you need it</p>
            </div>

            <div className="flex flex-col items-center p-6 glass rounded-2xl shadow-wellness">
              <div className="w-12 h-12 bg-gradient-soft rounded-full flex items-center justify-center mb-4 breathing">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">100% Confidential</h3>
              <p className="text-muted-foreground text-center">Your privacy is protected</p>
            </div>
          </div>

          {/* Emergency Notice */}
          <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground mb-3">
              <strong className="text-foreground">Crisis Support:</strong> If you're having thoughts of self-harm, 
              please reach out immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" size="sm" className="border-accent hover:bg-accent/10">
                Call 988 (Suicide Prevention)
              </Button>
              <Button variant="outline" size="sm" className="border-accent hover:bg-accent/10">
                Text HOME to 741741
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;