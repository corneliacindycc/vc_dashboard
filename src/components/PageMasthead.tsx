export function PageMasthead({
  kicker,
  title,
  subtitle,
  meta,
  children,
}: {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: string;
  meta?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-brand text-white">
      <div className="mx-auto max-w-[1400px] px-8 py-16 md:px-12 md:py-20">
        {kicker && (
          <p className="mb-4 text-sm uppercase tracking-widest text-white/80">{kicker}</p>
        )}
        <h1 className="display max-w-4xl text-[clamp(40px,5.5vw,72px)]">{title}</h1>
        {subtitle && (
          <p className="mt-8 max-w-[780px] text-[22px] leading-[1.4] font-normal">
            {subtitle}
          </p>
        )}
        {meta && <p className="mt-4 text-sm text-white/80">{meta}</p>}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
