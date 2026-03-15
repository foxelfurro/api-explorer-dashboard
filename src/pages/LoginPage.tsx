import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { login, getApiBase, setApiBase } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiUrl, setApiUrl] = useState(getApiBase());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (apiUrl) setApiBase(apiUrl);

    try {
      const data = await login(email, password);
      const token = data.token || data.access_token || data.jwt;
      if (!token) throw new Error('No token in response');
      setToken(token);
      navigate('/admin/catalog');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="w-[320px] rounded border border-border bg-card p-6 space-y-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Inventory API Client</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to test the API</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-url" className="text-xs text-muted-foreground">API Base URL</Label>
          <Input
            id="api-url"
            type="url"
            placeholder="https://api.example.com"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="h-9 text-sm font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-9 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs text-muted-foreground">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-9 text-sm"
          />
        </div>

        {error && (
          <div className="rounded border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full h-9 text-sm press-effect">
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
