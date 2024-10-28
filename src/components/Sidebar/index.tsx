'use client'

import Image from 'next/image';
import {usePathname} from 'next/navigation';
import MagiLogo from '@/../public/img//magi-min-logo.svg';
import styles from './Sidebar.module.sass';
import Angle from '@/../public/img//angle.svg';
import {ISidebar} from "@/interface/Sidebar.interface";
import {useContext, useEffect, useState} from "react";
import {GlobalStateContext} from "@/context/globalState";
import HomeLogo from '@/../public/img/home-icon.svg';
import CompaniesLogo from '@/../public/img/companies-icon.svg';
import UsersLogo from '@/../public/img/users-icon.svg';
import DeliveriesLogo from '@/../public/img/deliveries-icon.svg';
import MagiBigLogo from '@/../public/img/magi-big-logo.svg';
import {parseCookies} from "nookies";
import Link from "next/link";
import {IUser} from "@/interface/User.interface";
import ProductsIcon from "@/../public/img/product-icon.svg"


export default function Sidebar(){
    const { user_information } = parseCookies();
    const pathname = usePathname();
    const noSidebarRoutes = ["/"];
    const [userInformation, setUserInformation] = useState<IUser>();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error("Login must be used within a GlobalStateProvider");
    }

    const { text, language } = context;

    const menuItens: ISidebar[] = [
        {
            title: text?.[language].sidebar_home,
            icon: HomeLogo,
            allowed: [1, 2, 3],
            redirect: '/home'
        },
        {
            title: text?.[language].sidebar_companies,
            icon: CompaniesLogo,
            allowed: [1],
            redirect: '/companies'
        },
        {
            title: text?.[language].sidebar_users,
            icon: UsersLogo,
            allowed: [1],
            redirect: '/users'
        },
        {
            title: text?.[language].sidebar_deliveries,
            icon: DeliveriesLogo,
            allowed: [1, 2, 3],
            redirect: '/deliveries'
        },
        {
            title: text?.[language].sidebar_products,
            icon: ProductsIcon,
            allowed: [1, 2, 3],
            redirect: '/products'
        }
    ];

    useEffect(() => {
        user_information && setUserInformation(JSON.parse(user_information))
    }, [user_information]);

    return(
        !noSidebarRoutes.includes(pathname) ? (
            <aside className={`${styles.container} ${sidebarOpen ? styles['container--open'] : ''}`}>
                <div className={styles.container__image}>
                    <Image
                        src={sidebarOpen ? MagiBigLogo : MagiLogo}
                        alt="MAGI Logo"
                        priority={true}
                        width={sidebarOpen ? 220 : 54}
                        height={sidebarOpen ? 220 : 54}
                    />
                    <div
                        style={sidebarOpen ? { left: '18rem' } : { left: '4.5rem' }}
                        className={`${styles.container__image_arrow} ${sidebarOpen ? styles['container__image_arrow--rotated'] : ''}`}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <Image
                            src={Angle}
                            alt="Abrir ou fechar"
                            priority={true}
                            width={18}
                            height={18}
                            className={styles.container__image_arrow_img}
                        />
                    </div>
                </div>
                <div className={styles.container__menu}>
                    {
                        menuItens.map((element: ISidebar, index: number) => userInformation && element.allowed.includes(userInformation?.type) && (
                            <Link
                                href={element.redirect}
                                prefetch={true}
                                key={element.title + index}
                                className={styles.container__menu_line}
                                style={{
                                  backgroundColor: pathname === element.redirect ? "rgba(206, 255, 226, 0.37)" : "",
                                  justifyContent: sidebarOpen ? "space-evenly" : "center"
                                }}
                            >
                                <div className={styles.container__menu_line_common} style={pathname === element.redirect ? {backgroundColor: "#22BF87"} : {}}>
                                    <Image
                                        src={element.icon}
                                        alt={element.title || 'Ícone de menu'}
                                        width={34}
                                        height={34}
                                        priority={true}
                                    />
                                </div>
                                {
                                    sidebarOpen && (
                                        <div className={styles.container__menu_line_title}>
                                            <span>{element.title}</span>
                                        </div>
                                    )
                                }
                            </Link>
                        ))
                    }
                </div>
            </aside>
        ) : null
    );
}