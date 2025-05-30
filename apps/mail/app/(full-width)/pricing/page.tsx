'use client';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  ListItem,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PixelatedBackground } from '@/components/home/pixelated-bg';
import { CircleCheck, CircleX } from '@/components/icons/icons';
import PricingCard from '@/components/pricing/pricing-card';
import Comparision from '@/components/pricing/comparision';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { signIn, useSession } from '@/lib/auth-client';
import { Separator } from '@/components/ui/separator';
import { useBilling } from '@/hooks/use-billing';
import { Button } from '@/components/ui/button';
import Footer from '@/components/home/footer';
import { useCustomer } from 'autumn-js/next';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import Link from 'next/link';

const resources = [
  {
    title: 'GitHub',
    href: 'https://github.com/Mail-0/Zero',
    description: 'Check out our open-source projects and contributions.',
    platform: 'github' as const,
  },
  {
    title: 'Twitter',
    href: 'https://x.com/zerodotemail',
    description: 'Follow us for the latest updates and announcements.',
    platform: 'twitter' as const,
  },
  {
    title: 'LinkedIn',
    href: 'https://www.linkedin.com/company/zerodotemail/',
    description: 'Connect with us professionally and stay updated.',
    platform: 'linkedin' as const,
  },
  {
    title: 'Discord',
    href: 'https://discord.gg/0email',
    description: 'Join our community and chat with the team.',
    platform: 'discord' as const,
  },
];

const aboutLinks = [
  {
    title: 'About',
    href: '/about',
    description: 'Learn more about Zero and our mission.',
  },
  {
    title: 'Privacy',
    href: '/privacy',
    description: 'Read our privacy policy and data handling practices.',
  },
  {
    title: 'Terms of Service',
    href: '/terms',
    description: 'Review our terms of service and usage guidelines.',
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <main className="relative flex h-screen flex-1 flex-col overflow-x-hidden bg-[#0F0F0F]">
      <PixelatedBackground
        className="z-1 absolute left-1/2 top-[-40px] h-auto w-screen min-w-[1920px] -translate-x-1/2 object-cover"
        style={{
          mixBlendMode: 'screen',
          maskImage: 'linear-gradient(to bottom, black, transparent)',
        }}
      />

      {/* Desktop Navigation - Hidden on mobile */}
      <header className="fixed z-50 hidden w-full items-center justify-center px-4 pt-6 md:flex">
        <nav className="border-input/50 relative z-50 flex w-full max-w-3xl items-center justify-between gap-2 rounded-xl border-t bg-[#1E1E1E] p-2 px-4">
          <div className="flex items-center gap-6">
            <a href="/" className="relative bottom-1 cursor-pointer">
              <Image src="white-icon.svg" alt="Zero Email" width={22} height={22} />
              <span className="text-muted-foreground absolute -right-[-0.5px] text-[10px]">
                beta
              </span>
            </a>
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Company</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[600px]">
                      {aboutLinks.map((link) => (
                        <ListItem key={link.title} title={link.title} href={link.href}>
                          {link.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {resources.map((resource) => (
                        <ListItem
                          key={resource.title}
                          title={resource.title}
                          href={resource.href}
                          platform={resource.platform}
                        >
                          {resource.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <a href="/pricing">
                    <Button variant="ghost" className="h-9">
                      Pricing
                    </Button>
                  </a>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="h-8"
              onClick={() => {
                if (session) {
                  // User is logged in, redirect to inbox
                  router.push('/mail/inbox');
                } else {
                  // User is not logged in, show sign-in dialog
                  toast.promise(
                    signIn.social({
                      provider: 'google',
                      callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/mail`,
                    }),
                    {
                      error: 'Login redirect failed',
                    },
                  );
                }
              }}
            >
              Sign in
            </Button>

            <a target="_blank" href="https://cal.com/team/0">
              <Button className="h-8 font-medium">Contact Us</Button>
            </a>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Sheet */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed left-4 top-6 z-50">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] bg-[#111111] sm:w-[400px]">
            <SheetHeader className="flex flex-row items-center justify-between">
              <SheetTitle>
                <Image src="white-icon.svg" alt="Zero Email" width={22} height={22} />
              </SheetTitle>
              <a href="/login">
                <Button className="w-full">Sign in</Button>
              </a>
            </SheetHeader>
            <div className="mt-8 flex flex-col space-y-3">
              <div className="space-y-3">
                <h4 className="text-muted-foreground text-sm font-medium">Company</h4>
                {aboutLinks.map((link) => (
                  <a key={link.title} href={link.href} className="block font-medium">
                    {link.title}
                  </a>
                ))}
              </div>
              <a target="_blank" href="https://cal.com/team/0" className="font-medium">
                Contact Us
              </a>
            </div>
            <Separator className="mt-8" />
            <div className="mt-8 flex flex-row items-center justify-center gap-4">
              {resources.map((resource) => (
                <Link
                  key={resource.title}
                  href={resource.href}
                  className="flex items-center gap-2 font-medium"
                >
                  {resource.platform && (
                    <Image
                      src={`/${resource.platform}.svg`}
                      alt={resource.platform}
                      width={20}
                      height={20}
                    />
                  )}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="container mx-auto mb-20 mt-12 h-screen px-4 py-16 md:mt-44">
        <div className="mb-12 text-center">
          <h1 className="mb-2 self-stretch text-5xl font-medium leading-[62px] text-white md:text-6xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-6 text-2xl font-light text-[#B8B8B9]">
            Choose the plan that's right for you
          </p>
        </div>

        <div className="mx-auto max-w-5xl px-4">
          {/* Free Plan */}
          <PricingCard />

          {/* <div className="relative flex h-full flex-col rounded-xl border bg-[#121212] px-8 pb-4 pt-8">
            <h1 className="mb-4 text-center text-lg font-normal text-white/50">Free</h1>
            <div className="mb-4 text-center text-3xl font-bold dark:text-white">
              $0 <span className="text-lg font-medium">/ mo</span>
            </div>
            <ul className="mb-6 w-full flex-grow space-y-2 text-left">
              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 fill-[#2FAD71]" /> 1 email connection
              </li>

              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 fill-[#2FAD71]" /> AI chat{' '}
                <span className="text-xs text-white/50">(25 per day)</span>
              </li>

              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 fill-[#2FAD71]" /> AI writing assistant
              </li>
              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 fill-[#2FAD71]" /> Auto labeling
                <span className="text-xs text-white/50">(25 per day)</span>
              </li>
              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 fill-[#2FAD71]" />
                <span>
                  AI thread summaries <span className="text-xs text-white/50">(25 per day)</span>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CircleX className="h-4 w-4 fill-white opacity-50" /> Instant thread AI-generated
                summaries
              </li>

              <li className="flex items-center gap-2">
                <CircleX className="h-4 w-4 fill-white opacity-50" /> Verified checkmark
              </li>
              <li className="flex items-center gap-2">
                <CircleX className="h-4 w-4 fill-white opacity-50" /> Priority customer support
              </li>
            </ul>
            <a href="/login">
              <Button className="h-8 w-full">Get Started</Button>
            </a>
          </div> */}

          {/* Pro Plan */}
          {/* <div className="relative flex h-full flex-col rounded-xl border bg-[#121212] px-8 pb-4 pt-8">
            <h1 className="mb-4 text-center text-lg font-normal text-white/50">Pro</h1>

            <div className="mb-4 text-center text-3xl font-bold dark:text-white">
              $20 <span className="text-lg font-medium">/ mo</span>
            </div>
            <ul className="mb-6 w-full flex-grow space-y-2 text-left">
              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 fill-[#2FAD71]" /> Unlimited email connections
              </li>

              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 fill-[#2FAD71]" /> AI chat
              </li>

              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 fill-[#2FAD71]" /> AI writing assistant
              </li>
              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 fill-[#2FAD71]" /> Auto labeling
              </li>
              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 fill-[#2FAD71]" /> AI thread summaries
              </li>

              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 fill-[#2FAD71]" /> Verified checkmark
              </li>
            </ul>
            <Button className="h-8 w-full" onClick={handleUpgrade}>
              Get Started
            </Button>
          </div> */}

          {/* Enterprise Plan */}
          {/* <div className="relative flex h-full flex-col rounded-xl border bg-[#121212] px-8 pb-4 pt-8">
            <h1 className="mb-4 text-center text-lg font-normal text-white/50">Enterprise</h1>

            <div className="mb-4 text-center text-3xl font-bold dark:text-white">Contact us</div>
            <ul className="mb-6 w-full flex-grow space-y-2 text-left">
              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 fill-[#2FAD71]" /> Unlimited email connections
              </li>

              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 fill-[#2FAD71]" /> AI chat
              </li>

              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 fill-[#2FAD71]" /> AI writing assistant
              </li>
              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 fill-[#2FAD71]" /> Auto labeling
              </li>
              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 fill-[#2FAD71]" /> AI thread summaries
              </li>

              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 fill-[#2FAD71]" /> Verified checkmark
              </li>

              

              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 fill-[#2FAD71]" /> Priority customer support
              </li>
            </ul>
            <a href="https://cal.com/team/0/chat" target="_blank">
              <Button className="h-8 w-full" onClick={handleUpgrade}>
                Contact us
              </Button>
            </a>
          </div> */}
        </div>
      </div>
      <div className="mx-12 mt-[500px] md:mt-12">
        <Comparision />
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </main>
  );
}
