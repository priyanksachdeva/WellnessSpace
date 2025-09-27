import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, Play, FileText, Headphones, Video, ExternalLink } from "lucide-react";

const ResourcesPage = () => {
  const articles = [
    {
      id: 1,
      title: "Understanding Anxiety: A Complete Guide",
      category: "Anxiety",
      readTime: "8 min read",
      description: "Learn about anxiety symptoms, causes, and evidence-based coping strategies.",
      featured: true
    },
    {
      id: 2,
      title: "Building Healthy Sleep Habits",
      category: "Sleep",
      readTime: "6 min read",
      description: "Practical tips for improving sleep quality and establishing better routines."
    },
    {
      id: 3,
      title: "Mindfulness Techniques for Daily Life",
      category: "Mindfulness",
      readTime: "10 min read",
      description: "Simple mindfulness practices you can incorporate into your everyday routine."
    },
    {
      id: 4,
      title: "Managing Depression: Tools and Strategies",
      category: "Depression",
      readTime: "12 min read",
      description: "Evidence-based approaches to understanding and managing depression.",
      featured: true
    }
  ];

  const worksheets = [
    {
      id: 1,
      title: "Thought Record Worksheet",
      category: "CBT",
      description: "Track and challenge negative thought patterns using cognitive behavioral techniques."
    },
    {
      id: 2,
      title: "Daily Mood Tracker",
      category: "Self-Monitoring",
      description: "Monitor your mood patterns and identify triggers throughout the day."
    },
    {
      id: 3,
      title: "Anxiety Coping Skills Checklist",
      category: "Anxiety",
      description: "A comprehensive list of anxiety management techniques and coping strategies."
    },
    {
      id: 4,
      title: "Gratitude Journal Template",
      category: "Positivity",
      description: "Structured template for daily gratitude practice and positive reflection."
    }
  ];

  const mediaResources = [
    {
      id: 1,
      title: "Guided Meditation for Beginners",
      type: "Audio",
      duration: "15 min",
      description: "A gentle introduction to meditation practice for stress relief.",
      icon: Headphones
    },
    {
      id: 2,
      title: "Progressive Muscle Relaxation",
      type: "Audio",
      duration: "20 min",
      description: "Step-by-step guided relaxation technique for physical tension relief.",
      icon: Headphones
    },
    {
      id: 3,
      title: "Understanding Mental Health",
      type: "Video",
      duration: "12 min",
      description: "Educational video covering basic mental health concepts and terminology.",
      icon: Video
    },
    {
      id: 4,
      title: "Breathing Exercises for Anxiety",
      type: "Video",
      duration: "8 min",
      description: "Visual guide to effective breathing techniques for anxiety management.",
      icon: Video
    }
  ];

  const externalResources = [
    {
      title: "National Suicide Prevention Lifeline",
      description: "24/7 crisis support and suicide prevention resources",
      url: "https://988lifeline.org",
      category: "Crisis Support"
    },
    {
      title: "Crisis Text Line",
      description: "Free, 24/7 support via text message",
      url: "https://crisistextline.org",
      category: "Crisis Support"
    },
    {
      title: "NAMI (National Alliance on Mental Illness)",
      description: "Mental health advocacy, education, and support resources",
      url: "https://nami.org",
      category: "Education"
    },
    {
      title: "Mental Health America",
      description: "Mental health screening tools and educational materials",
      url: "https://mhanational.org",
      category: "Assessment"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header Section */}
      <section className="pt-20 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Mental Health Resources
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Access evidence-based tools, educational materials, and support resources to enhance your mental wellness journey.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-12">
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="worksheets">Worksheets</TabsTrigger>
              <TabsTrigger value="media">Audio & Video</TabsTrigger>
              <TabsTrigger value="external">External Links</TabsTrigger>
            </TabsList>

            {/* Articles Tab */}
            <TabsContent value="articles" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-heading font-bold mb-4">Educational Articles</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Expert-written articles covering various mental health topics, coping strategies, and wellness tips.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <Card key={article.id} className={`group hover:shadow-elegant transition-all duration-300 ${article.featured ? 'border-primary/50' : ''}`}>
                    {article.featured && (
                      <div className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium w-fit rounded-br-lg">
                        Featured
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary">{article.category}</Badge>
                        <span className="text-sm text-muted-foreground">{article.readTime}</span>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {article.title}
                      </CardTitle>
                      <CardDescription>{article.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read Article
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Worksheets Tab */}
            <TabsContent value="worksheets" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-heading font-bold mb-4">Downloadable Worksheets</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Practical tools and exercises designed to support your mental health journey and self-reflection.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {worksheets.map((worksheet) => (
                  <Card key={worksheet.id} className="group hover:shadow-elegant transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <Badge variant="outline">{worksheet.category}</Badge>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {worksheet.title}
                      </CardTitle>
                      <CardDescription>{worksheet.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-heading font-bold mb-4">Audio & Video Resources</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Guided meditations, relaxation exercises, and educational videos to support your wellness practice.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {mediaResources.map((resource) => {
                  const IconComponent = resource.icon;
                  return (
                    <Card key={resource.id} className="group hover:shadow-elegant transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center space-x-3 mb-3">
                          <IconComponent className="w-8 h-8 text-primary" />
                          <div className="flex space-x-2">
                            <Badge variant="outline">{resource.type}</Badge>
                            <Badge variant="secondary">{resource.duration}</Badge>
                          </div>
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {resource.title}
                        </CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">
                          <Play className="w-4 h-4 mr-2" />
                          Play {resource.type}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* External Links Tab */}
            <TabsContent value="external" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-heading font-bold mb-4">External Resources</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Trusted external organizations and websites providing additional mental health support and information.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {externalResources.map((resource, index) => (
                  <Card key={index} className="group hover:shadow-elegant transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline">{resource.category}</Badge>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {resource.title}
                      </CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="outline">
                        Visit Website
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Crisis Resources Banner */}
      <section className="py-12 bg-destructive/10 border-y border-destructive/20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-heading font-bold text-destructive mb-4">
            Need Immediate Help?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            If you're experiencing a mental health crisis or having thoughts of self-harm, please reach out for immediate support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="destructive" size="lg">
              Call 988 - Suicide & Crisis Lifeline
            </Button>
            <Button variant="outline" size="lg">
              Text HOME to 741741
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourcesPage;