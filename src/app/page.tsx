'use client'

import styles from './styles/Page.module.sass';
import Image from 'next/image';
import MagiLogo from '../../public/magi-logo-c-blue.svg';
import UserIcon from '../../public/user-icon.svg';
import PasswordIcon from '../../public/password-icon.svg';
import Title from "@/app/components/title";
import SelectButton from "@/app/components/selectButton";
import InputText from "@/app/components/inputText";
import {useContext, useState} from "react";
import {GlobalStateContext} from "@/app/context/globalState";
import Button from "@/app/components/button";
import {http} from "@/app/environment/environment";
import {Alert, AlertTitle} from "@mui/material";
import { setCookie } from 'nookies';
import { useRouter } from "next/navigation"; // Importar corretamente para Next.js 13

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
