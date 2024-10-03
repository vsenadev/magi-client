'use client'

import styles from '@/styles/Page.module.sass';
import Image from 'next/image';
import MagiLogo from '@/../public/img/magi-logo-c-blue.svg';
import UserIcon from '@/../public/img/user-icon.svg';
import PasswordIcon from '@/../public/img/password-icon.svg';
import Title from "@/components/Title";
import SelectButton from "@/components/SelectButton";
import InputText from "@/components/InputText";
import {useContext, useEffect, useState} from "react";
import {GlobalStateContext} from "@/context/globalState";
import Button from "@/components/Button";
import {http} from "@/environment/environment";
import {Alert, AlertTitle} from "@mui/material";
import {parseCookies, setCookie} from 'nookies';
import { useRouter } from "next/navigation";
import {AxiosResponse} from "axios";

export default function Login() {
    const [adminAccount, setAdminAccount] = useState<boolean>(false);
    const [modalAlert, setModalAlert] = useState<boolean>(false);
    const [modalType, setModalType] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error("Login must be used within a GlobalStateProvider");
    }

    const { user, setUser, password, setPassword, text, language } = context;

    function saveUserInformationAndRedirect(userInformation:AxiosResponse) {
        setCookie(null, 'user_information', JSON.stringify(userInformation?.data), {
            maxAge: 5 * 24 * 60 * 60,
            path: '/',
            secure: process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging',
            sameSite: 'strict',
        });

        router.push('/home');
    }

    async function handleSubmit() {
        setIsLoading(true);
        try {
            const res = await http.post('v1/login', {
              email: user,
              password: password,
              type: adminAccount,
            });

            if (!res.data.status) {
                setModalType(true);
                setModalMessage(res.data.message.toUpperCase());
            } else {
                setCookie(null, 'jwt_token', res.data?.message?.token, {
                  maxAge: 5 * 24 * 60 * 60,
                  path: '/',
                  secure: process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging',
                  sameSite: 'strict',
                });

                http.get('v1/login')
                .then(userInformation => {
                    saveUserInformationAndRedirect(userInformation)
                })
                .catch(() => {
                    setModalAlert(true);
                    setModalMessage(text?.[language].login_token);
                });

                router.push('/home');
            }
        } catch (error: any) {
            setModalAlert(true);
            const errorMessage = error.response?.data?.message
              ? error.response.data.message.toUpperCase()
              : 'Ocorreu um erro inesperado. Por favor, tente novamente.';

            setModalMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const { jwt_token } = parseCookies();

        if (jwt_token){
            http.get('v1/login')
                .then(userInformation => {
                    saveUserInformationAndRedirect(userInformation)
                })
                .catch(() => {
                    setModalAlert(true);
                    setModalMessage(text?.[language].login_token);
                });
        }
    }, []);

    return (
        <section className={styles.container}>
            {modalAlert && (
                <div className={styles.container__modal}>
                    <Alert severity="error">
                        <AlertTitle>ERRO</AlertTitle>
                        {modalMessage}
                    </Alert>
                </div>
            )}
            {modalType && (
                <div className={styles.container__modal}>
                    <Alert severity="warning">
                        <AlertTitle>AVISO</AlertTitle>
                        {modalMessage}
                    </Alert>
                </div>
            )}
            <div className={styles.container_image}>
                <Image
                    src={MagiLogo}
                    alt="Magi Logo"
                    priority={true}
                />
            </div>
            <div className={styles.container__box}>
                <Title content={text?.[language].login_login} />
                <div className={styles.container__box_select}>
                    <SelectButton
                        firstOption={text?.[language].login_administrator}
                        lastOption={text?.[language].login_common}
                        type={adminAccount}
                        state={setAdminAccount}
                    />
                </div>
                <div className={styles.container__box_input}>
                    <InputText
                        placeholder={text?.[language].login_user}
                        value={user}
                        state={setUser}
                        icon={UserIcon.src}
                        type='text'
                    />
                    <InputText
                        placeholder={text?.[language].login_password}
                        value={password}
                        state={setPassword}
                        icon={PasswordIcon.src}
                        type='password'
                    />
                </div>
                <div className={styles.container__forgot}>
                    <p className={styles.container__forgot_content}>{text?.[language].login_forget}</p>
                </div>
                <Button
                    content={isLoading ? <div className={styles.loader}></div> : text?.[language].login_enter}
                    function={handleSubmit}
                    disabled={isLoading}
                />
            </div>
        </section>
    );
}
