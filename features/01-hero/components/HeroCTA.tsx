import { Button } from '@/components/ui/Button';
import { heroContent } from '@/content/hero';

export function HeroCTA() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Button as="a" href={heroContent.ctas.apply.href} variant="primary">
        {heroContent.ctas.apply.label}
      </Button>
      <Button as="a" href={heroContent.ctas.curriculum.href} variant="ghost">
        {heroContent.ctas.curriculum.label}
      </Button>
    </div>
  );
}
