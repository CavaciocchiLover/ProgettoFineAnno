"use client";

import { Input } from "@heroui/input";
import {
  At,
  Key,
  IdentificationCard,
  SignIn,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Divider } from "@heroui/divider";
import { DateInput } from "@heroui/date-input";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import { Link } from "@heroui/link";
import {FormEvent, useState} from "react";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnItPackage from "@zxcvbn-ts/language-it";
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";

export default function LoginPage() {
  const oggi = today(getLocalTimeZone());
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordConferma, setPasswordConferma] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [dataNascita, setDataNascita] = useState(parseDate(oggi.toString()));
  const [segmentiRiempiti, setsegmentiRiempiti] = useState(0);
  const [colore, setColore] = useState("");
  const [emailInvalida, setEmailInvalida] = useState(false);
  const [passInvalida, setPassInvalida] = useState(false);
  const [errore, setErrore] = useState(false);
  const [login, setLogin] = useState(false);

  const router = useRouter();

  const config_zxcvbn = {
    translations: zxcvbnItPackage.translations,
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnItPackage.dictionary,
    },
  };

  zxcvbnOptions.setOptions(config_zxcvbn);
  const segments = 5;

  const getStrengthLabel = (strength: number) => {
    if (strength === 0) setColore("bg-gray-300");
    else if (strength < 0.5) setColore("bg-red-500");
    else if (strength < 0.75) setColore("bg-yellow-500");
    else if (strength < 1) setColore("bg-blue-500");
    else setColore("bg-green-500");
  };

  async function registrazione(e: FormEvent<HTMLFormElement>) {
    setErrore(false);
      e.preventDefault();
    let errori = 0;

    if (colore === "bg-gray-300" || colore === "bg-red-500") {
        setPassInvalida(true);
        errori += 1;
    } else {
        setPassInvalida(false);
    }

    if (errori !== 1) {
        fetch("http://localhost:8080/registrazione", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password,
                nome: nome,
                cognome: cognome,
                data: dataNascita.toString(),
            })
        }).then((resp) => {
            if (resp.status === 200) {
                resp.json()
                    .then(token => {
                        if (Cookies.get("token") !== "") {
                            Cookies.remove("token");
                        }
                        Cookies.set("token", token["token"]);
                        router.push('/');
                    })
            } else {
                setErrore(true);
            }
        })
            .catch(() => {
                setErrore(true);
            })
    }
  }

    async function accessoGoogle(jwt: CredentialResponse) {
        fetch("http://localhost:8080/accessoGoogle", {
            method: "POST",
            body: JSON.stringify({"token": jwt.credential})
        }).then((resp) => {
            if (resp.status === 200) {
                resp.json()
                    .then(token => {
                        if (Cookies.get("token") !== "") {
                            Cookies.remove("token");
                        }
                        Cookies.set("token", token["token"]);
                        router.push('/');
                    })
            } else {
                setErrore(true);
            }
        })
            .catch(() => {
                setErrore(true);
            })
    }

    async function Login(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setErrore(false);
        fetch("http://localhost:8080/login", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password,
            })
        }).then((resp) => {
            if (resp.status === 200) {
                resp.json()
                    .then(token => {
                        if (Cookies.get("token") !== "") {
                            Cookies.remove("token");
                        }
                        Cookies.set("token", token["token"]);
                        router.push('/');
                    })
            } else {
                setErrore(true);
            }
        })
            .catch(() => {
                setErrore(true);
            })
    }

    return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-background/60 px-8 pb-10 pt-6 shadow-small backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50">
      <p className="text-white pb-2 text-xl font-medium">
        {!login ? "Registrati" : "Login"}
      </p>
      <form
        className={!login ? "flex flex-col gap-3" : "hidden"}
        onSubmit={async (e) => registrazione(e)}
      >
        <Input
          autoComplete="new-password"
          isClearable
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          isRequired={true}
          label="Email"
          placeholder="Scrivi la tua email"
          radius="lg"
          startContent={<At />}
          value={email}
          onValueChange={setEmail}
          type="email"
        />
        <Input
          isClearable
          autoComplete="new-password"
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          isRequired={true}
          label="Password"
          placeholder="Scrivi la password"
          isInvalid={passInvalida}
          errorMessage="Password non valida"
          radius="lg"
          startContent={<Key />}
          type="password"
          value={password}
          onValueChange={(nuovo_password) => {
            setPassword(nuovo_password);
            let res = zxcvbn(nuovo_password);
            const punteggio = res.score / 4;

            setsegmentiRiempiti(Math.ceil(punteggio * segments));
            getStrengthLabel(punteggio);
          }}
        />
        <div className="flex w-full gap-1 h-2 px-2 pr-2">
          {[...Array(segments)].map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 rounded-full transition-all duration-300 ${i < segmentiRiempiti ? colore : "bg-gray-200"}`}
            />
          ))}
        </div>
        <Input
          isClearable
          autoComplete="new-password"
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          isRequired={true}
          label="Conferma password"
          placeholder="Riscrivi la password"
          isInvalid={passInvalida}
          errorMessage="Password non valida"
          radius="lg"
          startContent={<Key />}
          type="password"
          validate={() => {
            if (passwordConferma !== password) {
              return "Le password non sono uguali";
            }
          }}
          value={passwordConferma}
          onValueChange={setPasswordConferma}
        />
        <Input
          isClearable
          autoComplete="new-password"
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          isRequired={true}
          label="Nome"
          placeholder="Scrivi il tuo nome"
          radius="lg"
          startContent={<IdentificationCard />}
          value={nome}
          onValueChange={setNome}
        />
        <Input
          isClearable
          autoComplete="new-password"
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          isRequired={true}
          label="Cognome"
          placeholder="Scrivi il tuo cognome"
          radius="lg"
          startContent={<IdentificationCard />}
          value={cognome}
          onValueChange={setCognome}
        />

        <DateInput
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          isRequired={true}
          label="Data di nascita"
          value={dataNascita}
          //@ts-ignore
          onChange={setDataNascita}
        />
        <Checkbox
          classNames={{
            base: "py-4",
            label: "text-foreground/60",
            wrapper: "before:border-foreground/50",
          }}
          isRequired={true}
          size="sm"
        >
          Sono d'accordo con i{" "}
          <Link color="foreground" href="#" size="sm">
            Termini di servizio
          </Link>
        </Checkbox>
        <Button
          className=" bg-foreground/10 dark:bg-foreground/20"
          radius="lg"
          startContent={<SignIn />}
          type="submit"
        >
          Registrati
        </Button>
      </form>
      <form
        className={!login ? "hidden" : "flex flex-col gap-3"}
        onSubmit={async (e) => Login(e)}
      >
        <Input
          isClearable
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          isRequired={true}
          label="Email"
          placeholder="Scrivi la tua email"
          radius="lg"
          startContent={<At />}
          value={email}
          onValueChange={setEmail}
        />
        <Input
          isClearable
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          isRequired={true}
          label="Password"
          placeholder="Scrivi la password"
          radius="lg"
          startContent={<Key />}
          type="password"
          value={password}
          onValueChange={setPassword}
        />
        <Button
          className="bg-foreground/10 dark:bg-foreground/20"
          radius="lg"
          startContent={<SignIn />}
          type="submit"
        >
          Login
        </Button>
      </form>
      <div className="flex items-center gap-4 py-2">
        <Divider className="flex-1" />
        <p className="shrink-0 text-sm text-default-600">Oppure</p>
        <Divider className="flex-1" />
      </div>
      <div className="flex flex-col gap-2">
        <GoogleLogin
            onSuccess={accessoGoogle}
        onError={() => console.log("failed to login")}/>
      </div>
      <p className="text-center text-small text-foreground/50">
        {!login ? "Hai già un account?" : "Non hai ancora un account?"}{" "}
        <Link color="foreground" size="sm" onPress={() => setLogin(!login)}>
          {!login ? "Fai il login!" : "Registrati subito!"}
        </Link>
      </p>
      <p className={!errore ? "hidden" : "text-center bg-red-300 text-red-700 rounded-xl p-2"}>
        Si è verificato un errore.
      </p>
    </div>
  );
}
