import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Counselor {
  id: string;
  name: string;
  specialties: string[];
  experience_years: number;
  rating: number;
  bio: string;
  qualifications: string;
  languages: string[];
  availability_schedule: any;
  contact_method: string;
  is_active: boolean;
}

interface Appointment {
  id: string;
  counselor_id: string;
  appointment_date: string;
  duration_minutes: number;
  type: string;
  status: string;
  notes?: string;
  is_anonymous: boolean;
}

export const useCounseling = () => {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounselors();
    fetchUserAppointments();
  }, []);

  const fetchCounselors = async () => {
    try {
      const { data, error } = await supabase
        .from('counselors')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setCounselors(data || []);
    } catch (error) {
      console.error('Error fetching counselors:', error);
    }
  };

  const fetchUserAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          counselors (
            name,
            specialties
          )
        `)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = async (counselorId: string, appointmentDate: string, type: string = 'video', isAnonymous: boolean = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          counselor_id: counselorId,
          appointment_date: appointmentDate,
          type: type,
          is_anonymous: isAnonymous,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh appointments list
      await fetchUserAppointments();
      return { data, error: null };
    } catch (error) {
      console.error('Error booking appointment:', error);
      return { data: null, error };
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (error) throw error;

      // Refresh appointments list
      await fetchUserAppointments();
      return { error: null };
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      return { error };
    }
  };

  const getAvailableSlots = (counselor: Counselor, date: Date) => {
    // This is a simplified implementation
    // In a real app, you'd check against existing appointments
    const schedule = counselor.availability_schedule;
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[date.getDay()];
    
    if (!schedule[dayName]) return [];

    const slots = [];
    const timeRanges = schedule[dayName];
    
    timeRanges.forEach((range: string) => {
      const [start, end] = range.split('-');
      const startHour = parseInt(start.split(':')[0]);
      const endHour = parseInt(end.split(':')[0]);
      
      for (let hour = startHour; hour < endHour; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        if (hour + 1 < endHour) {
          slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
      }
    });

    return slots;
  };

  return {
    counselors,
    appointments,
    loading,
    bookAppointment,
    cancelAppointment,
    getAvailableSlots,
    refreshAppointments: fetchUserAppointments
  };
};