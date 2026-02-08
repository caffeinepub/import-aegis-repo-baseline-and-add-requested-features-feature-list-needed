import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { useGetPendingFollowRequests } from '../hooks/useQueries';

export function DashboardStats() {
  const { data: pendingRequests, isLoading } = useGetPendingFollowRequests();

  const stats = [
    {
      title: 'Pending Requests',
      value: isLoading ? '...' : pendingRequests?.length || 0,
      icon: UserPlus,
      description: 'Awaiting your response',
      color: 'text-amber-600 dark:text-amber-500',
      bgColor: 'bg-amber-100 dark:bg-amber-950',
    },
    {
      title: 'Followers',
      value: '—',
      icon: Users,
      description: 'Coming soon',
      color: 'text-emerald-600 dark:text-emerald-500',
      bgColor: 'bg-emerald-100 dark:bg-emerald-950',
    },
    {
      title: 'Following',
      value: '—',
      icon: UserCheck,
      description: 'Coming soon',
      color: 'text-sky-600 dark:text-sky-500',
      bgColor: 'bg-sky-100 dark:bg-sky-950',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading && stat.title === 'Pending Requests' ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  stat.value
                )}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
