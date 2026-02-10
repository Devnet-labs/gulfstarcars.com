'use client';

import { Globe, Users, Database, Zap } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useTranslations } from "next-intl";

export function WhyChooseUs() {
    const t = useTranslations('whyChooseUs');

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    const features = [
        {
            icon: Globe,
            title: t('globalReach.title'),
            desc: t('globalReach.desc')
        },
        {
            icon: Users,
            title: t('premiumMembers.title'),
            desc: t('premiumMembers.desc')
        },
        {
            icon: Database,
            title: t('database.title'),
            desc: t('database.desc')
        },
        {
            icon: Zap,
            title: t('integration.title'),
            desc: t('integration.desc')
        }
    ];

    return (
        <section className="py-32 bg-background relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-20 pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block text-primary font-bold tracking-wider text-sm uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20 backdrop-blur-md mb-6">
                            {t('badge')}
                        </span>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
                            {t('title')} <span className="text-primary">{t('titleHighlight')}</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            className="group p-8 rounded-[32px] bg-card border border-white/5 shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-500 shadow-inner border border-white/5">
                                    <feature.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    {feature.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
