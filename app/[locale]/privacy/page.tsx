
"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function PrivacyPage() {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    // Use translations from the privacyPage section in en.json
    const t = useTranslations('privacyPage');

    return (
        <motion.div
            className="container mx-auto px-4 py-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.h1 
                className="text-4xl font-bold mb-10 text-center"
                variants={itemVariants}
                initial={{ opacity: 0, y: -50 }}
                animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                        type: "spring", 
                        stiffness: 100,
                        damping: 15
                    }
                }}
            >
                {t('title')}
            </motion.h1>

            <motion.div 
                className="light space-y-6 mb-10"
                variants={itemVariants}
            >
                <Card className="rounded-lg shadow-md overflow-hidden">
                    <CardHeader className="bg-gray-100 p-4">
                        <h2 className="text-xl font-bold">{t('sections.introduction.title')}</h2>
                    </CardHeader>
                    <CardBody className="p-5">
                        <p className="mb-4">
                            {t('sections.introduction.content.0')}
                        </p>
                        <p>
                            {t('sections.introduction.content.1')}
                        </p>
                    </CardBody>
                </Card>

                <Card className="rounded-lg shadow-md overflow-hidden">
                    <CardHeader className="bg-gray-100 p-4">
                        <h2 className="text-xl font-bold">{t('sections.informationCollection.title')}</h2>
                    </CardHeader>
                    <CardBody className="p-5">
                        <h3 className="text-lg font-semibold mb-3">{t('sections.informationCollection.subtitle')}</h3>
                        <p className="mb-4">
                            {t('sections.informationCollection.content.0')}
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            {t.raw('sections.informationCollection.listItems').map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </CardBody>
                </Card>

                <Card className="rounded-lg shadow-md overflow-hidden">
                    <CardHeader className="bg-gray-100 p-4">
                        <h2 className="text-xl font-bold">{t('sections.informationUsage.title')}</h2>
                    </CardHeader>
                    <CardBody className="p-5">
                        <p className="mb-4">{t('sections.informationUsage.content.0')}</p>
                        <ul className="list-disc pl-6 space-y-2">
                            {t.raw('sections.informationUsage.listItems').map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </CardBody>
                </Card>

                <Card className="rounded-lg shadow-md overflow-hidden">
                    <CardHeader className="bg-gray-100 p-4">
                        <h2 className="text-xl font-bold">{t('sections.dataSharing.title')}</h2>
                    </CardHeader>
                    <CardBody className="p-5">
                        <p className="mb-4">
                            {t('sections.dataSharing.content.0')}
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            {t.raw('sections.dataSharing.listItems').map((item: any, index: number) => (
                                <li key={index}>
                                    <span className="font-semibold">{item.title}</span> {item.description}
                                </li>
                            ))}
                        </ul>
                    </CardBody>
                </Card>

                <Card className="rounded-lg shadow-md overflow-hidden">
                    <CardHeader className="bg-gray-100 p-4">
                        <h2 className="text-xl font-bold">{t('sections.dataSecurity.title')}</h2>
                    </CardHeader>
                    <CardBody className="p-5">
                        <p className="mb-4">
                            {t('sections.dataSecurity.content.0')}
                        </p>
                        <p>
                            {t('sections.dataSecurity.content.1')}
                        </p>
                    </CardBody>
                </Card>

                <Card className="rounded-lg shadow-md overflow-hidden">
                    <CardHeader className="bg-gray-100 p-4">
                        <h2 className="text-xl font-bold">{t('sections.yourRights.title')}</h2>
                    </CardHeader>
                    <CardBody className="p-5">
                        <p className="mb-4">
                            {t('sections.yourRights.content.0')}
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            {t.raw('sections.yourRights.listItems').map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                        <p className="mt-4">
                            {t('sections.yourRights.additional')}
                        </p>
                    </CardBody>
                </Card>

                <Card className="rounded-lg shadow-md overflow-hidden">
                    <CardHeader className="bg-gray-100 p-4">
                        <h2 className="text-xl font-bold">{t('sections.cookiesAndTracking.title')}</h2>
                    </CardHeader>
                    <CardBody className="p-5">
                        <p className="mb-4">
                            {t('sections.cookiesAndTracking.content.0')}
                        </p>
                        <p className="mb-4">
                            {t('sections.cookiesAndTracking.content.1')}
                        </p>
                        <p>
                            {t('sections.cookiesAndTracking.content.2')}
                        </p>
                    </CardBody>
                </Card>

                <Card className="rounded-lg shadow-md overflow-hidden">
                    <CardHeader className="bg-gray-100 p-4">
                        <h2 className="text-xl font-bold">{t('sections.changes.title')}</h2>
                    </CardHeader>
                    <CardBody className="p-5">
                        <p className="mb-4">
                            {t('sections.changes.content.0')}
                        </p>
                        <p>
                            {t('sections.changes.content.1')}
                        </p>
                    </CardBody>
                </Card>
            </motion.div>

            <Divider className="my-8" />

            <motion.div 
                className="text-center text-gray-600"
                variants={itemVariants}
            >
                <p>{t('lastUpdated')}</p>
            </motion.div>
        </motion.div>
    );
}