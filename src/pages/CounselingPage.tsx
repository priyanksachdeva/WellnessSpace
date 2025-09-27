import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, MapPin, Star, Video, Phone, MessageSquare, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCounseling } from "@/hooks/useCounseling";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useState } from "react";

const CounselingPage = () => {
  const { user } = useAuth();
  const { counselors, appointments, loading, bookAppointment } = useCounseling();
  const { toast } = useToast();
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState('video');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const handleBooking = async () => {
    if (!selectedCounselor || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select a counselor, date, and time.",
        variant: "destructive"
      });
      return;
    }

    setIsBooking(true);
    
    try {
      const appointmentDateTime = `${selectedDate}T${selectedTime}:00Z`;
      const { data, error } = await bookAppointment(
        selectedCounselor.id, 
        appointmentDateTime, 
        selectedType, 
        isAnonymous
      );

      if (error) throw error;

      toast({
        title: "Appointment Booked!",
        description: `Your ${selectedType} session with ${selectedCounselor.name} has been scheduled.`,
      });

      // Reset form
      setSelectedCounselor(null);
      setSelectedDate('');
      setSelectedTime('');
      setSelectedType('video');
      setIsAnonymous(false);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "Unable to book appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };

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
            {loading ? (
              <div className="col-span-full text-center py-8">Loading counselors...</div>
            ) : (
              counselors.map((counselor) => (
                <Card key={counselor.id} className="group hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                      <img 
                        src="/placeholder.svg" 
                        alt={counselor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <CardTitle className="text-lg">{counselor.name}</CardTitle>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{counselor.rating}</span>
                          <span className="text-sm text-muted-foreground">• {counselor.experience_years} years</span>
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
                    <div className="flex flex-wrap gap-2 mb-4">
                      {counselor.languages.map((language) => (
                        <span 
                          key={language}
                          className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{counselor.bio}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                      <Clock className="w-4 h-4" />
                      <span>Available for {counselor.contact_method} sessions</span>
                    </div>
                    {user ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full" 
                            onClick={() => setSelectedCounselor(counselor)}
                          >
                            Book Session
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Book Session with {counselor.name}</DialogTitle>
                            <DialogDescription>
                              Choose your preferred session type, date, and time.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="session-type">Session Type</Label>
                              <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select session type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="video">Video Call ($120)</SelectItem>
                                  <SelectItem value="phone">Phone Call ($100)</SelectItem>
                                  <SelectItem value="in-person">In-Person ($120)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="date">Date</Label>
                              <input
                                type="date"
                                id="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full p-2 border rounded-md"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="time">Time</Label>
                              <Select value={selectedTime} onValueChange={setSelectedTime}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="09:00">9:00 AM</SelectItem>
                                  <SelectItem value="10:00">10:00 AM</SelectItem>
                                  <SelectItem value="11:00">11:00 AM</SelectItem>
                                  <SelectItem value="14:00">2:00 PM</SelectItem>
                                  <SelectItem value="15:00">3:00 PM</SelectItem>
                                  <SelectItem value="16:00">4:00 PM</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="anonymous" 
                                checked={isAnonymous}
                                onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                              />
                              <Label htmlFor="anonymous" className="text-sm">
                                Book anonymously (your identity will be protected)
                              </Label>
                            </div>

                            <Button 
                              onClick={handleBooking} 
                              disabled={isBooking}
                              className="w-full"
                            >
                              {isBooking ? 'Booking...' : 'Confirm Booking'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Link to="/auth">
                        <Button className="w-full">Sign Up to Book</Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
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