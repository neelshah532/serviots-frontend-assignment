import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, GraduationCap, Briefcase } from 'lucide-react';
import { useUserDetail } from '../hooks/useUserDetail';
import { SkeletonLoader } from '../components/SkeletonLoader';

const getAvatarStyle = (name: string): React.CSSProperties => {
  const hues = [210, 160, 270, 30, 340, 190];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hues[Math.abs(hash) % hues.length];
  return { backgroundColor: `hsl(${hue}, 40%, 90%)`, color: `hsl(${hue}, 45%, 32%)` };
};

const getRoleBadgeClass = (role: string): string => {
  switch (role) {
    case 'admin': return 'border-indigo-400/40 text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-500/10';
    case 'editor': return 'border-amber-400/40 text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/10';
    default: return 'border-emerald-400/40 text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/10';
  }
};

const InfoCard = ({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon: React.ElementType }) => (
  <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] p-7 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300">
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[var(--color-border-subtle)]">
      <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-surface-raised)] text-[#6b7280] flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="font-bold text-[var(--color-text-primary)]">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 justify-between">
    <span className="text-sm font-medium text-[var(--color-text-muted)]">{label}</span>
    <span className="text-sm font-medium text-[var(--color-text-primary)] text-left sm:text-right">{value}</span>
  </div>
);

export const UserDetailPage = () => {
  const location = useLocation();
  const id = location.state?.userId;
  const navigate = useNavigate();
  const { user } = useUserDetail(id);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => { setIsLoading(false); }, 600);
    return () => { clearTimeout(timer); };
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-[120ms] mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />Back to Users
        </Link>
        <SkeletonLoader type="detail" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 bg-[var(--color-danger-light)] text-[var(--color-danger)] rounded-full flex items-center justify-center mb-5"><Briefcase className="w-6 h-6" /></div>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">User Not Found</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2 mb-8 max-w-sm">The user does not exist or may have been deleted.</p>
        <button onClick={() => navigate('/')} className="px-5 py-2 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-[var(--radius-sm)] text-sm font-medium shadow-[var(--shadow-xs)] hover:-translate-y-px hover:shadow-[var(--shadow-md)] transition-all duration-[120ms] active:scale-[0.98]">Go Back</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-[120ms] mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />Back to Users
      </Link>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-7 pb-10 border-b border-[var(--color-border)]">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center font-bold text-3xl shrink-0 shadow-[var(--shadow-sm)]" style={getAvatarStyle(user.firstName + user.lastName)}>
            {user.firstName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left pt-1">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">{user.firstName} {user.lastName}</h1>
              <span className={`px-2.5 py-0.5 rounded-[var(--radius-sm)] text-xs font-medium capitalize border ${getRoleBadgeClass(user.role)}`}>{user.role}</span>
            </div>
            <p className="text-[var(--color-text-secondary)] mt-2 flex items-center gap-2 text-sm">
              <Briefcase className="w-4 h-4 text-[#6b7280]" />
              {user.company.title} at <span className="font-medium text-[var(--color-text-primary)]">{user.company.name}</span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard title="Basic Information" icon={Briefcase}>
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Phone" value={user.phone} />
            <InfoRow label="Age" value={`${user.age} years`} />
            <InfoRow label="Gender" value={<span className="capitalize">{user.gender}</span>} />
          </InfoCard>
          <InfoCard title="Address" icon={MapPin}>
            <InfoRow label="Street" value={user.address.address} />
            <InfoRow label="City" value={user.address.city} />
            <InfoRow label="State" value={user.address.state} />
            <InfoRow label="Country" value={user.address.country} />
          </InfoCard>
          <InfoCard title="Company" icon={Building2}>
            <InfoRow label="Name" value={user.company.name} />
            <InfoRow label="Department" value={user.company.department} />
            <InfoRow label="Title" value={user.company.title} />
          </InfoCard>
          <InfoCard title="Education" icon={GraduationCap}>
            <InfoRow label="Born" value={new Date(user.birthDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} />
            <InfoRow label="University" value={user.university} />
          </InfoCard>
        </div>
      </div>
    </div>
  );
};
