'use client';
import './globals.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const container = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  const excludedRoutes = ['/'];
  const isExcluded = excludedRoutes.includes(pathname);

  // Ensure it runs only on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useGSAP(() => {
    if (!isMounted || isExcluded) return;

    const ease = 'power4.inOut';

    function revealTransition() {
      return new Promise((resolve) => {
        gsap.set('.block', { scaleY: 1 });
        gsap.to('.block', {
          scaleY: 0,
          duration: 1,
          stagger: {
            each: 0.1,
            from: 'start',
            grid: 'auto',
            axis: 'x',
          },
          ease: ease,
          onComplete: resolve,
        });
      });
    }

    function animateTransition() {
      return new Promise((resolve) => {
        gsap.set('.block', { visibility: 'visible', scaleY: 0 });
        gsap.to('.block', {
          scaleY: 1,
          duration: 1,
          stagger: {
            each: 0.1,
            from: 'start',
            grid: [2, 5],
            axis: 'x',
          },
          ease: ease,
          onComplete: resolve,
        });
      });
    }

    document.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const href = link.getAttribute('href');

        if (href && !href.startsWith('#') && href !== pathname) {
          animateTransition().then(() => {
            router.push(href);
          });
        }
      });
    });

    revealTransition().then(() => {
      gsap.set('.block', { visibility: 'hidden' });
    });
  }, [isMounted, pathname]);

  if (isExcluded) {
    return (
      <html lang='en'>
        <body>{children}</body>
      </html>
    );
  }

  return (
    <html lang='en'>
      <body ref={container}>
        <div className='transition'>
          <div className='transition-row row-1'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='block'></div>
            ))}
          </div>
          <div className='transition-row row-2'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='block'></div>
            ))}
          </div>
        </div>
        <div className='nav-container shadow'>
          <div className='logo'>
            <img src='https://interfact.net/images/logo.png' alt='' />
            <div className='logo-words'>
              <span className='logo2'>INTERFACT</span>
              <span className='logo3'>ADMIN DASHBOARD</span>
            </div>
          </div>
          <Link href='/dashboard' className='nav-dashboard'>
            HOME
          </Link>
          <Link href='/cities' className='nav-locations'>
            CITIES
          </Link>
          <Link href='/requests' className='nav-requests'>
            REQUESTS
          </Link>
        </div>
        {children}
      </body>
    </html>
  );
}
