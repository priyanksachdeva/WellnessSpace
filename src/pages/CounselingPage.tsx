import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Star, Video, Phone, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const CounselingPage = () => {
  const { user } = useAuth();

  const counselors = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      specialties: ["Anxiety", "Depression", "PTSD"],
      rating: 4.9,
      experience: "8 years",
      availability: "Available today",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Dr. Michael Rodriguez",
      specialties: ["Relationships", "Family Therapy", "Stress"],
      rating: 4.8,
      experience: "12 years",
      availability: "Next available: Tomorrow",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Dr. Emily Johnson",
      specialties: ["Teen Counseling", "Eating Disorders", "Self-Esteem"],
      rating: 4.9,
      experience: "6 years",
      availability: "Available today",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header Section */}
      <section className="pt-20 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Professional Counseling Services
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Connect with licensed mental health professionals who understand your journey and are here to support you.
          </p>
          {!user && (
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="shadow-soft">
                Sign Up to Book a Session
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Session Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Choose Your Session Type
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <Video className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Video Sessions</CardTitle>
                <CardDescription>
                  Face-to-face counseling from the comfort of your home
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-2">$120</p>
                <p className="text-muted-foreground">per 50-minute session</p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Phone Sessions</CardTitle>
                <CardDescription>
                  Professional support via secure phone calls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-2">$100</p>
                <p className="text-muted-foreground">per 50-minute session</p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Text Therapy</CardTitle>
                <CardDescription>
                  Ongoing support through secure messaging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-2">$80</p>
                <p className="text-muted-foreground">per week</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Available Counselors */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Meet Our Licensed Counselors
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {counselors.map((counselor) => (
              <Card key={counselor.id} className="group hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <img 
                      src={counselor.image} 
                      alt={counselor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">{counselor.name}</CardTitle>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{counselor.rating}</span>
                        <span className="text-sm text-muted-foreground">• {counselor.experience}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {counselor.specialties.map((specialty) => (
                      <span 
                        key={specialty}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{counselor.availability}</span>
                  </div>
                  {user ? (
                    <Button className="w-full">Book Session</Button>
                  ) : (
                    <Link to="/auth">
                      <Button className="w-full">Sign Up to Book</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Notice */}
      <section className="py-12 bg-destructive/10 border-t border-destructive/20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-heading font-bold text-destructive mb-4">
            Crisis Support Available 24/7
          </h3>
          <p className="text-muted-foreground mb-6">
            If you're experiencing a mental health emergency, please reach out immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="destructive" size="lg">
              <Phone className="w-4 h-4 mr-2" />
              Crisis Hotline: 988
            </Button>
            <Button variant="outline" size="lg">
              <MessageSquare className="w-4 h-4 mr-2" />
              Crisis Text: Text HOME to 741741
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CounselingPage;