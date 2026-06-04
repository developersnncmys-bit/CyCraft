'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { heroContent } from '@/content/hero';

const ApplyModal = dynamic(() => import('@/features/22-apply-modal'), { ssr: false });

export function HeroCTA() {
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Button variant="primary" onClick={() => setApplyOpen(true)}>
          {heroContent.ctas.apply.label}
        </Button>
        <Button as="a" href={heroContent.ctas.curriculum.href} variant="ghost">
          {heroContent.ctas.curriculum.label}
        </Button>
      </div>

      <ApplyModal isOpen={applyOpen} onClose={() => setApplyOpen(false)} />
    </>
  );
}
