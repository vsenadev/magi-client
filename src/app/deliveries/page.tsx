'use client'; // Certifica que o componente seja renderizado no cliente

import React, { useEffect, useState } from 'react';
import styles from '@/styles/Companies.module.sass';
import dynamic from 'next/dynamic';

// Carregando os componentes dinamicamente no cliente
const TabProducts = dynamic(() => import('@/app/deliveries/Tab'), { ssr: false });
const TableProducts = dynamic(() => import('@/app/deliveries/Table'), { ssr: false });

export default function Deliveries() {
    const [clientRendered, setClientRendered] = useState(false);

    useEffect(() => {
        // Garante que o código roda no cliente
        setClientRendered(true);
    }, []);

    if (!clientRendered) {
        // Opcional: pode adicionar um loader enquanto o componente não é renderizado no cliente
        return <div>Loading...</div>;
    }

    return (
        <section className={styles.container}>
            <section className={styles.container__content}>
                <div className={styles.container__content_title}>
                    <h1>Entregas</h1>
                </div>
                <div className={styles.container__content_tab}>
                    <TabProducts />
                </div>
                <div className={styles.container__content_table}>
                    <TableProducts />
                </div>
            </section>
        </section>
    );
}
