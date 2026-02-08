import { useInternetIdentity } from './hooks/useInternetIdentity';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Loader2, Shield, Users, UserPlus, Bell } from 'lucide-react';
import { FollowRequestsPanel } from './components/FollowRequestsPanel';
import { SearchUsers } from './components/SearchUsers';
import { DashboardStats } from './components/DashboardStats';
import { Toaster } from './components/ui/sonner';

function App() {
  const { identity, login, clear, loginStatus, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Initializing AEGIS...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Toaster />
        <header className="border-b border-border bg-card">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">AEGIS</h1>
            </div>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Welcome to AEGIS</CardTitle>
              <CardDescription>
                A decentralized social networking and identity management platform built on the Internet Computer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Features:</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Secure follow request management
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Self-sovereign identity verification
                  </li>
                  <li className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Decentralized social networking
                  </li>
                </ul>
              </div>
              <Button
                onClick={login}
                disabled={loginStatus === 'logging-in'}
                className="w-full"
                size="lg"
              >
                {loginStatus === 'logging-in' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect with Internet Identity'
                )}
              </Button>
              {loginStatus === 'loginError' && (
                <p className="text-center text-sm text-destructive">
                  Failed to connect. Please try again.
                </p>
              )}
            </CardContent>
          </Card>
        </main>

        <footer className="border-t border-border bg-card py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © 2026. Built with love using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Toaster />
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">AEGIS</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="hidden sm:flex">
              {identity.getPrincipal().toString().slice(0, 8)}...
            </Badge>
            <Button onClick={clear} variant="outline" size="sm">
              Disconnect
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Manage your network and follow requests
            </p>
          </div>

          <DashboardStats />

          <div className="grid gap-6 lg:grid-cols-2">
            <SearchUsers />
            <FollowRequestsPanel />
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026. Built with love using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
