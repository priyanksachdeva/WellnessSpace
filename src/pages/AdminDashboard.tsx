import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Users, Calendar, MessageSquare, TrendingUp, AlertTriangle, CheckCircle, Clock, Activity } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeConversations: 0,
    totalAppointments: 0,
    completedAssessments: 0
  });
  const [assessmentData, setAssessmentData] = useState([]);
  const [appointmentTrends, setAppointmentTrends] = useState([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch active conversations
      const { count: conversationCount } = await supabase
        .from('chat_conversations')
        .select('*', { count: 'exact', head: true });

      // Fetch appointments
      const { count: appointmentCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true });

      // Fetch assessments
      const { count: assessmentCount } = await supabase
        .from('psychological_assessments')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: userCount || 0,
        activeConversations: conversationCount || 0,
        totalAppointments: appointmentCount || 0,
        completedAssessments: assessmentCount || 0
      });

      // Fetch assessment severity distribution
      const { data: assessments } = await supabase
        .from('psychological_assessments')
        .select('severity_level, assessment_type');

      if (assessments) {
        const severityStats = assessments.reduce((acc, assessment) => {
          const severity = assessment.severity_level || 'Unknown';
          acc[severity] = (acc[severity] || 0) + 1;
          return acc;
        }, {});

        setAssessmentData(
          Object.entries(severityStats).map(([severity, count]) => ({
            name: severity,
            value: count
          }))
        );
      }

      // Mock appointment trends data (replace with real data when available)
      setAppointmentTrends([
        { date: '2024-01', appointments: 45 },
        { date: '2024-02', appointments: 52 },
        { date: '2024-03', appointments: 68 },
        { date: '2024-04', appointments: 71 },
        { date: '2024-05', appointments: 89 },
        { date: '2024-06', appointments: 94 }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>Please sign in to access the admin dashboard.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-heading font-bold text-white mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-white/90">
            Anonymous data analytics and system overview for institutional planning
          </p>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="group hover:shadow-elegant transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-elegant transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeConversations}</div>
                <p className="text-xs text-muted-foreground">
                  +8% from last week
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-elegant transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAppointments}</div>
                <p className="text-xs text-muted-foreground">
                  +23% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-elegant transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Assessments</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedAssessments}</div>
                <p className="text-xs text-muted-foreground">
                  +15% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Analytics */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appointment Trends</CardTitle>
                    <CardDescription>Monthly appointment bookings over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={appointmentTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="appointments" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Usage</CardTitle>
                    <CardDescription>Platform engagement metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">AI Chat Sessions</span>
                        <Badge variant="secondary">834</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Resource Downloads</span>
                        <Badge variant="secondary">1,247</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Community Posts</span>
                        <Badge variant="secondary">156</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Crisis Interventions</span>
                        <Badge variant="destructive">3</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="assessments" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Assessment Severity Distribution</CardTitle>
                    <CardDescription>Distribution of mental health assessment severity levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={assessmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {assessmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Assessment Types</CardTitle>
                    <CardDescription>Most commonly used screening tools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">PHQ-9 (Depression)</span>
                        <Badge variant="outline">67%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">GAD-7 (Anxiety)</span>
                        <Badge variant="outline">58%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">GHQ-12 (General Health)</span>
                        <Badge variant="outline">34%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">PSS-4 (Stress)</span>
                        <Badge variant="outline">29%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="appointments" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appointment Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Completed</span>
                        </div>
                        <Badge variant="secondary">234</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">Scheduled</span>
                        </div>
                        <Badge variant="secondary">89</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">Cancelled</span>
                        </div>
                        <Badge variant="secondary">23</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Popular Time Slots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">10:00 AM - 12:00 PM</span>
                        <Badge variant="outline">32%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">2:00 PM - 4:00 PM</span>
                        <Badge variant="outline">28%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">4:00 PM - 6:00 PM</span>
                        <Badge variant="outline">25%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">6:00 PM - 8:00 PM</span>
                        <Badge variant="outline">15%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Counselor Utilization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Dr. Sarah Chen</span>
                        <Badge variant="secondary">94%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Dr. Michael Rodriguez</span>
                        <Badge variant="secondary">87%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Dr. Emily Johnson</span>
                        <Badge variant="secondary">91%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="community" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Engagement</CardTitle>
                    <CardDescription>Peer support platform activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Active Support Groups</span>
                        <Badge variant="secondary">12</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Forum Posts This Week</span>
                        <Badge variant="secondary">89</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Peer Moderators</span>
                        <Badge variant="secondary">8</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Response Time</span>
                        <Badge variant="outline">2.3 hrs</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content Moderation</CardTitle>
                    <CardDescription>Community safety metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Posts Requiring Review</span>
                        <Badge variant="destructive">3</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto-Approved Posts</span>
                        <Badge variant="secondary">156</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Community Reports</span>
                        <Badge variant="secondary">2</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Crisis Flags</span>
                        <Badge variant="destructive">1</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;