import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AuthTabs({ active }: { active: 'login' | 'register' }) {
  const navigate = useNavigate()

  return (
    <div className="flex justify-center pb-4">
      <Tabs
        value={active}
        onValueChange={(v) => {
          if (v === 'login') navigate('/auth/login')
          if (v === 'register') navigate('/auth/register')
        }}
      >
        <TabsList className="h-10 rounded-full bg-card border p-1 shadow-md">
          <TabsTrigger
            value="login"
            className={cn(
              'h-8 rounded-full px-6 py-2 text-xs font-medium shadow-none',
              'data-[state=active]:bg-background data-[state=active]:text-accent data-[state=active]:shadow-sm',
              'data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-accent'
            )}
          >
            Log in
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className={cn(
              'h-8 rounded-full px-6 py-2 text-xs font-medium shadow-none',
              'data-[state=active]:bg-card data-[state=active]:text-accent data-[state=active]:shadow-sm',
              'data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-accent'
            )}
          >
            Create Account
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

