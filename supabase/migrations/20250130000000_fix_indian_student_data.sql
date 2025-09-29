-- Migration to transform platform to Indian student-focused free mental health services
-- This replaces Western data with Indian student context and removes all pricing

-- First, fix availability_schedule format for existing counselors
UPDATE counselors 
SET availability_schedule = jsonb_build_object(
  'monday', ARRAY['09:00-17:00'],
  'tuesday', ARRAY['10:00-18:00'], 
  'wednesday', ARRAY['09:00-17:00'],
  'thursday', ARRAY['10:00-18:00'],
  'friday', ARRAY['09:00-16:00'],
  'saturday', ARRAY['10:00-14:00']
);

-- Remove pricing-related columns if they exist
ALTER TABLE counselors DROP COLUMN IF EXISTS hourly_rate;
ALTER TABLE counselors DROP COLUMN IF EXISTS session_price;
ALTER TABLE appointments DROP COLUMN IF EXISTS fee;
ALTER TABLE appointments DROP COLUMN IF EXISTS payment_status;

-- Clear existing Western counselors and add Indian student-focused counselors
DELETE FROM counselors;

INSERT INTO counselors (id, name, first_name, last_name, specialties, contact_method, bio, languages, is_active, availability_schedule, experience_years, rating, created_at, updated_at) VALUES
('cs-ananya-sharma', 'Dr. Ananya Sharma', 'Ananya', 'Sharma', 
 ARRAY['Academic Stress', 'Board Exam Anxiety', 'Study Pressure', 'School Problems'],
 'video',
 'Specialized in helping school students with board exam stress, academic pressure, and anxiety disorders. Over 8 years experience with CBSE and state board students across India. Fluent in Hindi and English.',
 ARRAY['Hindi', 'English'], 
 true,
 jsonb_build_object(
   'monday', ARRAY['09:00-17:00'],
   'tuesday', ARRAY['10:00-18:00'],
   'wednesday', ARRAY['09:00-17:00'],
   'thursday', ARRAY['10:00-18:00'],
   'friday', ARRAY['09:00-16:00']
 ),
 8, 4.8, NOW(), NOW()),

('cs-rajesh-kumar', 'Dr. Rajesh Kumar', 'Rajesh', 'Kumar',
 ARRAY['Career Guidance', 'Study Stress', 'Academic Performance', 'Engineering Student Support'],
 'video',
 'Expert in helping college students with career confusion, study stress, and academic performance anxiety. Specialized in engineering and medical student mental health. 10+ years with Delhi University and IITs.',
 ARRAY['Hindi', 'English'],
 true,
 jsonb_build_object(
   'monday', ARRAY['10:00-18:00'],
   'tuesday', ARRAY['09:00-17:00'],
   'wednesday', ARRAY['10:00-18:00'],
   'thursday', ARRAY['09:00-17:00'],
   'friday', ARRAY['10:00-16:00'],
   'saturday', ARRAY['10:00-14:00']
 ),
 10, 4.7, NOW(), NOW()),

('cs-priya-nair', 'Dr. Priya Nair', 'Priya', 'Nair',
 ARRAY['Exam Anxiety', 'Peer Pressure', 'Social Adjustment', 'South Indian Student Support'],
 'video',
 'Clinical psychologist specializing in exam anxiety, peer pressure, and social adjustment issues among students. Experienced with South Indian students and familiar with regional academic pressures.',
 ARRAY['Malayalam', 'English', 'Tamil'],
 true,
 jsonb_build_object(
   'monday', ARRAY['08:00-16:00'],
   'tuesday', ARRAY['09:00-17:00'],
   'wednesday', ARRAY['08:00-16:00'],
   'thursday', ARRAY['09:00-17:00'],
   'friday', ARRAY['08:00-15:00']
 ),
 7, 4.9, NOW(), NOW()),

('cs-arjun-singh', 'Dr. Arjun Singh', 'Arjun', 'Singh',
 ARRAY['Family Pressure', 'Substance Prevention', 'Cultural Identity', 'North Indian Student Support'],
 'video',
 'Specialized in helping students deal with family pressure, substance abuse prevention, and cultural identity issues. Experienced with North Indian student communities and family dynamics.',
 ARRAY['Punjabi', 'Hindi', 'English'],
 true,
 jsonb_build_object(
   'tuesday', ARRAY['09:00-17:00'],
   'wednesday', ARRAY['10:00-18:00'],
   'thursday', ARRAY['09:00-17:00'],
   'friday', ARRAY['10:00-18:00'],
   'saturday', ARRAY['09:00-15:00']
 ),
 6, 4.6, NOW(), NOW()),

('cs-meera-patel', 'Dr. Meera Patel', 'Meera', 'Patel',
 ARRAY['JEE Stress', 'NEET Anxiety', 'Competitive Exams', 'Performance Anxiety', 'Study Burnout'],
 'video',
 'Expert in helping students with JEE, NEET, CAT and other competitive exam stress. Specialized in performance anxiety and study burnout. Gujarati and Hindi speaking counselor.',
 ARRAY['Gujarati', 'Hindi', 'English'],
 true,
 jsonb_build_object(
   'monday', ARRAY['09:00-17:00'],
   'wednesday', ARRAY['10:00-18:00'],
   'thursday', ARRAY['09:00-17:00'],
   'friday', ARRAY['10:00-18:00'],
   'saturday', ARRAY['10:00-16:00']
 ),
 7, 4.7, NOW(), NOW());

-- Clear existing resources and add Indian student-focused resources
DELETE FROM resources;

INSERT INTO resources (id, title, description, category, content_url, image_url, tags, created_at, updated_at) VALUES
('res-cbse-exam-stress', 'CBSE Board Exam Stress Management Guide', 
 'Comprehensive guide for managing stress during CBSE board examinations. Includes study techniques, time management, and anxiety coping strategies.',
 'Academic Support',
 'https://www.education.gov.in/en/cbse-student-support',
 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
 ARRAY['CBSE', 'Board Exams', 'Stress Management', 'Study Tips'],
 NOW(), NOW()),

('res-jee-neet-mental-health', 'JEE/NEET Preparation Mental Health Guide',
 'Mental health support guide for students preparing for competitive entrance exams. Covers burnout prevention, motivation maintenance, and dealing with failure.',
 'Exam Preparation',
 'https://www.nta.ac.in/student-wellness',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
 ARRAY['JEE', 'NEET', 'Entrance Exams', 'Mental Health', 'Competition'],
 NOW(), NOW()),

('res-college-admission-anxiety', 'College Admission Anxiety Help',
 'Support guide for students dealing with college admission process anxiety, course selection confusion, and transition fears.',
 'Career Guidance',
 'https://www.ugc.ac.in/student-support',
 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
 ARRAY['College Admission', 'Career Choice', 'Anxiety', 'Transition'],
 NOW(), NOW()),

('res-academic-pressure-india', 'Dealing with Academic Pressure in India',
 'Understanding and managing the unique academic pressures faced by Indian students, including family expectations and societal demands.',
 'Family Support',
 'https://www.mhrd.gov.in/student-wellness',
 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=400&h=300&fit=crop',
 ARRAY['Academic Pressure', 'Family Expectations', 'Indian Students', 'Social Pressure'],
 NOW(), NOW()),

('res-student-suicide-prevention', 'Student Suicide Prevention Resources',
 'Critical resources for students experiencing suicidal thoughts, including crisis contacts, warning signs, and immediate help options.',
 'Crisis Support',
 'https://www.kiran.gov.in/student-support',
 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop',
 ARRAY['Suicide Prevention', 'Crisis Support', 'Emergency Help', 'Mental Health'],
 NOW(), NOW()),

('res-campus-life-adjustment', 'Campus Life Adjustment Guide',
 'Guide for students adjusting to college life, hostel living, and being away from home for the first time.',
 'Campus Life',
 'https://www.ugc.ac.in/campus-life-support',
 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop',
 ARRAY['Campus Life', 'Hostel Life', 'Independence', 'Social Adjustment'],
 NOW(), NOW());

-- Clear existing events and add student-focused events
DELETE FROM events;

INSERT INTO events (id, title, description, date, location, category, max_participants, image_url, created_at, updated_at) VALUES
('evt-board-exam-workshop-delhi', 'Pre-Board Exam Stress Management Workshop - Delhi',
 'Interactive workshop for Class 10 and 12 students to learn stress management techniques before board exams. Includes mindfulness, time management, and exam strategy.',
 '2024-01-15 10:00:00+05:30',
 'Delhi Public School, Sector 24, Rohini, New Delhi',
 'Workshop',
 50,
 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop',
 NOW(), NOW()),

('evt-mental-health-week-mumbai', 'Mental Health Awareness Week - Mumbai University',
 'Week-long program with daily sessions on student mental health, peer support groups, and wellness activities for college students.',
 '2024-02-10 09:00:00+05:30',
 'Mumbai University, Kalina Campus, Santacruz East',
 'Conference',
 200,
 'https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=400&h=300&fit=crop',
 NOW(), NOW()),

('evt-peer-support-iit-delhi', 'Student Peer Support Circle - IIT Delhi',
 'Weekly peer support meetings for engineering students dealing with academic pressure, competition stress, and career anxiety.',
 '2024-01-20 16:00:00+05:30',
 'IIT Delhi, Hauz Khas, New Delhi',
 'Support Group',
 30,
 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&h=300&fit=crop',
 NOW(), NOW()),

('evt-mindfulness-bangalore', 'Mindfulness for Students - Bangalore',
 'Introduction to mindfulness and meditation techniques specifically designed for students dealing with exam stress and study pressure.',
 '2024-02-05 14:00:00+05:30',
 'Indian Institute of Science, Bangalore',
 'Workshop',
 40,
 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
 NOW(), NOW()),

('evt-career-counseling-chennai', 'Career Guidance Session - Chennai',
 'Group career counseling session for final year students dealing with career confusion and job market anxiety.',
 '2024-02-25 10:00:00+05:30',
 'Anna University, Chennai',
 'Counseling',
 60,
 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
 NOW(), NOW());

-- Add sample community posts about Indian student issues
INSERT INTO community_posts (id, user_id, title, content, category, is_anonymous, created_at, updated_at) VALUES
('post-board-exam-pressure', (SELECT id FROM profiles LIMIT 1), 
 'Dealing with Board Exam Pressure',
 'I''m in Class 12 and feeling overwhelmed with board exam preparation. My parents have high expectations and I''m scared of disappointing them. How do other students manage this pressure?',
 'Academic Stress', true, NOW(), NOW()),

('post-entrance-exam-stress', (SELECT id FROM profiles LIMIT 1 OFFSET 1),
 'JEE Preparation Taking a Toll on Mental Health',
 'I''ve been preparing for JEE for 2 years now. The competition and constant studying is affecting my sleep and mood. Sometimes I wonder if it''s worth it.',
 'Exam Preparation', false, NOW(), NOW()),

('post-family-career-expectations', (SELECT id FROM profiles LIMIT 1 OFFSET 2),
 'Family Doesn''t Support My Career Choice',
 'I want to pursue arts but my family wants me to become an engineer or doctor. The constant arguments at home are affecting my studies. Need advice.',
 'Family Issues', true, NOW(), NOW()),

('post-college-adjustment', (SELECT id FROM profiles LIMIT 1 OFFSET 3),
 'Struggling to Adjust to College Life',
 'First year in college away from home. Feeling homesick and finding it hard to make friends. The independence is overwhelming. Any tips?',
 'Campus Life', false, NOW(), NOW()),

('post-peer-pressure', (SELECT id FROM profiles LIMIT 1 OFFSET 4),
 'Peer Pressure in College',
 'Friends are pressuring me to skip classes and party. I want to focus on studies but don''t want to be left out. How to balance?',
 'Social Issues', true, NOW(), NOW());

-- Update any existing appointment records to remove pricing
UPDATE appointments SET notes = COALESCE(notes, '') || ' [FREE student counseling service]' WHERE notes IS NOT NULL;
UPDATE appointments SET notes = '[FREE student counseling service]' WHERE notes IS NULL;

-- Add indexes for better performance with student data
CREATE INDEX IF NOT EXISTS idx_counselors_specialization ON counselors(specialization);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);

-- Update any notification templates to be student-focused
UPDATE notification_templates 
SET content = REPLACE(content, 'appointment', 'free counseling session')
WHERE content LIKE '%appointment%';

UPDATE notification_templates
SET content = REPLACE(content, 'payment', 'session confirmation')
WHERE content LIKE '%payment%';

-- Ensure all services are marked as free in any configuration tables
INSERT INTO system_settings (key, value, description, created_at, updated_at) VALUES
('platform_type', 'student_focused', 'Platform serves Indian school and college students', NOW(), NOW()),
('services_free', 'true', 'All counseling services are completely free for students', NOW(), NOW()),
('target_audience', 'indian_students', 'Platform targets Indian students from Class 9 through college', NOW(), NOW()),
('default_language', 'en', 'Default language for the platform', NOW(), NOW()),
('supported_languages', 'en,hi,bn', 'Comma-separated list of supported languages', NOW(), NOW())
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = NOW();

COMMENT ON TABLE counselors IS 'Free counselors specializing in Indian student mental health';
COMMENT ON TABLE resources IS 'Educational and mental health resources for Indian students';
COMMENT ON TABLE events IS 'Student-focused mental health events and workshops';
COMMENT ON TABLE appointments IS 'Free counseling appointments for students - no payment required';