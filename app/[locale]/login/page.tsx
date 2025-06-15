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
import {useTranslations} from "next-intl";

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
  const [passInvalida, setPassInvalida] = useState(false);
  const [errore, setErrore] = useState(false);
  const [login, setLogin] = useState(false);
  const locale = useTranslations('loginPage');
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
        fetch("http://141.144.245.5:8080/registrazione", {
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
        fetch("http://141.144.245.5:8080/accessoGoogle", {
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
        fetch("http://141.144.245.5:8080/login", {
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
        {!login ? locale('register') : locale('login')}
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
          label={locale("email.label")}
          placeholder={locale("email.placeholder")}
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
          label={locale("password.label")}
          placeholder={locale("password.placeholder")}
          isInvalid={passInvalida}
          errorMessage={locale("password.invalid")}
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
          label={locale("password.confirm.label")}
          placeholder={locale("password.confirm.placeholder")}
          isInvalid={passInvalida}
          errorMessage={locale("password.confirm.notMatching")}
          radius="lg"
          startContent={<Key />}
          type="password"
          validate={() => {
            if (passwordConferma !== password) {
              return locale("password.confirm.notMatching");
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
          label={locale("personalInfo.firstName.label")}
          placeholder={locale("personalInfo.firstName.placeholder")}
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
          label={locale("personalInfo.lastName.label")}
          placeholder={locale("personalInfo.lastName.placeholder")}
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
          label={locale("personalInfo.birthDate")}
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
            {locale("termsAndConditions.agreement") + " "}
          <Link color="foreground" href="#" size="sm">
              {locale("termsAndConditions.termsLink")}
          </Link>
        </Checkbox>
        <Button
          className=" bg-foreground/10 dark:bg-foreground/20"
          radius="lg"
          startContent={<SignIn />}
          type="submit"
        >
            {locale("buttons.register")}
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
          label={locale("email.label")}
          placeholder={locale("email.placeholder")}
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
          label={locale("password.label")}
          placeholder={locale("password.placeholder")}
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
          {locale("buttons.login")}
        </Button>
      </form>
      <div className="flex items-center gap-4 py-2">
        <Divider className="flex-1" />
        <p className="shrink-0 text-sm text-default-600">{locale("divider")}</p>
        <Divider className="flex-1" />
      </div>
      <div className="flex flex-col gap-2">
        <GoogleLogin
            onSuccess={accessoGoogle}
        onError={() => console.log("failed to login")}/>
      </div>
      <p className="text-center text-small text-foreground/50">
        {!login ? locale("accountQuestion.haveAccount") : locale("accountQuestion.noAccount")}{" "}
        <Link color="foreground" size="sm" onPress={() => setLogin(!login)}>
          {!login ? locale("accountAction.login") : locale("accountAction.register")}
        </Link>
      </p>
      <p className={!errore ? "hidden" : "text-center bg-red-300 text-red-700 rounded-xl p-2"}>
        {locale("errors.general")}
      </p>
    </div>
  );
}
