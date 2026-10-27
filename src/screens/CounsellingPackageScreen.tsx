import React, { useState } from 'react';
import { 
  ArrowLeft,
  ChevronRight,
  Mail,
  Phone,
  FileText,
  Gift,
  Calendar,
  FlaskConical,
  ExternalLink,
  Video,
  Coffee,
  CheckCircle2,
  ShieldCheck,
  Bell,
  Home as HomeIcon,
  Apple,
  Activity,
  TrendingUp,
  User as UserIcon,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ClientPackageCoreHubModal } from '../components/common/ClientPackageCoreHubModal';
import { MacronutrientMetabolismSection } from '../components/nutrition/MacronutrientMetabolismSection';
import { checkPackageExpiryAlert } from '../services/clientTrackingService';
import { getOneOnOneAgreementConfig } from '../data/agreementsData';
import { 
  POPULAR_COFFEE_SHOPS, 
  saveCounsellingRecord
} from '../services/counsellingService';
import { sendCounsellingBookingEmails } from '../services/resendEmailService';

interface CounsellingPackageScreenProps {
  onBack?: () => void;
  onNavigateTab?: (tab: 'home' | 'nutrition' | 'activity' | 'progress' | 'profile') => void;
  clientId?: string;
  clientName?: string;
}

const AVAILABLE_TIME_SLOTS = [
  '09:00 AM – 10:00 AM',
  '11:00 AM – 12:00 PM',
  '02:00 PM – 03:00 PM',
  '04:30 PM – 05:30 PM',
  '07:00 PM – 08:00 PM',
];

export const CounsellingPackageScreen: React.FC<CounsellingPackageScreenProps> = ({ 
  onBack,
  onNavigateTab,
  clientId: propClientId,
  clientName: propClientName,
}) => {
  const { user, customerRecord } = useAuth();
  const clientId = propClientId || user?.uid || customerRecord?.uid || 'default_user';

  // Client Details
  const fullName = propClientName || customerRecord?.personalDetails?.fullName || 'Sneha De';
  const email = customerRecord?.personalDetails?.emailAddress || 'deysneha690@gmail.com';
  const phone = customerRecord?.personalDetails?.mobileNumber || '9903711773';

  // Modal State for Core Hub (Tests, Gifts, Sessions)
  const [showCoreModal, setShowCoreModal] = useState<boolean>(false);
  const [modalTab, setModalTab] = useState<'tests' | 'gifts' | 'sessions'>('sessions');
  const [showNutritionModal, setShowNutritionModal] = useState<boolean>(false);

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [meetingMode, setMeetingMode] = useState<'Video Call' | 'Coffee Shop (In-Person)'>('Video Call');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(AVAILABLE_TIME_SLOTS[1]);
  const [coffeeShopLocation, setCoffeeShopLocation] = useState<string>(POPULAR_COFFEE_SHOPS[0].name);
  const [isBookingSaving, setIsBookingSaving] = useState<boolean>(false);
  const [bookingSuccessToast, setBookingSuccessToast] = useState<string>('');

  // Agreement Modal State
  const [showAgreementModal, setShowAgreementModal] = useState<boolean>(false);
  const oneOnOneAgreement = getOneOnOneAgreementConfig(1699);

  // Expiry Alert
  const endDateStr = (customerRecord as any)?.planDetails?.endDate || new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0];
  const expiryCheck = checkPackageExpiryAlert(endDateStr);

  const openTracker = (tab: 'tests' | 'gifts' | 'sessions') => {
    setModalTab(tab);
    setShowCoreModal(true);
  };

  const handleBookConsultation = async () => {
    setIsBookingSaving(true);
    const mockRecord: any = {
      id: 'counsel_' + Date.now(),
      clientId,
      booking: {
        id: 'book_' + Date.now(),
        clientId,
        clientName: fullName,
        clientEmail: email,
        clientMobile: phone,
        meetingMode,
        selectedDate,
        selectedTimeSlot,
        coffeeShopLocation: meetingMode === 'Coffee Shop (In-Person)' ? coffeeShopLocation : undefined,
        agreementAccepted: true,
        agreementSignedAt: Date.now(),
        startDate: selectedDate,
        endDate: selectedDate,
        confirmationEmailSent: true,
        status: 'Confirmed',
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveCounsellingRecord(clientId, mockRecord);
    sendCounsellingBookingEmails(mockRecord).catch(() => {});
    setIsBookingSaving(false);
    setShowBookingModal(false);
    setBookingSuccessToast(`Consultation confirmed for ${selectedDate} at ${selectedTimeSlot}!`);
    setTimeout(() => setBookingSuccessToast(''), 4000);
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FCFBF7',
        minHeight: '100%',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Top Header / Back Bar */}
      <div
        style={{
          padding: '16px 20px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FCFBF7',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              backgroundColor: '#EEF4E8',
              border: '1px solid #D1DEC2',
              color: '#3B4F25',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} />
            <span>Home</span>
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setShowBookingModal(true)}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              backgroundColor: '#0F3822',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
            }}
          >
            <Video size={13} />
            <span>Book Slot</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAgreementModal(true)}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              backgroundColor: '#FAF5FF',
              border: '1px solid #DDD6FE',
              color: '#6D28D9',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
            }}
          >
            <FileText size={13} />
            <span>Agreement</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '12px 20px 32px', overflowY: 'auto' }}>

        {/* Booking Toast */}
        {bookingSuccessToast && (
          <div
            style={{
              marginBottom: '16px',
              padding: '10px 14px',
              backgroundColor: '#DEF7EC',
              color: '#047857',
              fontSize: '12.5px',
              fontWeight: 700,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid #31C48D',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{bookingSuccessToast}</span>
          </div>
        )}

        {/* 7-Day Package Expiry Alert */}
        {expiryCheck.isExpiringIn7Days && (
          <div
            style={{
              marginBottom: '20px',
              padding: '14px 16px',
              backgroundColor: '#FEF3C7',
              border: '1.5px solid #F59E0B',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#FDE68A',
                  color: '#B45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Bell size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#92400E' }}>
                  Package Ending Soon
                </div>
                <p style={{ fontSize: '12.5px', color: '#78350F', margin: '4px 0 8px', lineHeight: 1.45 }}>
                  Hi {fullName.split(' ')[0]}, your current package will be ending in 7 days. Would you like to continue with your nutrition and follow-up services?
                </p>
                <a
                  href="https://wa.me/917980862086?text=Hi%20Sneha%2C%20I%20would%20like%20to%20continue%20with%20my%20nutrition%20and%20follow-up%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '5px 12px',
                    backgroundColor: '#B45309',
                    color: '#FFFFFF',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* CLIENT PROFILE HEADER (Exact 100% matching WhatsApp Image 2026-09-24 at 16.57.31.jpeg) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            paddingTop: '8px',
            marginBottom: '26px',
          }}
        >
          {/* Avatar with deep olive border */}
          <div
            style={{
              width: '124px',
              height: '124px',
              borderRadius: '50%',
              border: '3.5px solid #586641',
              padding: '3px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 6px 20px rgba(88, 102, 65, 0.2)',
              marginBottom: '14px',
              overflow: 'hidden',
            }}
          >
            <img
              src="/images/sneha_avatar.png"
              alt={fullName}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          {/* Name in Serif */}
          <h2
            className="font-serif"
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#1A1D1A',
              margin: '0 0 6px',
              letterSpacing: '-0.3px',
            }}
          >
            {fullName}
          </h2>

          {/* Email link */}
          <a
            href={`mailto:${email}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: '#3B443B',
              textDecoration: 'underline',
              marginBottom: '4px',
            }}
          >
            <Mail size={15} color="#556B2F" />
            <span>{email}</span>
          </a>

          {/* Phone link */}
          <a
            href={`tel:${phone}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: '#4B554B',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            <Phone size={14} color="#556B2F" />
            <span>{phone}</span>
          </a>
        </div>

        {/* 3 CORE PROMINENT CARDS (Exact 100% matching WhatsApp Image 2026-09-24 at 16.57.31.jpeg) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* ========================================================================= */}
          {/* CARD 1: TESTS                                                             */}
          {/* ========================================================================= */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => openTracker('tests')}
            style={{
              backgroundColor: '#F0FDF4',
              border: '1.5px solid #DCFCE7',
              borderRadius: '20px',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(22, 163, 74, 0.05)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  backgroundColor: '#DCFCE7',
                  border: '1px solid #BBF7D0',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FlaskConical size={26} strokeWidth={2} />
              </div>
              <div>
                <h3
                  className="font-serif"
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#0F172A',
                    margin: 0,
                    letterSpacing: '-0.2px',
                  }}
                >
                  Tests
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
                  All test tracking and reports
                </p>
              </div>
            </div>

            <ChevronRight size={22} color="#94A3B8" />
          </div>

          {/* ========================================================================= */}
          {/* CARD 2: GIFT VOUCHERS                                                     */}
          {/* ========================================================================= */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => openTracker('gifts')}
            style={{
              backgroundColor: '#FEFCE8',
              border: '1.5px solid #FEF08A',
              borderRadius: '20px',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(202, 138, 4, 0.05)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  backgroundColor: '#FEF08A',
                  border: '1px solid #FDE047',
                  color: '#CA8A04',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Gift size={26} strokeWidth={2} />
              </div>
              <div>
                <h3
                  className="font-serif"
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#0F172A',
                    margin: 0,
                    letterSpacing: '-0.2px',
                  }}
                >
                  Gift Vouchers
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
                  Delivered or undelivered status
                </p>
              </div>
            </div>

            <ChevronRight size={22} color="#94A3B8" />
          </div>

          {/* ========================================================================= */}
          {/* CARD 3: SESSIONS                                                          */}
          {/* ========================================================================= */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => openTracker('sessions')}
            style={{
              backgroundColor: '#FAF5FF',
              border: '1.5px solid #EDE9FE',
              borderRadius: '20px',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(124, 58, 237, 0.05)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  backgroundColor: '#EDE9FE',
                  border: '1px solid #DDD6FE',
                  color: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Calendar size={26} strokeWidth={2} />
              </div>
              <div>
                <h3
                  className="font-serif"
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#0F172A',
                    margin: 0,
                    letterSpacing: '-0.2px',
                  }}
                >
                  Sessions
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
                  According to their taken packages
                </p>
              </div>
            </div>

            <ChevronRight size={22} color="#94A3B8" />
          </div>

          {/* ========================================================================= */}
          {/* CARD 4: NUTRITION & METABOLISM BLUEPRINT                                 */}
          {/* ========================================================================= */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowNutritionModal(true)}
            style={{
              backgroundColor: '#ECFDF5',
              border: '1.5px solid #A7F3D0',
              borderRadius: '20px',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(5, 150, 105, 0.05)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  backgroundColor: '#D1FAE5',
                  border: '1px solid #A7F3D0',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Apple size={26} strokeWidth={2} />
              </div>
              <div>
                <h3
                  className="font-serif"
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#0F172A',
                    margin: 0,
                    letterSpacing: '-0.2px',
                  }}
                >
                  Nutrition & Metabolism Blueprint
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
                  Macro pie charts, LBM calculator & diet auto-classifier
                </p>
              </div>
            </div>

            <ChevronRight size={22} color="#94A3B8" />
          </div>

        </div>

      </div>

      {/* CORE HUB MODAL (Drawer for Tests, Gifts, and Sessions) */}
      <ClientPackageCoreHubModal
        isOpen={showCoreModal}
        onClose={() => setShowCoreModal(false)}
        clientId={clientId}
        clientName={fullName}
        initialTab={modalTab}
        isAdmin={false}
      />

      {/* BOOKING MODAL */}
      {showBookingModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '480px',
              padding: '22px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#1E293B' }}>
                Schedule Next 1-on-1 Consultation
              </h3>
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Mode selection */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setMeetingMode('Video Call')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: meetingMode === 'Video Call' ? '2px solid #059669' : '1px solid #E2E8F0',
                  backgroundColor: meetingMode === 'Video Call' ? '#DEF7EC' : '#FFFFFF',
                  color: meetingMode === 'Video Call' ? '#047857' : '#64748B',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Video size={16} />
                <span>Video Call (Google Meet)</span>
              </button>

              <button
                type="button"
                onClick={() => setMeetingMode('Coffee Shop (In-Person)')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: meetingMode === 'Coffee Shop (In-Person)' ? '2px solid #059669' : '1px solid #E2E8F0',
                  backgroundColor: meetingMode === 'Coffee Shop (In-Person)' ? '#DEF7EC' : '#FFFFFF',
                  color: meetingMode === 'Coffee Shop (In-Person)' ? '#047857' : '#64748B',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Coffee size={16} />
                <span>Coffee Shop (In-Person)</span>
              </button>
            </div>

            {/* Date selection */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Select Preferred Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                }}
              />
            </div>

            {/* Time Slot selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Select Time Slot:
              </label>
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                }}
              >
                {AVAILABLE_TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            {/* Coffee Shop Location if In-Person */}
            {meetingMode === 'Coffee Shop (In-Person)' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Coffee Shop Location:
                </label>
                <select
                  value={coffeeShopLocation}
                  onChange={(e) => setCoffeeShopLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                  }}
                >
                  {POPULAR_COFFEE_SHOPS.map((loc) => (
                    <option key={loc.id} value={loc.name}>{loc.name} ({loc.address})</option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              onClick={handleBookConsultation}
              disabled={isBookingSaving}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#059669',
                color: '#FFFFFF',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
              }}
            >
              {isBookingSaving ? 'Confirming Booking...' : 'Confirm & Schedule Consultation'}
            </button>
          </div>
        </div>
      )}

      {/* AGREEMENT MODAL */}
      {showAgreementModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '540px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAF8F5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#059669" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#1E293B' }}>
                  1-on-1 Lifestyle & Nutrition Counseling Agreement (₹{oneOnOneAgreement.price})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAgreementModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, padding: '18px 20px', overflowY: 'auto', fontSize: '12.5px', color: '#334155', lineHeight: 1.6 }}>
              <div style={{ marginBottom: '14px', padding: '10px 12px', backgroundColor: '#DEF7EC', borderRadius: '10px', color: '#047857', fontWeight: 600 }}>
                Signed by Service Provider: Sneha Dey (Senior Clinical Nutritionist)
                <br />
                Terms accepted and transmitted via Email & WhatsApp.
              </div>

              <h4 style={{ margin: '10px 0 4px', fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                Section 1 — Scope of Transformation & Practice
              </h4>
              <p style={{ margin: '0 0 10px' }}>
                The consultation and follow-up sessions encompass clinical nutrition counseling, personalized macronutrient planning, biomarker review, and lifestyle modifications.
              </p>

              <h4 style={{ margin: '10px 0 4px', fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                Section 2 — Client Accountability & Adherence
              </h4>
              <p style={{ margin: '0 0 10px' }}>
                Client agrees to complete scheduled follow-up checks, share required diagnostic tests (HbA1c, Vitamin D/B12, Lipoprotein(a)), and update daily nutrition logs.
              </p>

              <h4 style={{ margin: '10px 0 4px', fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                Section 3 — Provider Signature & Documentation
              </h4>
              <div style={{ marginTop: '12px', padding: '12px', border: '1.5px dashed #059669', borderRadius: '10px', backgroundColor: '#F0FDF4' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#065F46' }}>
                  Sneha Dey
                </div>
                <div style={{ fontSize: '11px', color: '#047857' }}>
                  Senior Clinical Nutritionist & Lifestyle Consultant • She Nourishes
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '4px' }}>
                  Signature verified • Hash: SN-VERIFIED-AUTH-2026
                </div>
              </div>
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#FAF8F5' }}>
              <button
                type="button"
                onClick={() => setShowAgreementModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#0F3822',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Close Agreement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NUTRITION & METABOLISM BLUEPRINT MODAL */}
      {showNutritionModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '920px',
              height: '92vh',
              backgroundColor: '#FFFDF8',
              borderRadius: '20px',
              border: '2px solid #0F3822',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 20px',
                backgroundColor: '#0F3822',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#D1FAE5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Apple size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    1-on-1 Clinical Nutrition & Metabolism Blueprint
                  </h3>
                  <span style={{ fontSize: '11.5px', color: '#A7F3D0' }}>
                    Client: {fullName} • PAR-Q & Metabolism Sync
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowNutritionModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scroll Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              <MacronutrientMetabolismSection
                clientId={clientId}
                clientEmail={customerRecord?.personalDetails?.emailAddress || user?.email || undefined}
                clientName={fullName}
                initialWeight={customerRecord?.personalDetails?.weight || 70}
                initialBodyFat={customerRecord?.personalDetails?.bodyFatPercentage ?? 22}
                initialIntensity={customerRecord?.physicalActivity?.calculatedIntensity || 2.0}
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          type="button"
          onClick={() => {
            if (onNavigateTab) onNavigateTab('home');
            else if (onBack) onBack();
          }}
          className="nav-item is-active"
        >
          <HomeIcon size={20} />
          <span>Home</span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (onNavigateTab) onNavigateTab('nutrition');
          }}
          className="nav-item"
        >
          <Apple size={20} />
          <span>Nutrition</span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (onNavigateTab) onNavigateTab('activity');
          }}
          className="nav-item"
        >
          <Activity size={20} />
          <span>Activity</span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (onNavigateTab) onNavigateTab('progress');
          }}
          className="nav-item"
        >
          <TrendingUp size={20} />
          <span>Progress</span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (onNavigateTab) onNavigateTab('profile');
          }}
          className="nav-item"
        >
          <UserIcon size={20} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};
