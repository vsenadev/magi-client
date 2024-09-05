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

export default function Login() {
    const [adminAccount, setAdminAccount] = useState<boolean>(false);

    const context = useContext(GlobalStateContext);
     if (!context) {
        throw new Error("Title must be used within a GlobalStateProvider");
    }

    const { user, setUser, password, setPassword, text, language } = context;

     async function handleSubmit() {

     }

    return (
        <section className={styles.container}>
            <div className={styles.container_image}>
                <Image
                    src={MagiLogo}
                    alt="Magi Logo"
                    priority={true}
                />
            </div>
            <div className={styles.container__box}>
                <Title content={text?.[language].login_login}/>
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
                    content={text?.[language].login_enter}
                    function={handleSubmit()}
                />
            </div>
        </section>
    );
}
