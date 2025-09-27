import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, MessageCircle, Calendar, Heart, Shield, Clock, MapPin, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const CommunityPage = () => {
  const { user } = useAuth();

  const supportGroups = [
    {
      id: 1,
      title: "Anxiety Support Circle",
      description: "A safe space to share experiences and coping strategies for anxiety management.",
      members: 124,
      nextMeeting: "Tomorrow, 7:00 PM EST",
      category: "Anxiety",
      type: "Virtual",
      facilitator: "Dr. Sarah Chen"
    },
    {
      id: 2,
      title: "Depression Recovery Group",
      description: "Peer support for those navigating depression and working toward recovery.",
      members: 89,
      nextMeeting: "Friday, 6:30 PM EST",
      category: "Depression",
      type: "Hybrid",
      facilitator: "Licensed Counselor"
    },
    {
      id: 3,
      title: "Young Adults Mental Health",
      description: "Support group specifically for adults aged 18-30 facing mental health challenges.",
      members: 67,
      nextMeeting: "Monday, 8:00 PM EST",
      category: "Age-Specific",
      type: "Virtual",
      facilitator: "Peer Facilitator"
    },
    {
      id: 4,
      title: "PTSD & Trauma Support",
      description: "Confidential support for those healing from trauma and PTSD.",
      members: 45,
      nextMeeting: "Wednesday, 7:30 PM EST",
      category: "Trauma",
      type: "Virtual",
      facilitator: "Trauma Specialist"
    }
  ];

  const communityForums = [
    {
      id: 1,
      title: "General Support",
      description: "Share your thoughts, experiences, and support others in their journey.",
      posts: 1247,
      members: 892,
      lastActivity: "2 minutes ago",
      category: "General"
    },
    {
      id: 2,
      title: "Coping Strategies",
      description: "Share and discover new ways to manage stress and difficult emotions.",
      posts: 689,
      members: 567,
      lastActivity: "15 minutes ago",
      category: "Resources"
    },
    {
      id: 3,
      title: "Success Stories",
      description: "Celebrate wins, both big and small, in your mental health journey.",
      posts: 423,
      members: 743,
      lastActivity: "1 hour ago",
      category: "Inspiration"
    },
    {
      id: 4,
      title: "Family & Friends",
      description: "Support for those supporting loved ones with mental health challenges.",
      posts: 356,
      members: 289,
      lastActivity: "3 hours ago",
      category: "Support"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Mental Health Awareness Workshop",
      date: "March 15, 2024",
      time: "2:00 PM - 4:00 PM EST",
      type: "Virtual Event",
      description: "Learn about mental health stigma and how to be an advocate for change.",
      attendees: 156
    },
    {
      id: 2,
      title: "Mindfulness & Meditation Session",
      date: "March 18, 2024",
      time: "7:00 PM - 8:00 PM EST",
      type: "Guided Session",
      description: "Join us for a relaxing guided meditation and mindfulness practice.",
      attendees: 89
    },
    {
      id: 3,
      title: "Peer Support Training",
      date: "March 22, 2024",
      time: "6:00 PM - 9:00 PM EST",
      type: "Training",
      description: "Learn how to become a certified peer support specialist in our community.",
      attendees: 34
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header Section */}
      <section className="pt-20 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Community Support
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Connect with others who understand your journey. Find support, share experiences, and grow together in a safe, moderated environment.
          </p>
          {!user && (
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="shadow-soft">
                Join Our Community
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-heading font-bold text-center mb-8">
              Community Guidelines
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Safe Space</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Respect, kindness, and confidentiality are our core values.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Peer Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Support others with empathy and share your experiences.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Professional Moderation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Licensed professionals moderate all group activities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Support Groups */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Support Groups
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {supportGroups.map((group) => (
              <Card key={group.id} className="group hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline">{group.category}</Badge>
                    <Badge variant="secondary">{group.type}</Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {group.title}
                  </CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{group.members} members</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-muted-foreground" />
                      <span>{group.facilitator}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Next meeting: {group.nextMeeting}</span>
                  </div>
                  {user ? (
                    <Button className="w-full">Join Group</Button>
                  ) : (
                    <Link to="/auth">
                      <Button className="w-full">Sign Up to Join</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Forums */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Community Forums
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {communityForums.map((forum) => (
              <Card key={forum.id} className="group hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline">{forum.category}</Badge>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{forum.lastActivity}</span>
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {forum.title}
                  </CardTitle>
                  <CardDescription>{forum.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-muted-foreground" />
                      <span>{forum.posts} posts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{forum.members} members</span>
                    </div>
                  </div>
                  {user ? (
                    <Button className="w-full" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      View Forum
                    </Button>
                  ) : (
                    <Link to="/auth">
                      <Button className="w-full" variant="outline">Sign Up to Participate</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Upcoming Events
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="group hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-3">{event.type}</Badge>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                  {user ? (
                    <Button className="w-full">Register</Button>
                  ) : (
                    <Link to="/auth">
                      <Button className="w-full">Sign Up to Register</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Crisis Support */}
      <section className="py-12 bg-destructive/10 border-y border-destructive/20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-heading font-bold text-destructive mb-4">
            Community Crisis Support
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our community is here to support you, but for immediate crisis intervention, please contact professional services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="destructive" size="lg">
              Crisis Hotline: 988
            </Button>
            <Button variant="outline" size="lg">
              Community Moderators Available 24/7
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunityPage;