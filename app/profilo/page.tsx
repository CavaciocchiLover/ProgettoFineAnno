"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
import { Tabs, Tab } from "@heroui/tabs";
import { User, Ticket, PencilSimple, Check, X, Key, Warning } from "@phosphor-icons/react";
import Image from "next/image";
import QRCode from "react-qr-code";
import { Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, useDisclosure } from "@heroui/modal";
import {DateInput} from "@heroui/date-input";
import {DateValue, getLocalTimeZone, parseDate} from "@internationalized/date";
import {I18nProvider, useDateFormatter} from "@react-aria/i18n";
import {zxcvbn} from "@zxcvbn-ts/core";

// Types
type UserProfile = {
    nome: string;
    cognome: string;
    email: string;
    data_nascita: DateValue;
};

type PasswordData = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

type TicketData = {
    id: string;
    partenza: string;
    arrivo: string;
    data_partenza: string;
    nominativo: string;
    costo: number;
    data_acquisto: string;
    qrcode: string;
};

export default function ProfiloPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [tempProfile, setTempProfile] = useState<UserProfile | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [passwordData, setPasswordData] = useState<PasswordData>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { 
        isOpen: isPasswordModalOpen, 
        onOpen: onPasswordModalOpen, 
        onOpenChange: onPasswordModalOpenChange 
    } = useDisclosure();
    const { 
        isOpen: isDeleteModalOpen, 
        onOpen: onDeleteModalOpen, 
        onOpenChange: onDeleteModalOpenChange 
    } = useDisclosure();

    const formatter = useDateFormatter({dateStyle: "full"});

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/login");
            return;
        }

        fetch("http://localhost:8080/info", {
            method: "GET",
            headers: {"Authorization": token}
        })
            .then((resp) => {
                if (resp.ok) {
                    resp.json()
                        .then((dati) => {
                            const profilo = {
                                nome: dati["nome"],
                                cognome:dati["cognome"],
                                email: dati["email"],
                                data_nascita: parseDate(dati["data_nascita"])
                            };
                            setProfile(profilo);
                            setTempProfile(profilo);
                            setLoading(false);
                        })
                        .catch((e) => {
                            console.error(e);
                        })
                } else {
                    console.error(resp.status)
                }
            })
            .catch((e) => {
                console.error(e);
            })
        
        fetchUserTickets(token);
    }, [router]);

    const fetchUserTickets = (token: string) => {
        setTimeout(() => {
            const mockTickets = [
                {
                    id: "TKT-123456",
                    partenza: "Milano",
                    arrivo: "Roma",
                    data_partenza: "2025-05-20T10:30:00",
                    nominativo: "Mario Rossi",
                    costo: 45.50,
                    data_acquisto: "2025-05-10T14:23:45",
                    qrcode: "TICKET-123456-MILANO-ROMA"
                },
                {
                    id: "TKT-789012",
                    partenza: "Roma",
                    arrivo: "Napoli",
                    data_partenza: "2025-06-15T08:15:00",
                    nominativo: "Mario Rossi",
                    costo: 35.00,
                    data_acquisto: "2025-05-12T09:17:30",
                    qrcode: "TICKET-789012-ROMA-NAPOLI"
                }
            ];
            setTickets(mockTickets);
        }, 700);
    };

    const handleEditProfile = () => {
        setEditMode(true);
    };

    const handleSaveProfile = () => {
        // In a real app, make API call to save profile
        setProfile(tempProfile);
        setEditMode(false);
    };

    const handleCancelEdit = () => {
        setTempProfile(profile);
        setEditMode(false);
    };

    const handleInputChange = (field: keyof UserProfile, value: string) => {
        if (tempProfile) {
            setTempProfile({
                ...tempProfile,
                [field]: value
            });
        }
    };
    
    const handlePasswordChange = (field: keyof PasswordData, value: string) => {
        setPasswordData({
            ...passwordData,
            [field]: value
        });
    };

    const handleViewTicket = (ticket: TicketData) => {
        setSelectedTicket(ticket);
        onOpen();
    };
    
    const handleTabChange = (key: React.Key) => {
        setActiveTab(key.toString());
    };

    function cambioPassword() {
        setPasswordError("");
        setPasswordSuccess(false);

        if (passwordData.newPassword.length < 8) {
            setPasswordError("La nuova password deve essere di almeno 8 caratteri");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("Le password non coincidono");
            return;
        }

        if (zxcvbn(passwordData.newPassword as string).score < 3) {
            setPasswordError("La password non è abbastanza sicura");
            return;
        }

        const token = Cookies.get("token");
        if (!token) return;

        fetch("http://localhost:8080/info", {
            method: "PUT",
            headers: {
                "Authorization": token,
            },
            body: JSON.stringify({
                "password_vecchia" : passwordData.currentPassword,
                "password_nuova": passwordData.newPassword,
            })
        }).then((resp) => {
            if (resp.status === 200) {
                setPasswordSuccess(true);
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            } else {
                setPasswordError("La password attuale non è corretta")
            }
        })
            .catch(() => {
                setPasswordError("Si è verificato un errore")
            })
    }
    const handleDeleteAccount = () => {
        // In a real app, make API call to delete account
        const token = Cookies.get("token");
        if (!token) return;
        
        // Simulating API call for now
        setTimeout(() => {
            // Clear cookies and redirect to home
            Cookies.remove("token");
            router.push("/");
            
            // In a real app, you would make a fetch call like:
            /*
            fetch("http://localhost:8080/deleteAccount", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token
                })
            })
            .then(res => {
                if (res.status === 200) {
                    Cookies.remove("token");
                    router.push("/");
                } else {
                    // Handle error
                }
            })
            .catch(() => {
                // Handle error
            });
            */
        }, 1000);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Caricamento...</p>
            </div>
        );
    }

    return (
        <div className="light flex flex-col lg:flex-row w-full gap-4">
            {/* Left sidebar for navigation */}
            <div className="w-full lg:w-1/4">
                <Card className="sticky top-4">
                    <CardHeader className="flex gap-2">
                        <User size={24} />
                        <div className="flex flex-col">
                            <p className="text-md font-semibold">{profile?.nome} {profile?.cognome}</p>
                            <p className="text-small text-default-500">{profile?.email}</p>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Tabs 
                            aria-label="Profile sections" 
                            color="warning" 
                            variant="underlined" 
                            className="w-full"
                            selectedKey={activeTab}
                            onSelectionChange={handleTabChange}
                        >
                            <Tab key="profile" title="Profilo" />
                            <Tab key="tickets" title={`Biglietti (${tickets.length})`} />
                        </Tabs>
                    </CardBody>
                </Card>
            </div>

            {/* Main content area */}
            <div className="w-full lg:w-3/4">
                {activeTab === "profile" && (
                    <>
                        {/* Profile card */}
                        <Card className="mb-4">
                            <CardHeader className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Informazioni Personali</h2>
                                {!editMode ? (
                                    <Button 
                                        isIconOnly 
                                        color="warning" 
                                        variant="light" 
                                        onClick={handleEditProfile}
                                    >
                                        <PencilSimple size={20} />
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button 
                                            isIconOnly 
                                            color="success" 
                                            variant="light" 
                                            onClick={handleSaveProfile}
                                        >
                                            <Check size={20} />
                                        </Button>
                                        <Button 
                                            isIconOnly 
                                            color="danger" 
                                            variant="light" 
                                            onClick={handleCancelEdit}
                                        >
                                            <X size={20} />
                                        </Button>
                                    </div>
                                )}
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <p className="text-small text-default-500">Nome</p>
                                        {editMode ? (
                                            <Input 
                                                value={tempProfile?.nome}
                                                onChange={(e) => handleInputChange('nome', e.target.value)}
                                                className="max-w-md"
                                            />
                                        ) : (
                                            <p>{profile?.nome}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-small text-default-500">Cognome</p>
                                        {editMode ? (
                                            <Input 
                                                value={tempProfile?.cognome}
                                                onChange={(e) => handleInputChange('cognome', e.target.value)}
                                                className="max-w-md"
                                            />
                                        ) : (
                                            <p>{profile?.cognome}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-small text-default-500">Email</p>
                                        {editMode ? (
                                            <Input 
                                                value={tempProfile?.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="max-w-md"
                                                type="email"
                                            />
                                        ) : (
                                            <p>{profile?.email}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-small text-default-500">Data di nascita</p>
                                        {editMode ? (
                                                <DateInput
                                                    granularity="day"
                                                    value={tempProfile?.data_nascita}
                                                    onChange={(e) => handleInputChange('data_nascita', e!.toString())}
                                                    className="max-w-md"
                                                />
                                        ) : (
                                            <p>{formatter.format(tempProfile!.data_nascita.toDate(getLocalTimeZone())) || 'Non impostato'}</p>
                                        )}
                                    </div>
                                </div>
                            </CardBody>
                            <CardFooter>
                                <div className="flex flex-col w-full gap-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <Key size={20} />
                                            <span>Password</span>
                                        </div>
                                        <p className="text-small text-default-500">Modifica la tua password per mantenere il tuo account sicuro</p>
                                        <Button 
                                            color="warning" 
                                            variant="flat" 
                                            className="mt-2 max-w-xs"
                                            onPress={() => onPasswordModalOpen}
                                        >
                                            Modifica Password
                                        </Button>
                                    </div>
                                    
                                    {/* Account deletion section */}
                                    <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                                        <div className="flex items-center gap-2">
                                            <Warning size={20} className="text-danger" />
                                            <span className="text-danger">Zona pericolosa</span>
                                        </div>
                                        <p className="text-small text-default-500">L'eliminazione dell'account è permanente e non può essere annullata.</p>
                                        <Button 
                                            color="danger" 
                                            variant="flat" 
                                            className="mt-2 max-w-xs"
                                            onClick={onDeleteModalOpen}
                                        >
                                            Elimina Account
                                        </Button>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </>
                )}
                
                {activeTab === "tickets" && (
                    <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">I miei Biglietti</h2>
                    </CardHeader>
                    <CardBody>
                        {tickets.length === 0 ? (
                            <div className="text-center p-8">
                                <Ticket size={48} className="mx-auto mb-2 text-gray-400" />
                                <p className="text-gray-500">Non hai ancora acquistato nessun biglietto</p>
                                <Button 
                                    color="warning" 
                                    className="mt-4"
                                    href="/"
                                >
                                    Cerca un Biglietto
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {tickets.map((ticket) => (
                                    <div 
                                        key={ticket.id} 
                                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleViewTicket(ticket)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium">{ticket.partenza} → {ticket.arrivo}</h3>
                                                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                                                        {new Date(ticket.data_partenza) > new Date() ? 'Attivo' : 'Utilizzato'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {ticket.data_partenza}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Acquistato il {ticket.data_acquisto}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{ticket.costo.toFixed(2)} €</p>
                                                <p className="text-xs text-gray-500">{ticket.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardBody>
                    </Card>
                )}
            </div>

            {/* Ticket details modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
                <ModalContent>
                    {(onClose: () => void) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Dettagli Biglietto
                            </ModalHeader>
                            <ModalBody className="pb-6">
                                {selectedTicket && (
                                    <div className="space-y-4">
                                        <div className="flex justify-center bg-gray-50 p-4 rounded">
                                            <QRCode value={selectedTicket.qrcode} size={180} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-center">
                                                {selectedTicket.partenza} → {selectedTicket.arrivo}
                                            </h3>
                                            <p className="text-center text-gray-600">
                                                {selectedTicket.data_partenza}
                                            </p>
                                        </div>
                                        <Divider />
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Biglietto №</span>
                                                <span>{selectedTicket.id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Passeggero</span>
                                                <span>{selectedTicket.nominativo}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Prezzo</span>
                                                <span>{selectedTicket.costo.toFixed(2)} €</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Data acquisto</span>
                                                <span>{selectedTicket.data_acquisto}</span>
                                            </div>
                                        </div>
                                        <Button 
                                            color="warning" 
                                            className="w-full mt-2"
                                            onClick={onClose}
                                        >
                                            Chiudi
                                        </Button>
                                    </div>
                                )}
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
            
            {/* Password change modal */}
            <Modal isOpen={isPasswordModalOpen} onOpenChange={onPasswordModalOpenChange}>
                <ModalContent>
                    {(onClose: () => void) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Modifica Password
                            </ModalHeader>
                            <ModalBody>
                                <div className="space-y-4">
                                    {passwordError && (
                                        <div className="p-2 bg-danger-50 text-danger border border-danger-200 rounded-md">
                                            {passwordError}
                                        </div>
                                    )}
                                    {passwordSuccess && (
                                        <div className="p-2 bg-success-50 text-success border border-success-200 rounded-md">
                                            Password aggiornata con successo!
                                        </div>
                                    )}
                                    <Input
                                        type="password"
                                        label="Password attuale"
                                        placeholder="Inserisci la tua password attuale"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                    />
                                    <Input
                                        type="password"
                                        label="Nuova password"
                                        placeholder="Inserisci la nuova password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                    />
                                    <Input
                                        type="password"
                                        label="Conferma password"
                                        placeholder="Conferma la nuova password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={() => onClose}>
                                    Annulla
                                </Button>
                                <Button color="warning" onPress={() => cambioPassword}>
                                    Aggiorna Password
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            
            {/* Delete account confirmation modal */}
            <Modal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalOpenChange}>
                <ModalContent>
                    {(onClose: () => void) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-danger">
                                Conferma eliminazione account
                            </ModalHeader>
                            <ModalBody>
                                <div className="space-y-4">
                                    <div className="p-3 bg-danger-50 text-danger border border-danger-200 rounded-md flex items-start gap-2">
                                        <Warning size={24} />
                                        <div>
                                            <p className="font-medium">Questa azione è irreversibile</p>
                                            <p className="text-sm">Tutti i tuoi dati personali e i tuoi biglietti verranno eliminati permanentemente.</p>
                                        </div>
                                    </div>
                                    <p>Sei sicuro di voler eliminare il tuo account?</p>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onClick={onClose}>
                                    Annulla
                                </Button>
                                <Button color="danger" onClick={handleDeleteAccount}>
                                    Elimina Account
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}