import React, { useState } from 'react';
import {
  Bell,
  Search,
  Users,
  UserPlus,
  UserCheck,
  Check,
  Calendar,
  MessageSquare,
  BarChart2,
  Settings,
  LogOut,
  Home,
  ChevronRight,
  ChevronDown,
  Mail,
  Clock,
  MessageCircle,
  X,
  Menu,
  CheckCircle2,
  FileSpreadsheet,
  Stethoscope
} from 'lucide-react';

export interface CounsellingHubDashboardProps {
  onExit?: () => void;
  adminName?: string;
  onOpenDietPlanner?: () => void;
  onSwitchToClinicalDesk?: () => void;
  onOpenPlanNotifications?: () => void;
}

// Interfaces
interface LeadItem {
  id: string;
  name: string;
  age: number;
  package: string;
  location: string;
  meetingLocation?: string;
  contact: string;
  email?: string;
  date?: string;
  goal?: string;
  status: 'New' | 'Follow-up' | 'Interested' | 'Converted';
}

interface SoldItem {
  id: string;
  name: string;
  age?: number;
  date: string;
  package: string;
  goal: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  contact: string;
  email?: string;
  amount: number;
}

interface ReminderItem {
  id: string;
  name: string;
  age: number;
  goal: string;
  location: string;
  email: string;
  phone: string;
  daysOverdue: number;
  type: 'one-on-one' | 'long-term';
}

export const CounsellingHubDashboard: React.FC<CounsellingHubDashboardProps> = ({
  onExit,
  adminName = 'Admin',
  onOpenDietPlanner,
  onSwitchToClinicalDesk,
  onOpenPlanNotifications,
}) => {
  // Navigation & UI State
  const [activeNav, setActiveNav] = useState<'home' | 'leads' | 'clients' | 'calendar' | 'messages' | 'reports' | 'settings'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [showOneOnOneReminderModal, setShowOneOnOneReminderModal] = useState(false);
  const [showOneOnOneLeadsModal, setShowOneOnOneLeadsModal] = useState(false);
  const [showOneOnOneSoldModal, setShowOneOnOneSoldModal] = useState(false);
  const [showLongTermReminderModal, setShowLongTermReminderModal] = useState(false);
  const [showLongTermLeadsModal, setShowLongTermLeadsModal] = useState(false);
  const [showLongTermSoldModal, setShowLongTermSoldModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showEditDurationModal, setShowEditDurationModal] = useState(false);

  // Editable Duration State for One-on-One Sold
  const [oneOnOneDuration, setOneOnOneDuration] = useState('2 Hours (Editable)');
  const [tempDuration, setTempDuration] = useState('2 Hours');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Mock Realistic Data
  // 1-on-1 Reminders (3 pending)
  const [oneOnOneReminders, setOneOnOneReminders] = useState<ReminderItem[]>([
    {
      id: 'r1',
      name: 'Aarav S.',
      age: 17,
      goal: 'Career Guidance',
      location: 'Kolkata',
      email: 'aarav@example.com',
      phone: '+91 98765 11223',
      daysOverdue: 2,
      type: 'one-on-one',
    },
    {
      id: 'r2',
      name: 'Rohan Sharma',
      age: 18,
      goal: 'Board Exam Anxiety & Focus',
      location: 'Delhi',
      email: 'rohan.s@example.com',
      phone: '+91 98112 33445',
      daysOverdue: 3,
      type: 'one-on-one',
    },
    {
      id: 'r3',
      name: 'Meenakshi Roy',
      age: 16,
      goal: 'Stream Selection (Science vs Commerce)',
      location: 'Bangalore',
      email: 'meenakshi@example.com',
      phone: '+91 97401 55667',
      daysOverdue: 1,
      type: 'one-on-one',
    },
  ]);

  // Long-Term Reminders (5 pending)
  const [longTermReminders, setLongTermReminders] = useState<ReminderItem[]>([
    {
      id: 'lr1',
      name: 'Meera K.',
      age: 19,
      goal: 'Study Abroad',
      location: 'Delhi',
      email: 'meera@example.com',
      phone: '+91 98111 22334',
      daysOverdue: 2,
      type: 'long-term',
    },
    {
      id: 'lr2',
      name: 'Tanya Sengupta',
      age: 18,
      goal: 'NEET 2-Year Roadmap & Stress Management',
      location: 'Kolkata',
      email: 'tanya.sen@example.com',
      phone: '+91 98300 44556',
      daysOverdue: 4,
      type: 'long-term',
    },
    {
      id: 'lr3',
      name: 'Devendra Varma',
      age: 20,
      goal: 'Ivy League Admissions Portfolio',
      location: 'Mumbai',
      email: 'dev.varma@example.com',
      phone: '+91 99201 66778',
      daysOverdue: 1,
      type: 'long-term',
    },
    {
      id: 'lr4',
      name: 'Anushka Patel',
      age: 17,
      goal: 'Holistic Personality Development',
      location: 'Ahmedabad',
      email: 'anushka.p@example.com',
      phone: '+91 98250 88990',
      daysOverdue: 3,
      type: 'long-term',
    },
    {
      id: 'lr5',
      name: 'Kabir Singhania',
      age: 19,
      goal: 'Design School Entrance Mentorship',
      location: 'Pune',
      email: 'kabir.s@example.com',
      phone: '+91 98600 11442',
      daysOverdue: 2,
      type: 'long-term',
    },
  ]);

  // 1-on-1 Leads
  const oneOnOneLeads: LeadItem[] = [
    {
      id: 'ol1',
      name: 'Riya Sharma',
      age: 16,
      package: 'Career Assessment',
      location: 'Kolkata',
      meetingLocation: 'Offline (Salt Lake)',
      contact: '+91 98765 43210',
      email: 'riya.sharma@example.com',
      status: 'New',
    },
    {
      id: 'ol2',
      name: 'Arjun Nambiar',
      age: 17,
      package: '1-on-1 Clarity Session',
      location: 'Mumbai',
      meetingLocation: 'Google Meet',
      contact: '+91 98200 12345',
      email: 'arjun.n@example.com',
      status: 'Follow-up',
    },
    {
      id: 'ol3',
      name: 'Pooja Bhattacharya',
      age: 18,
      package: 'College Readiness Assessment',
      location: 'Kolkata',
      meetingLocation: 'Offline (Ballygunge)',
      contact: '+91 98311 98765',
      email: 'pooja.b@example.com',
      status: 'Interested',
    },
    {
      id: 'ol4',
      name: 'Samir Joshi',
      age: 16,
      package: 'Skill Mapping Diagnostic',
      location: 'Pune',
      meetingLocation: 'Zoom Video',
      contact: '+91 98900 45678',
      email: 'samir.j@example.com',
      status: 'New',
    },
  ];

  // 1-on-1 Sold
  const oneOnOneSold: SoldItem[] = [
    {
      id: 'os1',
      name: 'Aditya Verma',
      date: '02 Sep 2026',
      package: '1 Session (Career)',
      goal: 'College Planning',
      duration: oneOnOneDuration,
      contact: '+91 91234 56789',
      email: 'aditya.v@example.com',
      amount: 4000,
    },
    {
      id: 'os2',
      name: 'Priyanka Das',
      date: '04 Sep 2026',
      package: '2 Sessions (Aptitude & Choice)',
      goal: 'Subject Stream Decision',
      duration: '3 Hours',
      contact: '+91 98305 67890',
      email: 'priyanka.d@example.com',
      amount: 5000,
    },
    {
      id: 'os3',
      name: 'Varun Khurana',
      date: '05 Sep 2026',
      package: 'Express 1-on-1 Strategy',
      goal: 'Interview Preparation',
      duration: '2 Hours',
      contact: '+91 98101 23456',
      email: 'varun.k@example.com',
      amount: 4000,
    },
    {
      id: 'os4',
      name: 'Nisha Sundaram',
      date: '07 Sep 2026',
      package: 'Career Assessment Intensive',
      goal: 'Engineering vs Architecture',
      duration: '2.5 Hours',
      contact: '+91 98402 34567',
      email: 'nisha.s@example.com',
      amount: 4000,
    },
    {
      id: 'os5',
      name: 'Gaurav Sen',
      date: '08 Sep 2026',
      package: 'Profile Review Session',
      goal: 'Resume & SOP Polish',
      duration: '2 Hours',
      contact: '+91 98310 99887',
      email: 'gaurav.s@example.com',
      amount: 3500,
    },
    {
      id: 'os6',
      name: 'Divya Rastogi',
      date: '09 Sep 2026',
      package: '1 Session (Foundation)',
      goal: 'Time Management Strategy',
      duration: '2 Hours',
      contact: '+91 97110 55443',
      email: 'divya.r@example.com',
      amount: 3500,
    },
  ];

  // Long-Term Leads
  const longTermLeads: LeadItem[] = [
    {
      id: 'll1',
      name: 'Karan Mehta',
      age: 18,
      package: 'Premium Plan',
      location: 'Mumbai',
      contact: '+91 99876 54321',
      email: 'karan.m@example.com',
      status: 'Interested',
    },
    {
      id: 'll2',
      name: 'Aishwarya Nair',
      age: 17,
      package: '1-Year Comprehensive Mentorship',
      location: 'Bangalore',
      contact: '+91 98450 67891',
      email: 'aishwarya.n@example.com',
      status: 'New',
    },
    {
      id: 'll3',
      name: 'Rishi Poddar',
      age: 19,
      package: '6-Month University Prep',
      location: 'Delhi',
      contact: '+91 98119 22331',
      email: 'rishi.p@example.com',
      status: 'Follow-up',
    },
    {
      id: 'll4',
      name: 'Trisha Bannerjee',
      age: 18,
      package: 'Ivy League Long-Term Track',
      location: 'Kolkata',
      contact: '+91 98302 77889',
      email: 'trisha.b@example.com',
      status: 'Interested',
    },
  ];

  // Long-Term Sold
  const longTermSold: SoldItem[] = [
    {
      id: 'ls1',
      name: 'Sneha Iyer',
      age: 17,
      package: 'Yearly Mentorship',
      goal: 'IIT Preparation',
      startDate: '01 Aug 2026',
      endDate: '31 Jul 2027',
      contact: '+91 98765 00123',
      email: 'sneha.iyer@example.com',
      amount: 35000,
      date: '01 Aug 2026',
    },
    {
      id: 'ls2',
      name: 'Pranav Kulkarni',
      age: 18,
      package: '6-Month Board & SAT Mentorship',
      goal: 'US College Admissions',
      startDate: '15 Aug 2026',
      endDate: '15 Feb 2027',
      contact: '+91 98210 44556',
      email: 'pranav.k@example.com',
      amount: 30000,
      date: '15 Aug 2026',
    },
    {
      id: 'ls3',
      name: 'Tanuja Deshmukh',
      age: 19,
      package: '9-Month Transformation Plan',
      goal: 'Medical Entrance & Mindset Mastery',
      startDate: '20 Aug 2026',
      endDate: '20 May 2027',
      contact: '+91 98670 88991',
      email: 'tanuja.d@example.com',
      amount: 30000,
      date: '20 Aug 2026',
    },
    {
      id: 'ls4',
      name: 'Siddharth Mukherjee',
      age: 17,
      package: 'Annual Leadership & Career Plan',
      goal: 'National Law School Prep',
      startDate: '01 Sep 2026',
      endDate: '31 Aug 2027',
      contact: '+91 98315 12344',
      email: 'sid.m@example.com',
      amount: 25000,
      date: '01 Sep 2026',
    },
  ];

  // Handlers for communication
  const handleWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello ${name}, this is your counsellor reaching out from Counselling Hub. We wanted to check in regarding your upcoming session and progress.`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    showToast(`Opening WhatsApp chat for ${name}`);
  };

  const handleEmail = (email: string, name: string) => {
    const subject = encodeURIComponent(`Counselling Hub: Follow-up & Next Steps for ${name}`);
    const body = encodeURIComponent(`Dear ${name},\n\nWe hope you are having a wonderful week. This is a quick follow-up from Counselling Hub to support your next milestones.\n\nPlease let us know if you have any questions or would like to schedule your next check-in.\n\nWarm regards,\nCounselling Hub Team`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
    showToast(`Composing email for ${name}`);
  };

  const handleSMS = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const body = encodeURIComponent(`Hello ${name}, this is Counselling Hub with your follow-up reminder. Please reply to schedule your check-in.`);
    window.open(`sms:${cleanPhone}?body=${body}`, '_blank');
    showToast(`Opening SMS composer for ${name}`);
  };

  const handleDismissReminder = (id: string, type: 'one-on-one' | 'long-term') => {
    if (type === 'one-on-one') {
      setOneOnOneReminders(prev => prev.filter(r => r.id !== id));
    } else {
      setLongTermReminders(prev => prev.filter(r => r.id !== id));
    }
    showToast('Reminder marked as resolved!');
  };

  const handleSaveDuration = () => {
    if (tempDuration.trim()) {
      setOneOnOneDuration(`${tempDuration.trim()} (Editable)`);
      setShowEditDurationModal(false);
      showToast('Duration updated successfully!');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F5F7FA',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#1E293B',
      }}
    >
      {/* =========================================================================
          LEFT NAVIGATION SIDEBAR (Desktop)
         ========================================================================= */}
      <aside
        style={{
          width: '90px',
          minWidth: '90px',
          backgroundColor: '#141E18',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 0 20px 0',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: 40,
        }}
        className="hidden md:flex"
      >
        {/* Top: Logo & Main Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '20px' }}>
          {/* Leaf Logo Icon */}
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px',
              cursor: 'pointer',
            }}
            onClick={() => setActiveNav('home')}
            title="Counselling Hub"
          >
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M27.5 4.5C18.5 4.5 12 9.5 10 16C8.5 14 6 12.5 3 13C3 19 7 24 13 25C15 25 16 23.5 16.5 22C17.5 25.5 20.5 27.5 25.5 27.5C27 27.5 29 27 29 27C29 27 29.5 15.5 27.5 4.5Z"
                fill="#4ADE80"
              />
              <path
                d="M10 16C12.5 19 16 21 21 21"
                stroke="#141E18"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Nav Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
            {/* Home */}
            <button
              onClick={() => setActiveNav('home')}
              style={{
                width: '64px',
                height: '58px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                backgroundColor: activeNav === 'home' ? '#243A2C' : 'transparent',
                color: activeNav === 'home' ? '#FFFFFF' : '#8E9B94',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Home"
            >
              <Home size={20} color={activeNav === 'home' ? '#FFFFFF' : '#8E9B94'} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Home</span>
            </button>

            {/* Leads */}
            <button
              onClick={() => {
                setActiveNav('leads');
                setShowOneOnOneLeadsModal(true);
              }}
              style={{
                width: '64px',
                height: '58px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                backgroundColor: activeNav === 'leads' ? '#243A2C' : 'transparent',
                color: activeNav === 'leads' ? '#FFFFFF' : '#8E9B94',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Leads"
            >
              <UserPlus size={20} color={activeNav === 'leads' ? '#FFFFFF' : '#8E9B94'} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Leads</span>
            </button>

            {/* Clients */}
            <button
              onClick={() => {
                setActiveNav('clients');
                setShowOneOnOneSoldModal(true);
              }}
              style={{
                width: '64px',
                height: '58px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                backgroundColor: activeNav === 'clients' ? '#243A2C' : 'transparent',
                color: activeNav === 'clients' ? '#FFFFFF' : '#8E9B94',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Clients"
            >
              <Users size={20} color={activeNav === 'clients' ? '#FFFFFF' : '#8E9B94'} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Clients</span>
            </button>

            {/* Calendar */}
            <button
              onClick={() => {
                setActiveNav('calendar');
                showToast('Calendar schedule active');
              }}
              style={{
                width: '64px',
                height: '58px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                backgroundColor: activeNav === 'calendar' ? '#243A2C' : 'transparent',
                color: activeNav === 'calendar' ? '#FFFFFF' : '#8E9B94',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Calendar"
            >
              <Calendar size={20} color={activeNav === 'calendar' ? '#FFFFFF' : '#8E9B94'} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Calendar</span>
            </button>

            {/* Messages */}
            <button
              onClick={() => {
                setActiveNav('messages');
                setShowOneOnOneReminderModal(true);
              }}
              style={{
                width: '64px',
                height: '58px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                backgroundColor: activeNav === 'messages' ? '#243A2C' : 'transparent',
                color: activeNav === 'messages' ? '#FFFFFF' : '#8E9B94',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Messages"
            >
              <MessageSquare size={20} color={activeNav === 'messages' ? '#FFFFFF' : '#8E9B94'} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Messages</span>
            </button>

            {/* Reports */}
            <button
              onClick={() => {
                setActiveNav('reports');
                showToast('Monthly analytics report ready');
              }}
              style={{
                width: '64px',
                height: '58px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                backgroundColor: activeNav === 'reports' ? '#243A2C' : 'transparent',
                color: activeNav === 'reports' ? '#FFFFFF' : '#8E9B94',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Reports"
            >
              <BarChart2 size={20} color={activeNav === 'reports' ? '#FFFFFF' : '#8E9B94'} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Reports</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => {
                setActiveNav('settings');
                showToast('Dashboard preferences loaded');
              }}
              style={{
                width: '64px',
                height: '58px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                backgroundColor: activeNav === 'settings' ? '#243A2C' : 'transparent',
                color: activeNav === 'settings' ? '#FFFFFF' : '#8E9B94',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Settings"
            >
              <Settings size={20} color={activeNav === 'settings' ? '#FFFFFF' : '#8E9B94'} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Settings</span>
            </button>

            {/* Diet Planner */}
            <button
              onClick={() => {
                if (onOpenDietPlanner) onOpenDietPlanner();
                else showToast('Opening Diet Planner...');
              }}
              style={{
                width: '64px',
                height: '58px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                backgroundColor: 'rgba(16, 185, 129, 0.18)',
                color: '#4ADE80',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Open Diet Planner"
            >
              <FileSpreadsheet size={20} color="#4ADE80" />
              <span style={{ fontSize: '10.5px', fontWeight: 700 }}>Diet Plan</span>
            </button>

            {/* Clinical Desk */}
            {onSwitchToClinicalDesk && (
              <button
                onClick={onSwitchToClinicalDesk}
                style={{
                  width: '64px',
                  height: '58px',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(232, 202, 86, 0.16)',
                  color: '#E8CA56',
                  border: '1px solid rgba(232, 202, 86, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title="Switch to Clinical Command Desk"
              >
                <Stethoscope size={20} color="#E8CA56" />
                <span style={{ fontSize: '10.5px', fontWeight: 700 }}>Clinical</span>
              </button>
            )}
          </nav>
        </div>

        {/* Bottom: Logout */}
        <button
          onClick={() => {
            if (onExit) onExit();
            else showToast('Logged out of Admin Session');
          }}
          style={{
            width: '64px',
            height: '54px',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            backgroundColor: 'transparent',
            color: '#8E9B94',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Exit / Logout"
        >
          <LogOut size={20} color="#8E9B94" />
          <span style={{ fontSize: '11px', fontWeight: 600 }}>Logout</span>
        </button>
      </aside>

      {/* =========================================================================
          MAIN APPLICATION AREA
         ========================================================================= */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        {/* Top Bar matching design */}
        <header
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          {/* Left Title & Subtitle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                color: '#1E293B',
              }}
            >
              <Menu size={22} />
            </button>

            <div>
              <h1
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#111827',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                Counselling Hub
              </h1>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0, marginTop: '2px' }}>
                Support Today. Brighter Tomorrows:
              </p>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div
            style={{
              position: 'relative',
              width: '320px',
              maxWidth: '360px',
            }}
            className="hidden sm:block"
          >
            <Search
              size={17}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94A3B8',
              }}
            />
            <input
              type="text"
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 16px 9px 40px',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                fontSize: '13.5px',
                color: '#1E293B',
                outline: 'none',
                transition: 'all 0.15s ease',
              }}
            />
          </div>

          {/* Right: Notifications & Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Quick Diet Planner Button */}
            <button
              onClick={() => {
                if (onOpenDietPlanner) onOpenDietPlanner();
                else showToast('Opening Diet Planner...');
              }}
              style={{
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                transition: 'all 0.15s ease',
              }}
              title="Open Clinical Diet Planner"
            >
              <FileSpreadsheet size={15} />
              <span>Diet Planner 🥗</span>
            </button>

            {/* Plan Notifications Automation Button */}
            <button
              onClick={() => {
                if (onOpenPlanNotifications) onOpenPlanNotifications();
                else showToast('Opening Plan Notifications Manager...');
              }}
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.15s ease',
              }}
              title="Open Plan Notifications Manager (Android & iOS)"
            >
              <Bell size={15} />
              <span>Notifications 📱</span>
            </button>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotificationsModal(true)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  color: '#475569',
                }}
                title="Notifications"
              >
                <Bell size={18} />
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#EF4444',
                    borderRadius: '50%',
                    border: '1.5px solid #FFFFFF',
                  }}
                />
              </button>
            </div>

            {/* Profile Avatar & Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#26332E',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                }}
              >
                AD
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{adminName}</span>
                  <ChevronDown size={14} color="#64748B" />
                </div>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Tue, 9 Sep 2026</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '260px',
              height: '100%',
              backgroundColor: '#141E18',
              zIndex: 100,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <path
                      d="M27.5 4.5C18.5 4.5 12 9.5 10 16C8.5 14 6 12.5 3 13C3 19 7 24 13 25C15 25 16 23.5 16.5 22C17.5 25.5 20.5 27.5 25.5 27.5C27 27.5 29 27 29 27C29 27 29.5 15.5 27.5 4.5Z"
                      fill="#4ADE80"
                    />
                  </svg>
                  <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '17px' }}>Counselling Hub</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#8E9B94', cursor: 'pointer' }}
                >
                  <X size={22} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => { setActiveNav('home'); setIsMobileMenuOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: activeNav === 'home' ? '#243A2C' : 'transparent',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  <Home size={18} /> Home
                </button>
                <button
                  onClick={() => { setShowOneOnOneLeadsModal(true); setIsMobileMenuOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: 'transparent',
                    color: '#8E9B94',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  <UserPlus size={18} /> Leads
                </button>
                <button
                  onClick={() => { setShowOneOnOneSoldModal(true); setIsMobileMenuOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: 'transparent',
                    color: '#8E9B94',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  <Users size={18} /> Clients
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onExit) onExit();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                color: '#EF4444',
                background: 'none',
                border: 'none',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}

        {/* Main Content: 2-Column Responsive Workspace */}
        <main
          style={{
            flex: 1,
            padding: '24px 28px 48px 28px',
            maxWidth: '1480px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          {/* Toast Notification Banner */}
          {toastMessage && (
            <div
              style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                backgroundColor: '#1E293B',
                color: '#FFFFFF',
                padding: '12px 20px',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13.5px',
                fontWeight: 600,
                zIndex: 999,
              }}
            >
              <CheckCircle2 size={18} color="#4ADE80" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* TWO CLEARLY SEPARATED COLUMNS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '24px',
              alignItems: 'start',
            }}
          >
            {/* ===================================================================
                LEFT COLUMN: ONE-ON-ONE COUNSELLING (GREEN THEME)
               =================================================================== */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* 1. Header Card (One-on-One) */}
              <div
                style={{
                  backgroundColor: '#EBF9F1',
                  borderRadius: '20px',
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 10px rgba(16, 185, 129, 0.04)',
                  border: '1px solid #D1F2E0',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: '20px',
                      fontWeight: 800,
                      color: '#064E3B',
                      margin: 0,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    One-on-One Counselling
                  </h2>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#4A6D56',
                      margin: 0,
                      marginTop: '3px',
                      fontWeight: 500,
                    }}
                  >
                    Personal. Focused. Forward.
                  </p>
                </div>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: '#D7F3E3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#065F46',
                  }}
                >
                  <UserPlus size={22} />
                </div>
              </div>

              {/* 3 COMPACT SQUARE ACTION BOXES (One-on-One) */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                {/* 2. COMPACT SQUARE: FOLLOW-UP REMINDER CARD (One-on-One) */}
                <div
                  onClick={() => setShowOneOnOneReminderModal(true)}
                  style={{
                    backgroundColor: '#EBF9F1',
                    borderRadius: '18px',
                    padding: '14px',
                    border: '1.5px solid #D1F2E0',
                    boxShadow: '0 2px 10px rgba(16, 185, 129, 0.04)',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    width: '150px',
                    height: '150px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  title="Click to view Follow Up Reminders"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                      }}
                    >
                      <Bell size={18} />
                    </div>

                    <span
                      style={{
                        minWidth: '22px',
                        height: '22px',
                        borderRadius: '11px',
                        backgroundColor: '#EF4444',
                        color: '#FFFFFF',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 6px',
                      }}
                    >
                      {oneOnOneReminders.length}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.25 }}>
                      Follow Up Reminders
                    </h3>
                    <p style={{ fontSize: '10.5px', color: '#065F46', margin: '4px 0 0', fontWeight: 600 }}>
                      {oneOnOneReminders.length} Pending
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #D1F2E0', paddingTop: '6px' }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#065F46' }}>View</span>
                    <ChevronRight size={14} color="#065F46" />
                  </div>
                </div>

                {/* 3. COMPACT SQUARE: ONE-ON-ONE LEADS CARD */}
                <div
                  onClick={() => setShowOneOnOneLeadsModal(true)}
                  style={{
                    backgroundColor: '#EBF9F1',
                    borderRadius: '18px',
                    padding: '14px',
                    border: '1.5px solid #D1F2E0',
                    boxShadow: '0 2px 10px rgba(16, 185, 129, 0.04)',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    width: '150px',
                    height: '150px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  title="Click to view One-on-One Leads"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                      }}
                    >
                      <UserCheck size={18} />
                    </div>

                    <span
                      style={{
                        minWidth: '22px',
                        height: '22px',
                        borderRadius: '11px',
                        backgroundColor: '#D1FAE5',
                        color: '#065F46',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 6px',
                      }}
                    >
                      {oneOnOneLeads.length}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.25 }}>
                      One-on-One Leads
                    </h3>
                    <p style={{ fontSize: '10.5px', color: '#065F46', margin: '4px 0 0', fontWeight: 600 }}>
                      {oneOnOneLeads.length} Active Leads
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #D1F2E0', paddingTop: '6px' }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#065F46' }}>View</span>
                    <ChevronRight size={14} color="#065F46" />
                  </div>
                </div>

                {/* 4. COMPACT SQUARE: ONE-ON-ONE SOLD CARD */}
                <div
                  onClick={() => setShowOneOnOneSoldModal(true)}
                  style={{
                    backgroundColor: '#EBF9F1',
                    borderRadius: '18px',
                    padding: '14px',
                    border: '1.5px solid #D1F2E0',
                    boxShadow: '0 2px 10px rgba(16, 185, 129, 0.04)',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    width: '150px',
                    height: '150px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  title="Click to view One-on-One Sold Clients"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                      }}
                    >
                      <Check size={18} strokeWidth={2.5} />
                    </div>

                    <span
                      style={{
                        minWidth: '22px',
                        height: '22px',
                        borderRadius: '11px',
                        backgroundColor: '#D1FAE5',
                        color: '#065F46',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 6px',
                      }}
                    >
                      {oneOnOneSold.length}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.25 }}>
                      One-on-One Sold
                    </h3>
                    <p style={{ fontSize: '10.5px', color: '#065F46', margin: '4px 0 0', fontWeight: 600 }}>
                      {oneOnOneSold.length} Enrolled
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #D1F2E0', paddingTop: '6px' }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#065F46' }}>View</span>
                    <ChevronRight size={14} color="#065F46" />
                  </div>
                </div>
              </div>
            </div>

            {/* ===================================================================
                RIGHT COLUMN: LONG-TERM COUNSELLING (BLUE THEME)
               =================================================================== */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* 1. Header Card (Long-Term) */}
              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  borderRadius: '20px',
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 10px rgba(59, 130, 246, 0.04)',
                  border: '1px solid #DBEAFE',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: '20px',
                      fontWeight: 800,
                      color: '#1E3A8A',
                      margin: 0,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Long-Term Counselling
                  </h2>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#3B82F6',
                      margin: 0,
                      marginTop: '3px',
                      fontWeight: 500,
                    }}
                  >
                    Guidance for a bigger tomorrow.
                  </p>
                </div>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: '#DBEAFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1E40AF',
                  }}
                >
                  <BarChart2 size={22} />
                </div>
              </div>

              {/* 3 COMPACT SQUARE ACTION BOXES (Long-Term) */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                {/* 2. COMPACT SQUARE: FOLLOW-UP REMINDER CARD (Long-Term) */}
                <div
                  onClick={() => setShowLongTermReminderModal(true)}
                  style={{
                    backgroundColor: "#EFF6FF",
                    borderRadius: "18px",
                    padding: "14px",
                    border: "1.5px solid #DBEAFE",
                    boxShadow: "0 2px 10px rgba(59, 130, 246, 0.04)",
                    cursor: "pointer",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    width: "150px",
                    height: "150px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  title="Click to view Follow Up Reminders"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "#2563EB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFFFFF",
                      }}
                    >
                      <Bell size={18} />
                    </div>

                    <span
                      style={{
                        minWidth: "22px",
                        height: "22px",
                        borderRadius: "11px",
                        backgroundColor: "#EF4444",
                        color: "#FFFFFF",
                        fontSize: "11.5px",
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 6px",
                      }}
                    >
                      {longTermReminders.length}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: "13.5px", fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.25 }}>
                      Follow Up Reminders
                    </h3>
                    <p style={{ fontSize: "10.5px", color: "#1E40AF", margin: "4px 0 0", fontWeight: 600 }}>
                      {longTermReminders.length} Pending
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #DBEAFE", paddingTop: "6px" }}>
                    <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#1E40AF" }}>View</span>
                    <ChevronRight size={14} color="#1E40AF" />
                  </div>
                </div>

                {/* 3. COMPACT SQUARE: LONG-TERM LEADS CARD */}
                <div
                  onClick={() => setShowLongTermLeadsModal(true)}
                  style={{
                    backgroundColor: "#EFF6FF",
                    borderRadius: "18px",
                    padding: "14px",
                    border: "1.5px solid #DBEAFE",
                    boxShadow: "0 2px 10px rgba(59, 130, 246, 0.04)",
                    cursor: "pointer",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    width: "150px",
                    height: "150px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  title="Click to view Long-Term Leads"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "#2563EB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFFFFF",
                      }}
                    >
                      <BarChart2 size={18} />
                    </div>

                    <span
                      style={{
                        minWidth: "22px",
                        height: "22px",
                        borderRadius: "11px",
                        backgroundColor: "#DBEAFE",
                        color: "#1E40AF",
                        fontSize: "11.5px",
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 6px",
                      }}
                    >
                      {longTermLeads.length}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: "13.5px", fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.25 }}>
                      Long-Term Leads
                    </h3>
                    <p style={{ fontSize: "10.5px", color: "#1E40AF", margin: "4px 0 0", fontWeight: 600 }}>
                      {longTermLeads.length} Active Leads
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #DBEAFE", paddingTop: "6px" }}>
                    <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#1E40AF" }}>View</span>
                    <ChevronRight size={14} color="#1E40AF" />
                  </div>
                </div>

                {/* 4. COMPACT SQUARE: LONG-TERM SOLD CARD */}
                <div
                  onClick={() => setShowLongTermSoldModal(true)}
                  style={{
                    backgroundColor: "#EFF6FF",
                    borderRadius: "18px",
                    padding: "14px",
                    border: "1.5px solid #DBEAFE",
                    boxShadow: "0 2px 10px rgba(59, 130, 246, 0.04)",
                    cursor: "pointer",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    width: "150px",
                    height: "150px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  title="Click to view Long-Term Sold Clients"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "#2563EB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFFFFF",
                      }}
                    >
                      <Check size={18} strokeWidth={2.5} />
                    </div>

                    <span
                      style={{
                        minWidth: "22px",
                        height: "22px",
                        borderRadius: "11px",
                        backgroundColor: "#DBEAFE",
                        color: "#1E40AF",
                        fontSize: "11.5px",
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 6px",
                      }}
                    >
                      {longTermSold.length}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: "13.5px", fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.25 }}>
                      Long-Term Sold
                    </h3>
                    <p style={{ fontSize: "10.5px", color: "#1E40AF", margin: "4px 0 0", fontWeight: 600 }}>
                      {longTermSold.length} Enrolled
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #DBEAFE", paddingTop: "6px" }}>
                    <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#1E40AF" }}>View</span>
                    <ChevronRight size={14} color="#1E40AF" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* =========================================================================
          MODALS & INTERACTIVE OVERLAYS
         ========================================================================= */}

      {/* 1. One-on-One Reminders Modal */}
      {showOneOnOneReminderModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 150,
            padding: '20px',
          }}
          onClick={() => setShowOneOnOneReminderModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '26px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '2px solid #D1F2E0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                  <Bell size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#064E3B', margin: 0 }}>
                    One-on-One Follow Up Reminders
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                    {oneOnOneReminders.length} client(s) needing attention (&gt; 1 day without contact)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowOneOnOneReminderModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {oneOnOneReminders.map((rem) => (
                <div
                  key={rem.id}
                  style={{
                    backgroundColor: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    borderRadius: '14px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                        {rem.name} <span style={{ fontSize: '12px', color: '#64748B' }}>({rem.age} yrs)</span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#047857', marginTop: '2px' }}>
                        🎯 Goal: <strong>{rem.goal}</strong>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                        📍 {rem.location} • ✉️ {rem.email} • 📞 {rem.phone}
                      </div>
                    </div>
                    <span
                      style={{
                        backgroundColor: '#FEE2E2',
                        color: '#991B1B',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {rem.daysOverdue}d overdue
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #DCFCE7' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleWhatsApp(rem.phone, rem.name)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#22C55E',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <MessageCircle size={14} /> WhatsApp
                      </button>
                      <button
                        onClick={() => handleEmail(rem.email, rem.name)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#2563EB',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <Mail size={14} /> Email
                      </button>
                      <button
                        onClick={() => handleSMS(rem.phone, rem.name)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#1E293B',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <MessageSquare size={14} /> SMS
                      </button>
                    </div>

                    <button
                      onClick={() => handleDismissReminder(rem.id, 'one-on-one')}
                      style={{
                        backgroundColor: '#ECFDF5',
                        color: '#047857',
                        border: '1px solid #A7F3D0',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Mark Contacted ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Long-Term Reminders Modal */}
      {showLongTermReminderModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 150,
            padding: '20px',
          }}
          onClick={() => setShowLongTermReminderModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '26px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '2px solid #BFDBFE',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                  <Bell size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1E3A8A', margin: 0 }}>
                    Long-Term Follow Up Reminders
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                    {longTermReminders.length} long-term client(s) pending follow-up (&gt; 1 day)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLongTermReminderModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {longTermReminders.map((rem) => (
                <div
                  key={rem.id}
                  style={{
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '14px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                        {rem.name} <span style={{ fontSize: '12px', color: '#64748B' }}>({rem.age} yrs)</span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#2563EB', marginTop: '2px' }}>
                        🎯 Target Track: <strong>{rem.goal}</strong>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                        📍 {rem.location} • ✉️ {rem.email} • 📞 {rem.phone}
                      </div>
                    </div>
                    <span
                      style={{
                        backgroundColor: '#FEE2E2',
                        color: '#991B1B',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {rem.daysOverdue}d overdue
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #DBEAFE' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleWhatsApp(rem.phone, rem.name)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#22C55E',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <MessageCircle size={14} /> WhatsApp
                      </button>
                      <button
                        onClick={() => handleEmail(rem.email, rem.name)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#2563EB',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <Mail size={14} /> Email
                      </button>
                      <button
                        onClick={() => handleSMS(rem.phone, rem.name)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#1E293B',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <MessageSquare size={14} /> SMS
                      </button>
                    </div>

                    <button
                      onClick={() => handleDismissReminder(rem.id, 'long-term')}
                      style={{
                        backgroundColor: '#DBEAFE',
                        color: '#1E40AF',
                        border: '1px solid #93C5FD',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Mark Contacted ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. One-on-One All Leads Modal */}
      {showOneOnOneLeadsModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 150,
            padding: '20px',
          }}
          onClick={() => setShowOneOnOneLeadsModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '26px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '2px solid #D1F2E0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#064E3B', margin: 0 }}>
                  All One-on-One Leads
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0, marginTop: '2px' }}>
                  Registered prospects interested in short-term and single counselling sessions
                </p>
              </div>
              <button
                onClick={() => setShowOneOnOneLeadsModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontWeight: 700 }}>
                    <th style={{ padding: '10px 12px' }}>Name</th>
                    <th style={{ padding: '10px 12px' }}>Age</th>
                    <th style={{ padding: '10px 12px' }}>Package</th>
                    <th style={{ padding: '10px 12px' }}>Location</th>
                    <th style={{ padding: '10px 12px' }}>Meeting</th>
                    <th style={{ padding: '10px 12px' }}>Contact</th>
                    <th style={{ padding: '10px 12px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {oneOnOneLeads.map((lead) => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#111827' }}>{lead.name}</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{lead.age}</td>
                      <td style={{ padding: '12px', color: '#047857', fontWeight: 600 }}>{lead.package}</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{lead.location}</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{lead.meetingLocation}</td>
                      <td style={{ padding: '12px', color: '#111827' }}>{lead.contact}</td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => handleWhatsApp(lead.contact, lead.name)}
                          style={{
                            backgroundColor: '#10B981',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Connect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. One-on-One All Sold Modal */}
      {showOneOnOneSoldModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 150,
            padding: '20px',
          }}
          onClick={() => setShowOneOnOneSoldModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '26px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '2px solid #D1F2E0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#064E3B', margin: 0 }}>
                  One-on-One Sold Clients (This Month)
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0, marginTop: '2px' }}>
                  Total Payment Received: <strong>₹ 24,000</strong> • <strong>6</strong> Active Clients
                </p>
              </div>
              <button
                onClick={() => setShowOneOnOneSoldModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontWeight: 700 }}>
                    <th style={{ padding: '10px 12px' }}>Client Name</th>
                    <th style={{ padding: '10px 12px' }}>Date</th>
                    <th style={{ padding: '10px 12px' }}>Package</th>
                    <th style={{ padding: '10px 12px' }}>Goal</th>
                    <th style={{ padding: '10px 12px' }}>Duration</th>
                    <th style={{ padding: '10px 12px' }}>Paid</th>
                    <th style={{ padding: '10px 12px' }}>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {oneOnOneSold.map((sold) => (
                    <tr key={sold.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#111827' }}>{sold.name}</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{sold.date}</td>
                      <td style={{ padding: '12px', color: '#047857', fontWeight: 600 }}>{sold.package}</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{sold.goal}</td>
                      <td style={{ padding: '12px', color: '#111827', fontWeight: 600 }}>{sold.duration}</td>
                      <td style={{ padding: '12px', color: '#059669', fontWeight: 700 }}>₹ {sold.amount.toLocaleString()}</td>
                      <td style={{ padding: '12px', color: '#111827' }}>{sold.contact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Long-Term All Leads Modal */}
      {showLongTermLeadsModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 150,
            padding: '20px',
          }}
          onClick={() => setShowLongTermLeadsModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '26px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '2px solid #BFDBFE',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1E3A8A', margin: 0 }}>
                  All Long-Term Leads
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0, marginTop: '2px' }}>
                  Registered prospects interested in multi-month mentorship and transformation programs
                </p>
              </div>
              <button
                onClick={() => setShowLongTermLeadsModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontWeight: 700 }}>
                    <th style={{ padding: '10px 12px' }}>Name</th>
                    <th style={{ padding: '10px 12px' }}>Age</th>
                    <th style={{ padding: '10px 12px' }}>Package Decided</th>
                    <th style={{ padding: '10px 12px' }}>Location</th>
                    <th style={{ padding: '10px 12px' }}>Contact</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                    <th style={{ padding: '10px 12px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {longTermLeads.map((lead) => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#111827' }}>{lead.name}</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{lead.age}</td>
                      <td style={{ padding: '12px', color: '#2563EB', fontWeight: 600 }}>{lead.package}</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{lead.location}</td>
                      <td style={{ padding: '12px', color: '#111827' }}>{lead.contact}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '3px 8px', borderRadius: '6px' }}>
                          {lead.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => handleWhatsApp(lead.contact, lead.name)}
                          style={{
                            backgroundColor: '#2563EB',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Message
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. Long-Term All Sold Modal */}
      {showLongTermSoldModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 150,
            padding: '20px',
          }}
          onClick={() => setShowLongTermSoldModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '860px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '26px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '2px solid #BFDBFE',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1E3A8A', margin: 0 }}>
                  Long-Term Sold Clients (This Month)
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0, marginTop: '2px' }}>
                  Total Payment Received: <strong>₹ 1,20,000</strong> • <strong>4</strong> Active Long-Term Clients
                </p>
              </div>
              <button
                onClick={() => setShowLongTermSoldModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontWeight: 700 }}>
                    <th style={{ padding: '10px 12px' }}>Client</th>
                    <th style={{ padding: '10px 12px' }}>Package</th>
                    <th style={{ padding: '10px 12px' }}>Goal</th>
                    <th style={{ padding: '10px 12px' }}>Duration Schedule</th>
                    <th style={{ padding: '10px 12px' }}>Amount Paid</th>
                    <th style={{ padding: '10px 12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {longTermSold.map((sold) => (
                    <tr key={sold.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#111827' }}>
                        {sold.name}
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{sold.contact}</div>
                      </td>
                      <td style={{ padding: '12px', color: '#1D4ED8', fontWeight: 600 }}>{sold.package}</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{sold.goal}</td>
                      <td style={{ padding: '12px', color: '#111827', fontSize: '12px' }}>
                        {sold.startDate} → {sold.endDate}
                      </td>
                      <td style={{ padding: '12px', color: '#1D4ED8', fontWeight: 800 }}>₹ {sold.amount.toLocaleString()}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleWhatsApp(sold.contact, sold.name)}
                            style={{
                              backgroundColor: '#22C55E',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              cursor: 'pointer',
                            }}
                            title="WhatsApp"
                          >
                            WA
                          </button>
                          <button
                            onClick={() => handleEmail(sold.email || 'client@example.com', sold.name)}
                            style={{
                              backgroundColor: '#2563EB',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              cursor: 'pointer',
                            }}
                            title="Email"
                          >
                            Mail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. Editable Duration Modal */}
      {showEditDurationModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: '20px',
          }}
          onClick={() => setShowEditDurationModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '400px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '2px solid #D1F2E0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} color="#059669" />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>
                  Edit Session Duration
                </h3>
              </div>
              <button
                onClick={() => setShowEditDurationModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
              Customize the counselling session duration for Aditya Verma:
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Duration Label
              </label>
              <input
                type="text"
                value={tempDuration}
                onChange={(e) => setTempDuration(e.target.value)}
                placeholder="e.g. 2 Hours, 90 Mins, 3 Hours"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '14px',
                  fontWeight: 600,
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowEditDurationModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#F1F5F9',
                  border: 'none',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDuration}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#059669',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Top Notifications Drawer/Modal */}
      {showNotificationsModal && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            right: '24px',
            width: '340px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            border: '1px solid #E2E8F0',
            zIndex: 100,
            padding: '18px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={16} color="#EF4444" />
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>Activity Notifications</h4>
            </div>
            <button
              onClick={() => setShowNotificationsModal(false)}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div style={{ padding: '10px', backgroundColor: '#FEF2F2', borderRadius: '10px', border: '1px solid #FEE2E2' }}>
              <span style={{ fontWeight: 700, color: '#991B1B' }}>3 One-on-One follow-ups</span> need attention (&gt; 1 day without update).
            </div>
            <div style={{ padding: '10px', backgroundColor: '#EFF6FF', borderRadius: '10px', border: '1px solid #DBEAFE' }}>
              <span style={{ fontWeight: 700, color: '#1E40AF' }}>5 Long-Term counselling clients</span> ready for monthly review.
            </div>
            <div style={{ padding: '10px', backgroundColor: '#F0FDF4', borderRadius: '10px', border: '1px solid #DCFCE7' }}>
              <span style={{ fontWeight: 700, color: '#15803D' }}>New payment received</span>: ₹ 4,000 for 1-on-1 session.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
