import Link from 'next/link';
import Shell from '@/components/shell';
import type { ReactNode } from 'react';

type FeatureShellPageProps = {
  title: string;
  subtitle: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  endpoints?: readonly string[];
  children?: ReactNode;
};

export function FeatureShellPage({
  title,
  subtitle,
  description,
  ctaLabel,
  ctaHref,
  endpoints = [],
  children,
}: FeatureShellPageProps) {
  return (
    <Shell
      heading={title}
      subtitle={subtitle}
      CTA={
        ctaLabel && ctaHref ? (
          <Link
            href={ctaHref}
            className="bg-brand text-brand-contrast rounded-md px-4 py-2 text-sm font-semibold"
          >
            {ctaLabel}
          </Link>
        ) : undefined
      }
    >
      <section className="bg-default border-subtle mt-4 rounded-md border p-6">
        <h2 className="text-emphasis text-lg font-semibold">{title}</h2>
        <p className="text-subtle mt-2 text-sm">{description}</p>

        {endpoints.length > 0 && (
          <div className="mt-5">
            <h3 className="text-emphasis text-sm font-semibold">
              Backend endpoints
            </h3>
            <ul className="text-subtle mt-2 space-y-1 text-sm">
              {endpoints.map((endpoint) => (
                <li key={endpoint} className="font-mono">
                  {endpoint}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
      {children}
    </Shell>
  );
}
