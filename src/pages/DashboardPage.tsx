import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Briefcase,
  FileText,
  DollarSign,
  Inbox,
  Calendar,
  Star,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  User,
  ExternalLink,
  MessageCircle,
  Mail,
  Phone,
  RefreshCw,
  Lock,
  LogIn,
  AlertCircle,
} from 'lucide-react';
import { Logo } from '../components/common/Logo';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { useAuth } from '../context/AuthContext';
import {
  Inquiry,
  Booking,
  Project,
  ServiceItem,
  PricingPlan,
  BlogPost,
  Testimonial,
} from '../types';
import { seedInitialDataIfEmpty } from '../firebase/seed';
import { WHATSAPP_RAW, getWhatsAppUrl } from '../components/common/WhatsAppButton';

export const DashboardPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { user, isAdmin, logout, loginWithGoogle } = useAuth();
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'inquiries' | 'bookings' | 'projects' | 'services' | 'pricing' | 'blog' | 'testimonials' | 'settings'
  >('overview');

  // Real-time state
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState('');

  // Project Modal
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Partial<Project> | null>(null);

  // Service Modal
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [activeService, setActiveService] = useState<Partial<ServiceItem> | null>(null);

  // Testimonial Modal
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState<Partial<Testimonial> | null>(null);

  // Real-time Subscriptions
  useEffect(() => {
    const unsubInquiries = onSnapshot(collection(db, 'inquiries'), (snapshot) => {
      const list: Inquiry[] = [];
      snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as Inquiry));
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setInquiries(list);
    });

    const unsubBookings = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      const list: Booking[] = [];
      snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as Booking));
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setBookings(list);
    });

    const unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const list: Project[] = [];
      snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as Project));
      setProjects(list);
    });

    const unsubServices = onSnapshot(collection(db, 'services'), (snapshot) => {
      const list: ServiceItem[] = [];
      snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as ServiceItem));
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      setServices(list);
    });

    const unsubPricing = onSnapshot(collection(db, 'pricing'), (snapshot) => {
      const list: PricingPlan[] = [];
      snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as PricingPlan));
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      setPricing(list);
    });

    const unsubBlogs = onSnapshot(collection(db, 'blogPosts'), (snapshot) => {
      const list: BlogPost[] = [];
      snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as BlogPost));
      setBlogs(list);
    });

    const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snapshot) => {
      const list: Testimonial[] = [];
      snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as Testimonial));
      setTestimonials(list);
    });

    return () => {
      unsubInquiries();
      unsubBookings();
      unsubProjects();
      unsubServices();
      unsubPricing();
      unsubBlogs();
      unsubTestimonials();
    };
  }, []);

  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), { status: newStatus });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `inquiries/${id}`);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Permanently delete this inquiry record?')) return;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `inquiries/${id}`);
    }
  };

  const handleUpdateBookingStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status: newStatus });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `bookings/${id}`);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Permanently delete this consultation booking?')) return;
    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `bookings/${id}`);
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setSeedNotice('Seeding default agency datasets...');
    try {
      await seedInitialDataIfEmpty(true);
      setSeedNotice('Datasets seeded successfully!');
      setTimeout(() => setSeedNotice(''), 4000);
    } catch (err: any) {
      setSeedNotice(`Seed note: ${err.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  // Project CRUD save
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    try {
      const payload = {
        title: activeProject.title || 'Untitled Case Study',
        clientName: activeProject.clientName || 'Confidential Client',
        category: activeProject.category || 'SEO',
        service: activeProject.service || 'Growth Strategy',
        description: activeProject.description || '',
        results: activeProject.results || '',
        metrics: activeProject.metrics || '',
        imageUrl: activeProject.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        tags: Array.isArray(activeProject.tags) ? activeProject.tags : ['Growth'],
        featured: Boolean(activeProject.featured),
        updatedAt: new Date().toISOString(),
      };

      if (activeProject.id) {
        await updateDoc(doc(db, 'projects', activeProject.id), payload);
      } else {
        await addDoc(collection(db, 'projects'), {
          ...payload,
          createdAt: new Date().toISOString(),
        });
      }
      setProjectModalOpen(false);
      setActiveProject(null);
    } catch (err) {
      handleFirestoreError(err, activeProject.id ? OperationType.UPDATE : OperationType.CREATE, 'projects');
    }
  };

  // Service CRUD save
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeService) return;

    try {
      const payload = {
        name: activeService.name || 'New Service',
        slug: activeService.slug || (activeService.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        shortDesc: activeService.shortDesc || '',
        fullDesc: activeService.fullDesc || '',
        icon: activeService.icon || 'Compass',
        deliverables: Array.isArray(activeService.deliverables) ? activeService.deliverables : [],
        order: Number(activeService.order || services.length + 1),
      };

      if (activeService.id) {
        await updateDoc(doc(db, 'services', activeService.id), payload);
      } else {
        await addDoc(collection(db, 'services'), payload);
      }
      setServiceModalOpen(false);
      setActiveService(null);
    } catch (err) {
      handleFirestoreError(err, activeService.id ? OperationType.UPDATE : OperationType.CREATE, 'services');
    }
  };

  // Testimonial CRUD save
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTestimonial) return;

    try {
      const payload = {
        clientName: activeTestimonial.clientName || 'Partner',
        clientRole: activeTestimonial.clientRole || 'Founder',
        company: activeTestimonial.company || 'Enterprise',
        content: activeTestimonial.content || '',
        rating: Number(activeTestimonial.rating || 5),
        avatarUrl: activeTestimonial.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        featured: Boolean(activeTestimonial.featured),
      };

      if (activeTestimonial.id) {
        await updateDoc(doc(db, 'testimonials', activeTestimonial.id), payload);
      } else {
        await addDoc(collection(db, 'testimonials'), {
          ...payload,
          createdAt: new Date().toISOString(),
        });
      }
      setTestimonialModalOpen(false);
      setActiveTestimonial(null);
    } catch (err) {
      handleFirestoreError(err, activeTestimonial.id ? OperationType.UPDATE : OperationType.CREATE, 'testimonials');
    }
  };

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: Inbox },
    { id: 'bookings', label: `Consultations (${bookings.length})`, icon: Calendar },
    { id: 'projects', label: `Projects (${projects.length})`, icon: Briefcase },
    { id: 'services', label: `Services (${services.length})`, icon: Settings },
    { id: 'pricing', label: `Pricing (${pricing.length})`, icon: DollarSign },
    { id: 'blog', label: `Blog (${blogs.length})`, icon: FileText },
    { id: 'testimonials', label: `Testimonials (${testimonials.length})`, icon: Star },
    { id: 'settings', label: 'Agency Settings', icon: ShieldCheck },
  ];

  if (!isAdmin) {
    return (
      <div className="py-16 sm:py-24 min-h-[85vh] flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-[#1E56A0] flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-black tracking-widest text-[#1E56A0] uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Agency Restricted Area
          </span>

          <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#1E252D] mt-3">
            Admin CMS Authentication
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed max-w-md mx-auto">
            {user
              ? `You are logged in as ${user.email}. This account is not recognized as an authorized agency director.`
              : 'The ZaZu CMS and Content Manager is restricted to verified agency administrators.'}
          </p>

          <div className="my-5 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 text-left space-y-1.5">
            <p className="font-bold text-stone-800">Authorized Agency Administrator Emails:</p>
            <p className="text-[#1E56A0] font-semibold flex items-center gap-1.5">
              <span>• eladigitalw@gmail.com</span>
            </p>
            <p className="text-[#1E56A0] font-semibold flex items-center gap-1.5">
              <span>• digitalmediazazu@gmail.com</span>
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={async () => {
                setAuthLoading(true);
                setAuthError('');
                try {
                  await loginWithGoogle();
                } catch (err: any) {
                  setAuthError(err.message || 'Google sign-in was interrupted.');
                } finally {
                  setAuthLoading(false);
                }
              }}
              disabled={authLoading}
              className="w-full py-3 px-4 border border-stone-300 rounded-xl font-bold text-xs text-stone-700 bg-white hover:bg-stone-50 transition-all flex items-center justify-center gap-3 shadow-2xs disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{authLoading ? 'Signing In...' : 'Sign In with Google (eladigitalw@gmail.com)'}</span>
            </button>

            <button
              onClick={() => onNavigate('login')}
              className="w-full py-3 bg-[#1E56A0] hover:bg-[#164280] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Email</span>
            </button>

            {user && (
              <button
                onClick={() => logout()}
                className="w-full py-2.5 text-xs font-bold text-stone-500 hover:text-red-600 transition-colors"
              >
                Sign Out ({user.email})
              </button>
            )}

            <button
              onClick={() => onNavigate('home')}
              className="w-full py-2 text-xs font-bold text-stone-400 hover:text-stone-700"
            >
              Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-transparent min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Control Bar */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Authorized Agency Director CMS</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#1E252D] mt-1">
              ZaZu Command Portal
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Authenticated Admin: <span className="font-semibold text-[#1E56A0]">{user?.email}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
              title="Populate initial demo dataset if collections are empty"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>Reset/Seed Data</span>
            </button>

            <button
              onClick={() => logout()}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {seedNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1E56A0] text-center animate-fadeIn">
            {seedNotice}
          </div>
        )}

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#1E56A0] text-white shadow-md'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/90'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 text-left">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E56A0] flex items-center justify-center mb-3">
                  <Inbox className="w-5 h-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#1E252D]">
                  {inquiries.length}
                </p>
                <p className="text-xs font-bold text-stone-700 mt-0.5">Total Inquiries</p>
                <p className="text-[11px] text-stone-500">
                  {inquiries.filter((i) => i.status === 'new').length} Unread / New
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#1E252D]">
                  {bookings.length}
                </p>
                <p className="text-xs font-bold text-stone-700 mt-0.5">Strategy Bookings</p>
                <p className="text-[11px] text-stone-500">
                  {bookings.filter((b) => b.status === 'pending').length} Pending Confirmation
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                  <Briefcase className="w-5 h-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#1E252D]">
                  {projects.length}
                </p>
                <p className="text-xs font-bold text-stone-700 mt-0.5">Case Studies</p>
                <p className="text-[11px] text-stone-500">Active portfolio entries</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                  <DollarSign className="w-5 h-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#1E252D]">
                  {pricing.length}
                </p>
                <p className="text-xs font-bold text-stone-700 mt-0.5">Pricing Tiers</p>
                <p className="text-[11px] text-stone-500">Active retainer plans</p>
              </div>
            </div>

            {/* Recent Inquiries Quick List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold font-['Outfit'] text-[#1E252D]">
                    Latest Inquiries & Growth Briefs
                  </h3>
                  <p className="text-xs text-stone-500">Real-time incoming leads from the contact form</p>
                </div>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs font-bold text-[#1E56A0] hover:underline"
                >
                  View All ({inquiries.length})
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="py-12 text-center text-stone-400 text-xs">
                  No inquiries recorded yet. Test the contact form or use "Reset/Seed Data".
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {inquiries.slice(0, 5).map((inq) => (
                    <div key={inq.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm">{inq.name}</span>
                          <span className="text-xs text-stone-500">({inq.company || 'Private'})</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              inq.status === 'new'
                                ? 'bg-blue-100 text-[#1E56A0]'
                                : inq.status === 'in-progress'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#1E56A0] font-semibold mt-0.5">
                          {inq.service} • <span className="text-stone-600">{inq.projectTopic}</span>
                        </p>
                        <p className="text-xs text-stone-600 mt-1 line-clamp-1">{inq.message}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {inq.phone && (
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-bold"
                            title="WhatsApp Client"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        )}
                        <a
                          href={`mailto:${inq.email}`}
                          className="p-2 rounded-xl bg-blue-50 text-[#1E56A0] hover:bg-blue-100 text-xs font-bold"
                          title="Email Client"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: INQUIRIES MANAGEMENT */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold font-['Outfit'] text-[#1E252D]">
                  Contact Inquiries ({inquiries.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Full inquiries stored in Firestore collection: <code>inquiries</code>
                </p>
              </div>
            </div>

            {inquiries.length === 0 ? (
              <p className="text-center py-12 text-xs text-stone-400">No inquiries recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200 flex flex-col md:flex-row md:items-start justify-between gap-4"
                  >
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-stone-900 text-base">{inq.name}</h4>
                        {inq.company && (
                          <span className="text-xs bg-stone-200 text-stone-700 px-2 py-0.5 rounded font-semibold">
                            {inq.company}
                          </span>
                        )}
                        <span className="text-xs text-stone-400">
                          {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
                        <span className="flex items-center gap-1 text-[#1E56A0] font-semibold">
                          <Mail className="w-3.5 h-3.5" />
                          <a href={`mailto:${inq.email}`} className="hover:underline">
                            {inq.email}
                          </a>
                        </span>
                        {inq.phone && (
                          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                            <Phone className="w-3.5 h-3.5" />
                            <a
                              href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {inq.phone}
                            </a>
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-bold text-stone-800 bg-white p-2.5 rounded-xl border border-stone-200/70">
                        <span className="text-[#1E56A0] uppercase tracking-wider text-[10px] block">
                          Service & Topic
                        </span>
                        {inq.service} — {inq.projectTopic}
                      </div>

                      <p className="text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-stone-200/70 whitespace-pre-wrap">
                        {inq.message}
                      </p>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0">
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl border border-stone-300 bg-white"
                      >
                        <option value="new">Status: New</option>
                        <option value="in-progress">Status: In Progress</option>
                        <option value="closed">Status: Closed</option>
                      </select>

                      {inq.phone && (
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${inq.name}, this is ZaZu Digital Media following up on your inquiry for ${inq.service}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#25D366] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 text-xs"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold font-['Outfit'] text-[#1E252D]">
                  Discovery Call Bookings ({bookings.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Appointments booked through the "Book Call" modal.
                </p>
              </div>
            </div>

            {bookings.length === 0 ? (
              <p className="text-center py-12 text-xs text-stone-400">No bookings scheduled yet.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-base">{b.clientName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
                        <span>{b.email}</span>
                        {b.phone && <span>• {b.phone}</span>}
                        <span className="font-semibold text-[#1E56A0]">• {b.service}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-bold text-stone-800 pt-1">
                        <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                          <Calendar className="w-3.5 h-3.5 text-[#1E56A0]" />
                          <span>{b.preferredDate}</span>
                        </span>
                        <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                          <Clock className="w-3.5 h-3.5 text-[#1E56A0]" />
                          <span>{b.timeSlot}</span>
                        </span>
                      </div>

                      {b.notes && (
                        <p className="text-xs text-stone-600 italic pt-1">"{b.notes}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                        className="px-3 py-1.5 rounded-xl bg-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(b.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROJECTS MANAGEMENT */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold font-['Outfit'] text-[#1E252D]">
                  Portfolio Case Studies ({projects.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Full Add, Edit, Delete capabilities synced with Firestore.
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveProject({
                    title: '',
                    clientName: '',
                    category: 'SEO',
                    service: 'Search Engine Optimization (SEO)',
                    description: '',
                    results: '',
                    metrics: '',
                    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
                    tags: ['Growth'],
                    featured: false,
                  });
                  setProjectModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1E56A0] text-white rounded-xl text-xs font-bold hover:bg-[#164280]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Case Study</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl border border-stone-200 overflow-hidden bg-stone-50/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-video bg-stone-200 overflow-hidden relative">
                      <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-[#1E252D]/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {proj.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-stone-900 text-sm line-clamp-1">{proj.title}</h4>
                      <p className="text-xs text-[#1E56A0] font-semibold">{proj.clientName}</p>
                      <p className="text-xs text-stone-600 line-clamp-2 mt-1">{proj.description}</p>
                      {proj.metrics && (
                        <p className="text-[11px] font-bold text-emerald-700 mt-2 bg-emerald-50 p-1.5 rounded">
                          {proj.metrics}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-stone-200/80 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setActiveProject(proj);
                        setProjectModalOpen(true);
                      }}
                      className="p-1.5 text-stone-500 hover:text-blue-600 hover:bg-stone-200 rounded-lg text-xs"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Delete this case study?')) {
                          await deleteDoc(doc(db, 'projects', proj.id));
                        }
                      }}
                      className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold font-['Outfit'] text-[#1E252D]">
                  Agency Services Directory ({services.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Manage services shown on the Services page and Booking dropdowns.
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveService({
                    name: '',
                    slug: '',
                    shortDesc: '',
                    fullDesc: '',
                    icon: 'Compass',
                    deliverables: ['Strategy Session', 'Weekly Report'],
                    order: services.length + 1,
                  });
                  setServiceModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1E56A0] text-white rounded-xl text-xs font-bold hover:bg-[#164280]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    {svc.imageUrl && (
                      <img
                        src={svc.imageUrl}
                        alt={svc.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                      />
                    )}
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{svc.name}</h4>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1">{svc.shortDesc}</p>
                      <span className="text-[10px] text-[#1E56A0] font-semibold mt-1 block">
                        Slug: /{svc.slug}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setActiveService(svc);
                        setServiceModalOpen(true);
                      }}
                      className="p-1.5 text-stone-500 hover:text-blue-600 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Delete service "${svc.name}"?`)) {
                          await deleteDoc(doc(db, 'services', svc.id));
                        }
                      }}
                      className="p-1.5 text-stone-500 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PRICING MANAGEMENT */}
        {activeTab === 'pricing' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold font-['Outfit'] text-[#1E252D]">
                  Pricing Packages ({pricing.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Configure retainer tiers, prices, and bullet points.
                </p>
              </div>
              <button
                onClick={() => onNavigate('pricing')}
                className="text-xs font-bold text-[#1E56A0] hover:underline"
              >
                Go to Pricing Page
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricing.map((p) => (
                <div key={p.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900 text-base">{p.name}</h4>
                    {p.popular && (
                      <span className="text-[10px] bg-blue-100 text-[#1E56A0] px-2 py-0.5 rounded-full font-bold">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-black font-['Outfit'] text-[#1E252D]">
                    {p.price} <span className="text-xs font-normal text-stone-500">{p.billingPeriod}</span>
                  </p>
                  <p className="text-xs text-stone-600">{p.description}</p>
                  <div className="pt-2 border-t border-stone-200 text-xs text-stone-500">
                    {p.features?.length} features included
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: BLOG MANAGEMENT */}
        {activeTab === 'blog' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold font-['Outfit'] text-[#1E252D]">
                  Blog Articles ({blogs.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Manage content articles, guides, and strategic thought leadership.
                </p>
              </div>
              <button
                onClick={() => onNavigate('blog')}
                className="text-xs font-bold text-[#1E56A0] hover:underline"
              >
                Go to Blog Page
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {blogs.map((b) => (
                <div key={b.id} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{b.title}</h4>
                    <p className="text-xs text-stone-500">{b.category} • {b.publishedAt} • {b.authorName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        if (confirm('Delete article?')) {
                          await deleteDoc(doc(db, 'blogPosts', b.id));
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: TESTIMONIALS MANAGEMENT */}
        {activeTab === 'testimonials' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold font-['Outfit'] text-[#1E252D]">
                  Client Testimonials ({testimonials.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Social proof quotes displayed across the agency website.
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveTestimonial({
                    clientName: '',
                    clientRole: 'CEO',
                    company: '',
                    content: '',
                    rating: 5,
                    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                    featured: true,
                  });
                  setTestimonialModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1E56A0] text-white rounded-xl text-xs font-bold hover:bg-[#164280]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Testimonial</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm">{t.clientName}</span>
                    <span className="text-xs text-amber-500 font-bold">{t.rating} ★</span>
                  </div>
                  <p className="text-xs text-[#1E56A0] font-semibold">{t.clientRole}, {t.company}</p>
                  <p className="text-xs text-stone-600 italic">"{t.content}"</p>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={async () => {
                        if (confirm('Delete testimonial?')) {
                          await deleteDoc(doc(db, 'testimonials', t.id));
                        }
                      }}
                      className="p-1 text-stone-400 hover:text-red-600 text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-left max-w-3xl space-y-6">
            <div>
              <h3 className="text-xl font-bold font-['Outfit'] text-[#1E252D]">
                Agency Brand & Contact Settings
              </h3>
              <p className="text-xs text-stone-500">
                Core communication links and administrative privilege states.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-800 block mb-1">Official Brand Name</span>
                <span className="text-stone-600">ZaZu Digital Media</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-800 block mb-1">Primary Agency Email</span>
                <span className="text-stone-600">digitalmediazazu@gmail.com</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-800 block mb-1">WhatsApp Direct Hotline</span>
                <span className="text-emerald-700 font-semibold">+91 97895 04702</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-800 block mb-1">Instagram Profile</span>
                <a
                  href="https://www.instagram.com/zazudigitalmedia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1E56A0] hover:underline"
                >
                  https://www.instagram.com/zazudigitalmedia/
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-800 block mb-1">LinkedIn Profile</span>
                <a
                  href="https://www.linkedin.com/company/zazu-digital-media/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1E56A0] hover:underline"
                >
                  https://www.linkedin.com/company/zazu-digital-media/
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-800 block">
                  Authenticated Executive Administrator
                </span>
                <p className="text-stone-600 text-xs">
                  Active account: <span className="font-bold text-stone-900">{user?.email}</span>. Full CMS write and modification permissions active.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Project CRUD */}
        {projectModalOpen && activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl bg-[#FAF8F5] border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto text-left">
              <h3 className="text-xl font-bold font-['Outfit'] text-stone-900 mb-4">
                {activeProject.id ? 'Edit Case Study' : 'Create Case Study'}
              </h3>
              <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={activeProject.title || ''}
                    onChange={(e) => setActiveProject({ ...activeProject, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Client Name</label>
                    <input
                      type="text"
                      value={activeProject.clientName || ''}
                      onChange={(e) => setActiveProject({ ...activeProject, clientName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Category</label>
                    <input
                      type="text"
                      value={activeProject.category || 'SEO'}
                      onChange={(e) => setActiveProject({ ...activeProject, category: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Metrics Highlight</label>
                  <input
                    type="text"
                    value={activeProject.metrics || ''}
                    onChange={(e) => setActiveProject({ ...activeProject, metrics: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={activeProject.imageUrl || ''}
                    onChange={(e) => setActiveProject({ ...activeProject, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={activeProject.description || ''}
                    onChange={(e) => setActiveProject({ ...activeProject, description: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setProjectModalOpen(false)}
                    className="px-4 py-2 border rounded-xl"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#1E56A0] text-white font-bold rounded-xl">
                    Save Case Study
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Service CRUD */}
        {serviceModalOpen && activeService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-lg bg-[#FAF8F5] border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto text-left">
              <h3 className="text-xl font-bold font-['Outfit'] text-stone-900 mb-4">
                {activeService.id ? 'Edit Service' : 'Add Service'}
              </h3>
              <form onSubmit={handleSaveService} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Service Name *</label>
                  <input
                    type="text"
                    required
                    value={activeService.name || ''}
                    onChange={(e) => setActiveService({ ...activeService, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={activeService.slug || ''}
                    onChange={(e) => setActiveService({ ...activeService, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Service Cover Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={activeService.imageUrl || ''}
                    onChange={(e) => setActiveService({ ...activeService, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                  />
                  {activeService.imageUrl && (
                    <div className="mt-2 h-24 w-full rounded-xl overflow-hidden border border-stone-200">
                      <img src={activeService.imageUrl} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={activeService.shortDesc || ''}
                    onChange={(e) => setActiveService({ ...activeService, shortDesc: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Full Description</label>
                  <textarea
                    rows={3}
                    value={activeService.fullDesc || ''}
                    onChange={(e) => setActiveService({ ...activeService, fullDesc: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setServiceModalOpen(false)}
                    className="px-4 py-2 border rounded-xl"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#1E56A0] text-white font-bold rounded-xl">
                    Save Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Testimonial CRUD */}
        {testimonialModalOpen && activeTestimonial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-lg bg-[#FAF8F5] border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto text-left">
              <h3 className="text-xl font-bold font-['Outfit'] text-stone-900 mb-4">
                {activeTestimonial.id ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={activeTestimonial.clientName || ''}
                    onChange={(e) => setActiveTestimonial({ ...activeTestimonial, clientName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Role / Title</label>
                    <input
                      type="text"
                      value={activeTestimonial.clientRole || ''}
                      onChange={(e) => setActiveTestimonial({ ...activeTestimonial, clientRole: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Company</label>
                    <input
                      type="text"
                      value={activeTestimonial.company || ''}
                      onChange={(e) => setActiveTestimonial({ ...activeTestimonial, company: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Feedback Quote *</label>
                  <textarea
                    rows={3}
                    required
                    value={activeTestimonial.content || ''}
                    onChange={(e) => setActiveTestimonial({ ...activeTestimonial, content: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setTestimonialModalOpen(false)}
                    className="px-4 py-2 border rounded-xl"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#1E56A0] text-white font-bold rounded-xl">
                    Save Testimonial
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
