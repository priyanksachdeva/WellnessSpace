import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      content: "This platform helped me through my toughest semester. The AI chat was like having a friend who truly understood what I was going through.",
      author: "Anonymous Student",
      program: "Psychology Major",
      rating: 5
    },
    {
      content: "I was hesitant to seek help, but the anonymous support made it feel safe. The counselor I connected with changed my perspective on mental health.",
      author: "Anonymous Student", 
      program: "Engineering Student",
      rating: 5
    },
    {
      content: "The peer community showed me I wasn't alone in my struggles. Sometimes just knowing others have been through similar challenges helps so much.",
      author: "Anonymous Student",
      program: "Graduate Student", 
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gradient-wellness">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
            Stories of Healing & Hope
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real experiences from students who found support and healing through our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card p-8 rounded-3xl shadow-wellness hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center mb-6">
                <Quote className="w-8 h-8 text-primary/30 mr-3" />
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <blockquote className="text-muted-foreground mb-6 italic leading-relaxed">
                "{testimonial.content}"
              </blockquote>
              
              <div className="border-t border-border/30 pt-4">
                <div className="font-medium text-foreground">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">{testimonial.program}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center bg-card rounded-full px-6 py-3 shadow-wellness">
            <div className="flex -space-x-2 mr-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gradient-hero rounded-full border-2 border-card"></div>
              ))}
            </div>
            <div className="text-sm">
              <span className="font-medium text-foreground">Join 10,000+ students</span>
              <span className="text-muted-foreground"> who trust WellnessSpace</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;