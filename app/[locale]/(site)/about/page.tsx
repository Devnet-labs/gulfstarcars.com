import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { TeamMemberCard } from '@/components/TeamMemberCard';
import { Shield, FileCheck, Ship, CheckCircle2, Globe2, TrendingUp, Users, Award } from 'lucide-react';
import * as Motion from '@/components/motion';
import type { Metadata } from 'next';
import { generateMetadata as generateMeta } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.about' });

  return generateMeta({
    title: t('title'),
    description: t('description'),
    url: `/${locale}/about`,
    locale,
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  const t = await getTranslations('aboutPage');

  const teamMembers = await prisma.teamMember.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-12">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-12 sm:mb-20">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <div className="inline-block">
            <div className="h-1 w-16 bg-[#D4AF37] mx-auto mb-6" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight tracking-tight">
            {t('hero.title')} <span className="text-[#D4AF37]">{t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[#A3A3A3] leading-relaxed max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </Motion.div>
      </section>

      {/* Company Overview Section */}
      <section className="container mx-auto px-4 mb-12 sm:mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-6 tracking-tight">{t('overview.title')}</h2>
            <p className="text-sm sm:text-base text-[#A3A3A3] leading-relaxed mb-8">
              {t('overview.description')}
            </p>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { key: 'experience', label: 'experienceLabel' },
              { key: 'countries', label: 'countriesLabel' },
              { key: 'vehicles', label: 'vehiclesLabel' },
              { key: 'network', label: 'networkLabel' }
            ].map((stat, idx) => (
              <Motion.div
                key={stat.key}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-[#141414] border border-[#262626] rounded-lg p-6 hover:border-[#D4AF37] transition-all duration-300 cursor-pointer group"
              >
                <div className="text-3xl font-bold text-[#D4AF37] mb-2 group-hover:scale-105 transition-transform">
                  {t(`overview.stats.${stat.key}`)}
                </div>
                <div className="text-sm text-[#A3A3A3]">{t(`overview.stats.${stat.label}`)}</div>
              </Motion.div>
            ))}
          </Motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="container mx-auto px-4 mb-12 sm:mb-20">
        <div className="grid md:grid-cols-2 gap-6">
          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#141414] border border-[#262626] rounded-lg p-8 hover:border-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/10 transition-all duration-300 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 tracking-tight">{t('mission.title')}</h3>
            <p className="text-sm sm:text-base text-[#A3A3A3] leading-relaxed">{t('mission.content')}</p>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#141414] border border-[#262626] rounded-lg p-8 hover:border-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/10 transition-all duration-300 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 tracking-tight">{t('vision.title')}</h3>
            <p className="text-sm sm:text-base text-[#A3A3A3] leading-relaxed">{t('vision.content')}</p>
          </Motion.div>
        </div>
      </section>

      {/* Leadership Team Section */}
      {teamMembers.length > 0 && (
        <section className="container mx-auto px-4 mb-12 sm:mb-20">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-4 py-2 rounded-full">
                {t('leadership.badge')}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
              {t('leadership.title')} <span className="text-[#D4AF37]">{t('leadership.titleHighlight')}</span>
            </h2>
            <p className="text-sm sm:text-base text-[#A3A3A3] max-w-2xl mx-auto">{t('leadership.subtitle')}</p>
          </Motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <TeamMemberCard
                key={member.id}
                name={member.name}
                position={member.position}
                bio={member.bio}
                image={member.image || undefined}
                linkedIn={member.linkedIn || undefined}
                email={member.email || undefined}
                website={member.website || undefined}
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      {/* Global Presence Section */}
      <section className="container mx-auto px-4 mb-12 sm:mb-20">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-4 py-2 rounded-full">
              {t('global.badge')}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
            {t('global.title')} <span className="text-[#D4AF37]">{t('global.titleHighlight')}</span>
          </h2>
          <p className="text-sm sm:text-base text-[#A3A3A3] max-w-2xl mx-auto">{t('global.subtitle')}</p>
        </Motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {['africa', 'asia', 'europe', 'middleEast', 'northAmerica', 'southAmerica'].map((region, index) => (
            <Motion.div
              key={region}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-[#141414] border border-[#262626] rounded-lg p-6 text-center hover:border-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/10 transition-all duration-300 cursor-pointer group"
            >
              <Globe2 className="w-8 h-8 text-[#D4AF37] mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-medium text-white">{t(`global.regions.${region}`)}</div>
            </Motion.div>
          ))}
        </div>
      </section>

      {/* Trust & Compliance Section */}
      <section className="container mx-auto px-4">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-4 py-2 rounded-full">
              {t('trust.badge')}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
            {t('trust.title')} <span className="text-[#D4AF37]">{t('trust.titleHighlight')}</span>
          </h2>
          <p className="text-sm sm:text-base text-[#A3A3A3] max-w-2xl mx-auto">{t('trust.subtitle')}</p>
        </Motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Shield, key: 'inspection', delay: 0 },
            { icon: FileCheck, key: 'documentation', delay: 0.1 },
            { icon: Ship, key: 'logistics', delay: 0.2 },
            { icon: CheckCircle2, key: 'compliance', delay: 0.3 }
          ].map(({ icon: Icon, key, delay }) => (
            <Motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay }}
              className="bg-[#141414] border border-[#262626] rounded-lg p-6 hover:border-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/10 transition-all duration-300 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2 tracking-tight">{t(`trust.steps.${key}.title`)}</h3>
              <p className="text-xs sm:text-sm text-[#A3A3A3]">{t(`trust.steps.${key}.desc`)}</p>
            </Motion.div>
          ))}
        </div>
      </section>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Gulf Star Automotive FZC',
            description: 'International vehicle export company based in Dubai, UAE',
            url: 'https://gulfstarcars.com',
            logo: 'https://gulfstarcars.com/images/portfolio/logo/logo.png',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'AE',
              addressLocality: 'Dubai',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+971-523479535',
              contactType: 'Customer Service',
            },
          }),
        }}
      />
    </div>
  );
}
