"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Divider } from "@heroui/divider";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

export default function FAQ() {
    const [selected, setSelected] = useState("general");
    const t = useTranslations('faqPage');

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
    
    const tabContentVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.4 }
        },
        exit: { 
            opacity: 0, 
            x: 20,
            transition: { duration: 0.2 }
        }
    };

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

                <Tabs
                    aria-label="Categorie FAQ"
                    selectedKey={selected}
                    onSelectionChange={(key) => {
                        setSelected(key.toString())
                    }}
                    className="w-full"
                    variant="underlined"
                >
                    <Tab
                        key="general"
                        title={
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={selected === "general" ? "text-black" : "text-gray-700"}
                            >
                                {t('tabs.general')}
                            </motion.span>
                        }
                        className={`text-base font-medium px-4 py-2`}
                    />
                    <Tab
                        key="tickets"
                        title={
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={selected === "tickets" ? "text-black" : "text-gray-700"}

                            >
                                {t('tabs.tickets')}
                            </motion.span>
                        }
                        className={`text-base font-medium px-4 py-2`}
                    />
                    <Tab
                        key="travel"
                        title={
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={selected === "travel" ? "text-black" : "text-gray-700"}
                            >
                                {t('tabs.travel')}
                            </motion.span>
                        }
                        className={"text-base font-medium px-4 py-2"}
                    />
                    <Tab
                        key="services"
                        title={
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={selected === "services" ? "text-black" : "text-gray-700"}
                            >
                                {t('tabs.services')}
                            </motion.span>
                        }
                        className={`text-base font-medium px-4 py-2`}
                    />
                </Tabs>
                
                <motion.div 
                    className="rounded-xl shadow-lg p-6 pt-0 mb-10"
                    variants={itemVariants}
                >
                    <motion.div 
                        className="flex justify-center mb-8"
                        variants={itemVariants}
                    >
                    </motion.div>
                    
                    <motion.div 
                        className="relative overflow-hidden"
                        variants={itemVariants}
                    >
                        <AnimatePresence mode="wait">
                            {selected === "general" && (
                                <motion.div 
                                    key="general"
                                    className="space-y-4"
                                    variants={tabContentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <FAQItem 
                                        question={t('general.whatIsTrainsoup.question')} 
                                        answer={t('general.whatIsTrainsoup.answer')}
                                        index={0}
                                    />
                                    <FAQItem 
                                        question={t('general.contactCustomerService.question')} 
                                        answer={t('general.contactCustomerService.answer')}
                                        index={1}
                                    />
                                    <FAQItem 
                                        question={t('general.mobileApp.question')} 
                                        answer={t('general.mobileApp.answer')}
                                        index={2}
                                    />
                                    <FAQItem 
                                        question={t('general.createAccount.question')} 
                                        answer={t('general.createAccount.answer')}
                                        index={3}
                                    />
                                </motion.div>
                            )}

                            {selected === "tickets" && (
                                <motion.div 
                                    key="tickets"
                                    className="space-y-4"
                                    variants={tabContentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <FAQItem 
                                        question={t('tickets.bookTicket.question')} 
                                        answer={t('tickets.bookTicket.answer')}
                                        index={0}
                                    />
                                    <FAQItem 
                                        question={t('tickets.cancelTicket.question')} 
                                        answer={t('tickets.cancelTicket.answer')}
                                        index={1}
                                    />
                                    <FAQItem 
                                        question={t('tickets.receiveTicket.question')} 
                                        answer={t('tickets.receiveTicket.answer')}
                                        index={2}
                                    />
                                    <FAQItem 
                                        question={t('tickets.discounts.question')} 
                                        answer={t('tickets.discounts.answer')}
                                        index={3}
                                    />
                                </motion.div>
                            )}

                            {selected === "travel" && (
                                <motion.div 
                                    key="travel"
                                    className="space-y-4"
                                    variants={tabContentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <FAQItem 
                                        question={t('travel.arrivalTime.question')} 
                                        answer={t('travel.arrivalTime.answer')}
                                        index={0}
                                    />
                                    <FAQItem 
                                        question={t('travel.luggage.question')} 
                                        answer={t('travel.luggage.answer')}
                                        index={1}
                                    />
                                    <FAQItem 
                                        question={t('travel.pets.question')} 
                                        answer={t('travel.pets.answer')}
                                        index={2}
                                    />
                                    <FAQItem 
                                        question={t('travel.delays.question')} 
                                        answer={t('travel.delays.answer')}
                                        index={3}
                                    />
                                </motion.div>
                            )}

                            {selected === "services" && (
                                <motion.div 
                                    key="services"
                                    className="space-y-4"
                                    variants={tabContentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <FAQItem 
                                        question={t('services.wifi.question')} 
                                        answer={t('services.wifi.answer')}
                                        index={0}
                                    />
                                    <FAQItem 
                                        question={t('services.food.question')} 
                                        answer={t('services.food.answer')}
                                        index={1}
                                    />
                                    <FAQItem 
                                        question={t('services.accessibility.question')} 
                                        answer={t('services.accessibility.answer')}
                                        index={2}
                                    />
                                    <FAQItem 
                                        question={t('services.powerOutlets.question')} 
                                        answer={t('services.powerOutlets.answer')}
                                        index={3}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
                
                <motion.div
                    className="text-center text-default-800 opacity-80 mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    <p>{t('contact')}</p>
                </motion.div>
            </motion.div>
    );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
    const [isOpen, setIsOpen] = useState(false);
    
    // Animation delay based on index
    const delay = index * 0.1;
    
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1,
            y: 0,
            transition: { 
                delay,
                duration: 0.4,
                type: "spring", 
                stiffness: 100 
            }
        }
    };
    
    const iconVariants = {
        closed: { rotate: 0 },
        open: { rotate: 180 }
    };
    
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
        >
            <Card className="w-full shadow-sm overflow-hidden">
                <CardHeader
                    className="flex justify-between items-center cursor-pointer bg-gradient-to-r from-white to-red-50 rounded-t-lg p-4"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <motion.h3
                        className="text-lg font-semibold text-red-800"
                        layout
                    >
                        {question}
                    </motion.h3>
                    <motion.div
                        animate={isOpen ? "open" : "closed"}
                        variants={iconVariants}
                        transition={{ duration: 0.3 }}
                        className="bg-red-100 text-red-700 w-7 h-7 rounded-full flex items-center justify-center"
                    >
                        <span className="text-xl transform transition-transform">+</span>
                    </motion.div>
                </CardHeader>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ 
                                height: "auto", 
                                opacity: 1,
                                transition: { 
                                    height: { duration: 0.3 },
                                    opacity: { duration: 0.3, delay: 0.1 }
                                }
                            }}
                            exit={{ 
                                height: 0, 
                                opacity: 0,
                                transition: { 
                                    height: { duration: 0.3 },
                                    opacity: { duration: 0.2 }
                                }
                            }}
                        >
                            <Divider className="border-red-100" />
                            <CardBody className="bg-white p-4">
                                <motion.p 
                                    className="text-gray-700 leading-relaxed"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ 
                                        y: 0, 
                                        opacity: 1,
                                        transition: { duration: 0.3, delay: 0.1 }
                                    }}
                                >
                                    {answer}
                                </motion.p>
                            </CardBody>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
}