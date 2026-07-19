import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  User,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  FileText,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  Settings,
  Heart,
  Pencil,
  Calendar,
  Phone,
  MapPin,
  Clock,
  Camera,
  X,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '@/components/layout/Layout';
import { useEnquiries, useNotifications, useUpdateUserProfile } from '@/hooks/useSupabaseData';
import { supabase } from '@/lib/supabase';
import { logout, setProfile } from '@/store/authSlice';
import type { RootState } from '@/store';
import { toast } from 'sonner';
import { uploadAvatar } from '@/lib/imageUpload';
import { SEO } from '@/components/SEO';
import { pageSEO, buildWebPageSchema, buildBreadcrumbSchema, siteUrl } from '@/lib/seo';
import { MobileAuth, DesktopAuth } from '@/components/auth/AuthPage';

const logoUrl = 'https://miaoda-conversation-file.s3cdn.medo.dev/user-cc0cvmcrcxkw/app-cdkoojeqtu69/20260706/mayuresh.jpeg';

type View = 'login' | 'register' | 'forgot' | 'profile' | 'enquiries' | 'settings';
type MenuKey = 'profile' | 'enquiries' | 'wishlist' | 'notifications' | 'settings' | 'help';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, profile, isLoading } = useSelector((state: RootState) => state.auth);
  const [view, setView] = useState<View>(user ? 'profile' : 'login');
  const [activeMenu, setActiveMenu] = useState<MenuKey>('profile');

  // Auth form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Settings state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Edit field modal state
  const [editingField, setEditingField] = useState<{ label: string; key: string; value: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Avatar upload state
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: enquiries = [] } = useEnquiries(user?.id || undefined);
  const { data: notifications = [] } = useNotifications(user?.id);
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const updateProfileMutation = useUpdateUserProfile();

  useEffect(() => {
    if (user) {
      setView('profile');
      setActiveMenu('profile');
    } else if (view !== 'forgot' && view !== 'register' && view !== 'login') {
      setView('login');
    }
  }, [user]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter email and password');
      return;
    }
    setAuthLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) {
      toast.error(error.message);
    } else if (data.user && !data.user.email_confirmed_at) {
      toast.error('Please confirm your email before logging in. Check your inbox.');
    } else {
      toast.success('Logged in successfully');
      setView('profile');
      setEmail('');
      setPassword('');
    }
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter email and password');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setAuthLoading(true);
    const redirectTo = `${window.location.origin}/profile`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo },
    });
    if (!error && data.user) {
      try {
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle();
        await supabase.from('user_profiles').upsert({
          id: data.user.id,
          full_name: email.split('@')[0],
          role: 'user',
          notifications_enabled: false,
        }, { onConflict: 'id' });
      } catch (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }
    setAuthLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Account created! Please check your email to verify.');
      setView('login');
      setEmail('');
      setPassword('');
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) toast.error(error.message);
  };

  const handleForgot = async () => {
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    setAuthLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setAuthLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password reset link sent to your email');
      setView('login');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(logout());
    setView('login');
    setActiveMenu('profile');
    toast.success('Logged out');
  };

  const handleSaveField = async () => {
    if (!user?.id || !editingField) return;
    setEditLoading(true);
    try {
      const key = editingField.key;
      const updates: Record<string, string | null> = { [key]: editValue.trim() || null };
      await updateProfileMutation.mutateAsync({ userId: user.id, updates });
      dispatch(
        setProfile(
          profile
            ? {
                ...profile,
                [key]: editValue.trim() || null,
              }
            : null
        )
      );
      toast.success(`${editingField.label} updated`);
      setEditingField(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setEditLoading(false);
    }
  };

  const openFieldEditor = (label: string, key: string, value: string) => {
    setEditingField({ label, key, value });
    setEditValue(value);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    setAvatarLoading(true);
    try {
      const publicUrl = await uploadAvatar(file, user.id);
      await updateProfileMutation.mutateAsync({ userId: user.id, updates: { avatar_url: publicUrl } });
      dispatch(setProfile(profile ? { ...profile, avatar_url: publicUrl } : null));
      toast.success('Profile photo updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload profile photo');
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim() || newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setView('profile');
      setActiveMenu('profile');
    }
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  const accountRows = [
    { label: 'Full Name', key: 'full_name', value: profile?.full_name || user?.email?.split('@')[0] || '—', editable: true },
    { label: 'Email Address', key: 'email', value: user?.email || '—', editable: false },
    { label: 'Phone Number', key: 'phone', value: profile?.phone || '—', editable: true },
  ];

  const addressRow = profile?.address
    ? { label: 'Address', key: 'address', value: profile.address, editable: true }
    : null;

  const renderSidebar = () => (
    <aside className="hidden md:flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden p-2">
        <nav className="flex flex-col gap-1">
          <SidebarItem
            icon={User}
            label="My Profile"
            active={activeMenu === 'profile'}
            onClick={() => {
              setActiveMenu('profile');
              setView('profile');
            }}
          />
          <SidebarItem
            icon={FileText}
            label="My Enquiries"
            active={activeMenu === 'enquiries'}
            onClick={() => {
              setActiveMenu('enquiries');
              setView('enquiries');
            }}
          />
          <SidebarItem
            icon={Heart}
            label="Wishlist"
            active={activeMenu === 'wishlist'}
            onClick={() => {
              setActiveMenu('wishlist');
              navigate('/wishlist');
            }}
          />
          <SidebarItem
            icon={Bell}
            label="Notifications"
            active={activeMenu === 'notifications'}
            badge={unreadCount}
            onClick={() => {
              setActiveMenu('notifications');
              navigate('/notifications');
            }}
          />
          <SidebarItem
            icon={Settings}
            label="Account Settings"
            active={activeMenu === 'settings'}
            onClick={() => {
              setActiveMenu('settings');
              setView('settings');
            }}
          />
          <SidebarItem
            icon={HelpCircle}
            label="Help & Support"
            active={activeMenu === 'help'}
            onClick={() => {
              setActiveMenu('help');
              navigate('/contact');
            }}
          />
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors text-left"
      >
        <LogOut className="w-5 h-5 text-destructive" />
        <span className="text-sm font-medium text-destructive">Log Out</span>
      </button>
    </aside>
  );

  // Auth Views
  if (!user && view !== 'profile' && view !== 'enquiries' && view !== 'settings') {
    const authProps = {
      view: view as 'login' | 'register' | 'forgot',
      setView,
      email,
      setEmail,
      password,
      setPassword,
      showPassword,
      setShowPassword,
      authLoading,
      onLogin: handleLogin,
      onRegister: handleRegister,
      onForgot: handleForgot,
      onGoogle: handleGoogleLogin,
    };

    return (
      <>
        <div className="md:hidden">
          <Layout>
            <MobileAuth {...authProps} />
          </Layout>
        </div>
        <div className="hidden md:block">
          <DesktopAuth {...authProps} />
        </div>
      </>
    );
  }

  // Profile Dashboard
  const profileSEO = pageSEO.profile;

  return (
    <Layout>
      <SEO
        title={profileSEO.title}
        description={profileSEO.description}
        keywords={profileSEO.keywords}
        canonical={`${siteUrl}/profile`}
        ogType={profileSEO.ogType}
        noindex
        schema={[
          buildWebPageSchema('/profile', profileSEO.title, profileSEO.description),
          buildBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Profile', path: '/profile' }]),
        ]}
      />
      {/* Mobile header */}
      <div className="bg-background border-b border-border px-4 py-3 flex items-center gap-3 md:hidden">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors" aria-label="Go back">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-bold text-foreground flex-1">
          {view === 'profile' ? 'Profile' : view === 'enquiries' ? 'My Enquiries' : 'Account Settings'}
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 md:py-8 lg:py-10">
        {/* Breadcrumb - desktop */}
        <nav className="hidden md:flex items-center gap-2 text-sm mb-6 lg:mb-8">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">Profile</span>
        </nav>

        {/* Mobile horizontal menu */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          <MobileMenuItem label="Profile" active={activeMenu === 'profile'} onClick={() => { setActiveMenu('profile'); setView('profile'); }} />
          <MobileMenuItem label="Enquiries" active={activeMenu === 'enquiries'} onClick={() => { setActiveMenu('enquiries'); setView('enquiries'); }} />
          <MobileMenuItem label="Notifications" active={activeMenu === 'notifications'} badge={unreadCount} onClick={() => { setActiveMenu('notifications'); navigate('/notifications'); }} />
          <MobileMenuItem label="Settings" active={activeMenu === 'settings'} onClick={() => { setActiveMenu('settings'); setView('settings'); }} />
          <MobileMenuItem label="Help" active={activeMenu === 'help'} onClick={() => { setActiveMenu('help'); navigate('/contact'); }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start">
          {renderSidebar()}

          <main className="min-w-0">
            {isLoading ? (
              <div className="text-center py-12 md:py-20">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">Loading...</p>
              </div>
            ) : view === 'enquiries' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <button onClick={() => { setView('profile'); setActiveMenu('profile'); }} className="hidden md:flex items-center gap-1 text-sm text-primary hover:underline">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <h2 className="text-lg md:text-xl font-bold text-foreground">My Enquiries</h2>
                </div>
                {enquiries.length === 0 ? (
                  <div className="text-center py-12 rounded-2xl border border-border bg-card">
                    <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No enquiries yet</p>
                    <button onClick={() => navigate('/products')} className="mt-3 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg">
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {enquiries.map((enq) => (
                      <div key={enq.id} className="p-4 md:p-5 rounded-xl md:rounded-2xl border border-border bg-card shadow-sm">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-muted-foreground font-mono">#{enq.id.slice(0, 8).toUpperCase()}</p>
                            <h3 className="text-sm font-semibold text-foreground line-clamp-1">{enq.product_name}</h3>
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                            enq.status === 'pending' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                            enq.status === 'reviewing' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                            enq.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                            enq.status === 'rejected' ? 'bg-red-50 text-red-600 border border-red-200' :
                            'bg-green-50 text-green-700 border border-green-200'
                          }`}>
                            {enq.status === 'reviewing' ? 'In Review' :
                             enq.status === 'approved' ? 'Approved' :
                             enq.status === 'rejected' ? 'Rejected' :
                             enq.status === 'completed' ? 'Completed' :
                             'Pending'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">Qty: {enq.quantity >= 5000 ? '5000+' : enq.quantity}</p>
                          <p className="text-xs text-muted-foreground">{new Date(enq.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => { setView('profile'); setActiveMenu('profile'); }} className="md:hidden mt-4 w-full py-2.5 border border-border text-sm font-medium rounded-xl hover:bg-muted transition-colors">
                  Back to Profile
                </button>
              </div>
            ) : view === 'settings' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <button onClick={() => { setView('profile'); setActiveMenu('profile'); }} className="hidden md:flex items-center gap-1 text-sm text-primary hover:underline">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <h2 className="text-lg md:text-xl font-bold text-foreground">Account Settings</h2>
                </div>
                {/* Change Password */}
                <div className="p-4 md:p-6 rounded-xl md:rounded-2xl border border-border bg-card shadow-sm space-y-4">
                  <h3 className="text-sm md:text-base font-bold text-foreground">Change Password</h3>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">New Password</label>
                    <input
                      type="password"
                      placeholder="Min 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    disabled={passwordLoading}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Update Password
                  </button>
                </div>
                <button onClick={() => { setView('profile'); setActiveMenu('profile'); }} className="md:hidden w-full py-2.5 border border-border text-sm font-medium rounded-xl hover:bg-muted transition-colors">
                  Back to Profile
                </button>
              </div>
            ) : (
              <div className="space-y-5 lg:space-y-6">
                {/* Profile Card */}
                <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-primary/10 bg-gradient-to-r from-primary/10 via-primary/5 to-background p-5 md:p-6 lg:p-8 shadow-sm">
                  <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
                    <div className="relative shrink-0">
                      <div className="relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-muted border-2 border-primary/20 overflow-hidden flex items-center justify-center">
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={profile?.full_name || user?.email || 'User'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground" />
                        )}
                        {avatarLoading && (
                          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={avatarLoading}
                        className="absolute -bottom-1 -left-1 md:bottom-0 md:left-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        aria-label="Upload profile photo"
                      >
                        <Camera className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
                        onChange={handleAvatarChange}
                        className="hidden"
                        aria-label="Profile photo file"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground truncate">
                        {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                      </h2>
                      <p className="text-sm text-muted-foreground truncate">{user?.email || ''}</p>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                          Member
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          Member since {memberSince}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <StatCard
                    icon={FileText}
                    iconBg="bg-primary/10"
                    iconColor="text-primary"
                    label="Total Enquiries"
                    value={enquiries.length}
                    action="View all enquiries"
                    onClick={() => { setActiveMenu('enquiries'); setView('enquiries'); }}
                  />
                  <StatCard
                    icon={Bell}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                    label="Notifications"
                    value={notifications.length}
                    action="View all notifications"
                    onClick={() => { setActiveMenu('notifications'); navigate('/notifications'); }}
                  />
                </div>

                {/* Account Information */}
                <div className="rounded-2xl md:rounded-3xl border border-border bg-card shadow-sm p-5 md:p-6 lg:p-8">
                  <h3 className="text-base md:text-lg font-bold text-foreground mb-4 md:mb-6">Account Information</h3>
                  <div className="divide-y divide-border">
                    {accountRows.map((row) => (
                      <div key={row.label} className="py-4 md:py-5 flex items-start gap-4">
                        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-1 md:gap-4">
                          <p className="text-sm text-muted-foreground">{row.label}</p>
                          <p className="text-sm md:text-base font-medium text-foreground break-words">{row.value}</p>
                        </div>
                        {row.editable ? (
                          <button
                            onClick={() => openFieldEditor(row.label, row.key, row.value)}
                            className="shrink-0 p-2 hover:bg-muted rounded-lg transition-colors"
                            aria-label={`Edit ${row.label}`}
                          >
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                          </button>
                        ) : (
                          <span className="shrink-0 p-2 text-muted-foreground text-xs">Locked</span>
                        )}
                      </div>
                    ))}
                    {addressRow ? (
                      <div key={addressRow.label} className="py-4 md:py-5 flex items-start gap-4">
                        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-1 md:gap-4">
                          <p className="text-sm text-muted-foreground">{addressRow.label}</p>
                          <p className="text-sm md:text-base font-medium text-foreground break-words">{addressRow.value}</p>
                        </div>
                        <button
                          onClick={() => openFieldEditor(addressRow.label, addressRow.key, addressRow.value)}
                          className="shrink-0 p-2 hover:bg-muted rounded-lg transition-colors"
                          aria-label={`Edit ${addressRow.label}`}
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    ) : (
                      <div className="py-4 md:py-5 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Address</p>
                        <button
                          onClick={() => openFieldEditor('Address', 'address', '')}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          + Add Address
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit Field Modal */}
                {editingField && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-lg p-5 md:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base md:text-lg font-bold text-foreground">Edit {editingField.label}</h3>
                        <button
                          onClick={() => setEditingField(null)}
                          className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                          aria-label="Close"
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                      <div className="mb-5">
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                          {editingField.label}
                        </label>
                        {editingField.key === 'address' ? (
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                          />
                        ) : (
                          <input
                            type={editingField.key === 'business_hours' ? 'text' : 'text'}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setEditingField(null)}
                          className="flex-1 py-2.5 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveField}
                          disabled={editLoading}
                          className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {editLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

const SidebarItem: React.FC<{
  icon: React.ElementType;
  label: string;
  active?: boolean;
  badge?: number;
  onClick: () => void;
}> = ({ icon: Icon, label, active, badge, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
      active
        ? 'bg-primary/10 text-primary'
        : 'text-foreground hover:bg-muted'
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
    <span className="flex-1">{label}</span>
    {badge ? (
      <span className="min-w-[1.25rem] h-5 px-1 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground rounded-full">
        {badge > 9 ? '9+' : badge}
      </span>
    ) : null}
  </button>
);

const MobileMenuItem: React.FC<{
  label: string;
  active?: boolean;
  badge?: number;
  onClick: () => void;
}> = ({ label, active, badge, onClick }) => (
  <button
    onClick={onClick}
    className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
      active
        ? 'bg-primary/10 text-primary border border-primary/20'
        : 'bg-muted text-foreground border border-transparent'
    }`}
  >
    {label}
    {badge ? (
      <span className="ml-1.5 inline-flex items-center justify-center min-w-[1rem] h-4 px-1 text-[9px] font-bold bg-primary text-primary-foreground rounded-full">
        {badge > 9 ? '9+' : badge}
      </span>
    ) : null}
  </button>
);

const StatCard: React.FC<{
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number | string;
  action: string;
  onClick: () => void;
}> = ({ icon: Icon, iconBg, iconColor, label, value, action, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 w-full p-4 md:p-5 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/20 transition-all text-left"
  >
    <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl md:rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
      <Icon className={`w-5 h-5 md:w-6 md:h-6 ${iconColor}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-2xl md:text-3xl font-bold text-foreground">{value}</p>
      <p className="text-xs md:text-sm text-muted-foreground">{label}</p>
    </div>
    <div className="shrink-0 text-left md:text-right">
      <span className="text-xs font-medium text-primary inline-flex items-center gap-1">
        {action} <ChevronRight className="w-3.5 h-3.5" />
      </span>
    </div>
  </button>
);

export default ProfilePage;
