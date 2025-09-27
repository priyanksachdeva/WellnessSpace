-- Create counselors table
CREATE TABLE public.counselors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  experience_years INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0,
  bio TEXT,
  qualifications TEXT,
  languages TEXT[] NOT NULL DEFAULT '{}',
  availability_schedule JSONB NOT NULL DEFAULT '{}',
  contact_method TEXT NOT NULL DEFAULT 'video',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  counselor_id UUID NOT NULL REFERENCES public.counselors(id),
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 50,
  type TEXT NOT NULL DEFAULT 'video', -- video, phone, in-person
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, completed, cancelled, no-show
  notes TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create psychological assessments table
CREATE TABLE public.psychological_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assessment_type TEXT NOT NULL, -- PHQ-9, GAD-7, GHQ-12, etc.
  responses JSONB NOT NULL,
  score INTEGER,
  severity_level TEXT, -- minimal, mild, moderate, severe
  recommendations TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create peer moderators table
CREATE TABLE public.peer_moderators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  specializations TEXT[] NOT NULL DEFAULT '{}',
  training_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community posts table
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  is_moderated BOOLEAN NOT NULL DEFAULT false,
  moderated_by UUID REFERENCES public.peer_moderators(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community replies table
CREATE TABLE public.community_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.counselors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychological_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_moderators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for counselors (public read)
CREATE POLICY "Anyone can view active counselors" 
ON public.counselors 
FOR SELECT 
USING (is_active = true);

-- RLS Policies for appointments
CREATE POLICY "Users can view their own appointments" 
ON public.appointments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments" 
ON public.appointments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for psychological assessments
CREATE POLICY "Users can view their own assessments" 
ON public.psychological_assessments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments" 
ON public.psychological_assessments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for peer moderators
CREATE POLICY "Anyone can view active moderators" 
ON public.peer_moderators 
FOR SELECT 
USING (is_active = true);

-- RLS Policies for community posts
CREATE POLICY "Anyone can view moderated posts" 
ON public.community_posts 
FOR SELECT 
USING (is_moderated = true);

CREATE POLICY "Users can create posts" 
ON public.community_posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
ON public.community_posts 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for community replies
CREATE POLICY "Anyone can view replies to public posts" 
ON public.community_replies 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.community_posts 
  WHERE id = community_replies.post_id AND is_moderated = true
));

CREATE POLICY "Users can create replies" 
ON public.community_replies 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_counselors_updated_at
  BEFORE UPDATE ON public.counselors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample counselors
INSERT INTO public.counselors (name, specialties, experience_years, rating, bio, qualifications, languages, availability_schedule) VALUES
(
  'Dr. Sarah Chen',
  '{"Anxiety", "Depression", "PTSD"}',
  8,
  4.9,
  'Specialized in cognitive behavioral therapy and trauma-informed care.',
  'PhD in Clinical Psychology, Licensed Mental Health Counselor',
  '{"English", "Hindi", "Tamil"}',
  '{"monday": ["09:00-17:00"], "tuesday": ["09:00-17:00"], "wednesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "friday": ["09:00-15:00"]}'
),
(
  'Dr. Michael Rodriguez',
  '{"Relationships", "Family Therapy", "Stress"}',
  12,
  4.8,
  'Expert in family systems therapy and relationship counseling.',
  'PhD in Marriage and Family Therapy, Licensed Clinical Social Worker',
  '{"English", "Hindi", "Bengali"}',
  '{"monday": ["10:00-18:00"], "tuesday": ["10:00-18:00"], "wednesday": ["10:00-18:00"], "thursday": ["10:00-18:00"], "friday": ["10:00-16:00"]}'
),
(
  'Dr. Emily Johnson',
  '{"Teen Counseling", "Eating Disorders", "Self-Esteem"}',
  6,
  4.9,
  'Dedicated to helping young adults navigate mental health challenges.',
  'PhD in Adolescent Psychology, Licensed Professional Counselor',
  '{"English", "Hindi", "Marathi"}',
  '{"monday": ["11:00-19:00"], "tuesday": ["11:00-19:00"], "wednesday": ["11:00-19:00"], "thursday": ["11:00-19:00"], "friday": ["11:00-17:00"]}'
);

-- Insert sample peer moderators
INSERT INTO public.peer_moderators (user_id, specializations, training_completed_at) VALUES
(gen_random_uuid(), '{"Anxiety Support", "Peer Counseling"}', now() - interval '30 days'),
(gen_random_uuid(), '{"Depression Support", "Crisis Intervention"}', now() - interval '45 days'),
(gen_random_uuid(), '{"Study Stress", "Academic Pressure"}', now() - interval '20 days');