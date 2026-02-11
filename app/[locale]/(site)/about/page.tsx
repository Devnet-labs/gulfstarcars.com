import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export default async function AboutPage() {
    const t = await getTranslations('aboutPage');

    return (
        <div className="min-h-screen pt-24 pb-12">
            {/* Hero Section */}
            <section className="container mx-auto px-4 mb-20">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {t('hero.title')} <span className="text-primary">{t('hero.titleHighlight')}</span>
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        {t('hero.subtitle')}
                    </p>
                </div>
            </section>

            {/* Mission & Story Content */}
            <section className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center mb-20">
                <div className="relative h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                    <Image
                        src="/images/placeholders/hero-car.png" // Fallback placeholder, ideally should be a real office/showroom image
                        alt="Our Story"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                </div>
                <div className="space-y-8">
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-4 text-white">{t('mission.title')}</h2>
                        <p className="text-gray-400 leading-relaxed">
                            {t('mission.content')}
                        </p>
                    </div>
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-4 text-white">{t('story.title')}</h2>
                        <p className="text-gray-400 leading-relaxed">
                            {t('story.content')}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
