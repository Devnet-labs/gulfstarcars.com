'use client';

import { Globe, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function Features() {
    const t = useTranslations('features');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const features = [
        { icon: Globe, title: t('globalReach.title'), desc: t('globalReach.desc') },
        { icon: ShieldCheck, title: t('verifiedQuality.title'), desc: t('verifiedQuality.desc') },
        { icon: Zap, title: t('fastProcessing.title'), desc: t('fastProcessing.desc') }
    ];

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-4">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            className="p-8 rounded-3xl bg-card border border-border/50 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                <feature.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
