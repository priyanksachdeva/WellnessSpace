import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, MessageCircle, Calendar, BookOpen, Users } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center breathing">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-semibold text-xl text-foreground">
              WellnessSpace
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#chat" className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>AI Support</span>
            </a>
            <a href="#counseling" className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Counseling</span>
            </a>
            <a href="#resources" className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Resources</span>
            </a>
            <a href="#community" className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Community</span>
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary">
              Sign In
            </Button>
            <Button variant="default" className="bg-gradient-hero hover:opacity-90 shadow-soft">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            <a href="#chat" className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors">
              AI Support
            </a>
            <a href="#counseling" className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors">
              Counseling
            </a>
            <a href="#resources" className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors">
              Resources
            </a>
            <a href="#community" className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors">
              Community
            </a>
            <hr className="border-border/50" />
            <div className="px-3 py-2 space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                Sign In
              </Button>
              <Button variant="default" className="w-full bg-gradient-hero hover:opacity-90">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;