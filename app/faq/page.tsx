"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Divider } from "@heroui/divider";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
    const [selected, setSelected] = useState("general");

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
                    Domande Frequenti
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
                                Domande Generali
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
                                Biglietti e Prenotazioni
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
                                Informazioni di Viaggio
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
                                Servizi e Strutture
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
                                        question="Che cos'è Trainsoup?" 
                                        answer="Trainsoup è una piattaforma online per prenotare biglietti ferroviari, trovare orari dei treni e ottenere informazioni sui viaggi in treno in tutto il paese. Il nostro obiettivo è rendere il viaggio in treno più facile e accessibile per tutti."
                                        index={0}
                                    />
                                    <FAQItem 
                                        question="Come posso contattare il servizio clienti?" 
                                        answer="Puoi raggiungere il nostro team di assistenza clienti inviandoci un'email a supporto@trainsoup.com. Il nostro servizio clienti è disponibile dal lunedì al venerdì, dalle 9:00 alle 17:00."
                                        index={1}
                                    />
                                    <FAQItem 
                                        question="Esiste un'app mobile Trainsoup?" 
                                        answer="Al momento, non esiste ancora nessuna app per i dispositivi mobili."
                                        index={2}
                                    />
                                    <FAQItem 
                                        question="Come creo un account?" 
                                        answer="Clicca sul pulsante 'Login' nell'angolo in alto a destra della pagina, quindi seleziona 'Crea un account'. Inserisci i tuoi dati inclusi nome, email e password, e sei pronto!"
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
                                        question="Come prenoto un biglietto?" 
                                        answer="Puoi prenotare un biglietto utilizzando la funzione 'Cerca biglietto' sulla nostra homepage. Inserisci le stazioni di partenza e arrivo, la data e l'ora desiderate, e segui le istruzioni per completare la prenotazione."
                                        index={0}
                                    />
                                    <FAQItem 
                                        question="Posso annullare il mio biglietto?" 
                                        answer="Sì, i biglietti possono essere annullati fino a 24 ore prima della partenza. Vai sul tuo account, trova la prenotazione e seleziona 'Annulla biglietto'."
                                        index={1}
                                    />
                                    <FAQItem 
                                        question="Come ricevo il mio biglietto?" 
                                        answer="Dopo la prenotazione, il tuo biglietto sarà disponibile in formato elettronico nel tuo account. Puoi scegliere di stamparlo o mostrare il biglietto elettronico sul tuo dispositivo mobile."
                                        index={2}
                                    />
                                    <FAQItem 
                                        question="Sono disponibili sconti?" 
                                        answer="Sì, offriamo vari sconti per studenti, anziani, famiglie e viaggiatori frequenti. Controlla la sezione 'Sconti' durante la prenotazione del biglietto per vedere le opzioni disponibili."
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
                                        question="Con quanto anticipo devo arrivare in stazione?" 
                                        answer="Consigliamo di arrivare almeno 15-20 minuti prima della partenza."
                                        index={0}
                                    />
                                    <FAQItem 
                                        question="Posso portare bagagli sul treno?" 
                                        answer="Sì, i passeggeri possono portare bagagli a bordo. La maggior parte dei treni ha portabagagli sopraelevati per oggetti più piccoli e aree dedicate per bagagli più grandi. Potrebbero esserci restrizioni su dimensioni e quantità per alcuni tipi di treno."
                                        index={1}
                                    />
                                    <FAQItem 
                                        question="Gli animali domestici sono ammessi sui treni?" 
                                        answer="I piccoli animali domestici in trasportini appropriati sono generalmente ammessi sulla maggior parte dei treni. I cani più grandi potrebbero richiedere un biglietto e una museruola. Gli animali di servizio sono sempre ammessi. Controlla le regole specifiche al momento della prenotazione."
                                        index={2}
                                    />
                                    <FAQItem 
                                        question="Cosa succede se il mio treno è in ritardo o cancellato?" 
                                        answer="In caso di ritardi o cancellazioni, hai diritto a un risarcimento a seconda della durata del ritardo e del motivo."
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
                                        question="C'è il Wi-Fi sui treni?" 
                                        answer="Molti dei nostri treni ad alta velocità e intercity offrono Wi-Fi gratuito. La disponibilità è indicata al momento della prenotazione e sui display informativi dei treni nelle stazioni."
                                        index={0}
                                    />
                                    <FAQItem 
                                        question="Ci sono cibo e bevande disponibili a bordo?" 
                                        answer="I treni a lunga percorrenza e ad alta velocità hanno tipicamente un bar o una carrozza ristorante che offre snack, pasti e bevande. Alcuni servizi premium includono rinfreschi gratuiti."
                                        index={1}
                                    />
                                    <FAQItem 
                                        question="Esiste l'accessibilità per passeggeri a mobilità ridotta?" 
                                        answer="Sì, ci impegniamo a rendere il viaggio in treno accessibile a tutti. La maggior parte delle stazioni e dei treni moderni dispone di strutture per passeggeri a mobilità ridotta. Puoi richiedere assistenza speciale al momento della prenotazione."
                                        index={2}
                                    />
                                    <FAQItem 
                                        question="Ci sono prese di corrente sui treni?" 
                                        answer="La maggior parte dei treni ad alta velocità e a lunga percorrenza è dotata di prese di corrente ai posti. Queste informazioni sono disponibili quando si controllano i dettagli del treno durante la prenotazione."
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
                    <p>Per ulteriori domande, contatta il nostro servizio clienti</p>
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