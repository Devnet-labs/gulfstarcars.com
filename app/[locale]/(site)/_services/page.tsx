import { getTranslations } from 'next-intl/server';
import { Truck, Search, ShieldCheck, Globe, FileCheck } from 'lucide-react';

export default async function ServicesPage() {
    const t = await getTranslations('servicesPage');

    const services = [
        { key: 'sourcing', icon: Search },
        { key: 'inspection', icon: ShieldCheck },
        { key: 'logistics', icon: Truck },
        { key: 'customs', icon: FileCheck },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12">
            {/* Hero Section */}
            <section className="container mx-auto px-4 mb-16 sm:mb-20 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-6 tracking-tight">
                    {t('hero.title')} <span className="text-primary">{t('hero.titleHighlight')}</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    {t('hero.subtitle')}
                </p>
            </section>

            {/* Services Grid */}
            <section className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-6">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <div
                                key={service.key}
                                className="group bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300"
                            >
                                <div className="bg-primary/20 p-4 rounded-2xl w-fit mb-6 group-hover:bg-primary/30 transition-colors">
                                    <Icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
                                    {t(`${service.key}.title`)}
                                </h3>
                                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                                    {t(`${service.key}.desc`)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
