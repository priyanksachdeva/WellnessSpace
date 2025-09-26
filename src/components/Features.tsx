import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, BookOpen, Users, ArrowRight } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "AI Chat Support",
      description: "Get immediate support through our empathetic AI companion. Available 24/7 for whenever you need someone to listen.",
      color: "primary",
      action: "Start Chatting"
    },
    {
      icon: Calendar,
      title: "Professional Counseling",
      description: "Connect with licensed mental health professionals who specialize in student support and academic stress.",
      color: "secondary",
      action: "Book Session"
    },
    {
      icon: BookOpen,
      title: "Wellness Resources",
      description: "Access guided meditations, coping strategies, and educational content tailored for mental wellness.",
      color: "accent",
      action: "Explore Resources"
    },
    {
      icon: Users,
      title: "Peer Community",
      description: "Join anonymous support groups and connect with others who understand your experiences.",
      color: "wellness",
      action: "Join Community"
    }
  ];

  return (
    <section id="features" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
            Complete Mental Health Support
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to support your mental wellness journey, all in one secure platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group p-8 glass rounded-3xl shadow-wellness hover:shadow-soft transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 bg-gradient-${feature.color === 'primary' ? 'hero' : 'soft'} rounded-2xl flex items-center justify-center mb-6 breathing`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {feature.description}
              </p>
              
              <Button 
                variant="ghost" 
                className="group-hover:bg-primary/10 group-hover:text-primary transition-colors w-full justify-between"
              >
                {feature.action}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="font-heading text-3xl font-bold text-foreground">
              Designed for Students, Built with Care
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 pulse-soft"></div>
                <div>
                  <h4 className="font-medium text-foreground">Anonymous & Secure</h4>
                  <p className="text-muted-foreground">Your identity and conversations are completely protected.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 pulse-soft"></div>
                <div>
                  <h4 className="font-medium text-foreground">Evidence-Based Approach</h4>
                  <p className="text-muted-foreground">All our resources are backed by mental health research.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 pulse-soft"></div>
                <div>
                  <h4 className="font-medium text-foreground">Crisis Support</h4>
                  <p className="text-muted-foreground">Immediate escalation to professional help when needed.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full h-80 bg-gradient-wellness rounded-3xl shadow-wellness"></div>
            <div className="absolute inset-4 bg-card rounded-2xl shadow-inner flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 breathing">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <p className="text-muted-foreground">Safe space for healing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;