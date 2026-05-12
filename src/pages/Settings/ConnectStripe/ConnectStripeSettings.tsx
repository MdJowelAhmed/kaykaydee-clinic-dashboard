import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Link2,
  Shield,
  Unplug,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { toast } from '@/utils/toast'

const STRIPE_DASHBOARD_URL = 'https://dashboard.stripe.com/'

export default function ConnectStripeSettings() {
  const [connected, setConnected] = useState(false)
  const [busy, setBusy] = useState(false)

  const handleConnect = async () => {
    setBusy(true)
    // Replace with: window.location.href = await fetchStripeConnectLink()
    await new Promise((r) => setTimeout(r, 900))
    setConnected(true)
    setBusy(false)
    toast({
      title: 'Stripe connected',
      description: 'Your clinic Stripe account is linked. Patient payments can be routed to your account.',
    })
  }

  const handleDisconnect = () => {
    if (!window.confirm('Disconnect this clinic from Stripe? Incoming payments will stop until you connect again.')) {
      return
    }
    setConnected(false)
    toast({
      title: 'Disconnected',
      description: 'Stripe has been disconnected for this clinic.',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-accent">Connect Stripe</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Link your clinic&apos;s Stripe account so the platform can send payouts and your patients
          can pay you directly. Only one connected account per clinic is used for billing flows.
        </p>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 pb-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#635BFF]/15 text-[#635BFF]">
              <Link2 className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-base">Clinic Stripe account</CardTitle>
              <CardDescription>
                Stripe Connect lets this clinic receive card payments while staying compliant. Your
                keys and onboarding are handled by Stripe.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-5 sm:p-6">
          <div
            className={cn(
              'flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between',
              connected
                ? 'border-emerald-500/40 bg-emerald-500/5'
                : 'border-amber-500/35 bg-amber-500/5'
            )}
          >
            <div className="flex items-start gap-3">
              {connected ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
              ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
              )}
              <div>
                <p className="text-sm font-semibold text-accent">
                  {connected ? 'Connected' : 'Not connected'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {connected
                    ? 'Demo account acct_1DemoClinic789 — replace with live account id from your API.'
                    : 'Complete Stripe onboarding to activate card payments for this clinic.'}
                </p>
              </div>
            </div>
            {connected ? (
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" asChild>
                  <a href={STRIPE_DASHBOARD_URL} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Stripe Dashboard
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleDisconnect}
                >
                  <Unplug className="mr-2 h-4 w-4" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                className="h-11 shrink-0 bg-[#635BFF] px-6 text-white hover:bg-[#5851ea]"
                onClick={handleConnect}
                disabled={busy}
                isLoading={busy}
              >
                Connect with Stripe
              </Button>
            )}
          </div>

          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span>
                Card data never touches your servers — Stripe hosts checkout and payouts in
                production.
              </span>
            </li>
            <li className="flex gap-2">
              <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span>
                Wire the <strong className="text-accent">Connect with Stripe</strong> button to
                your backend OAuth URL (Standard or Express account). This screen is ready for that
                redirect flow.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}
