'use client';

import styles from '@/app/deliveries/Table/Table.module.sass';
import { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "@/context/globalState";
import HeaderTable from "@/components/Table";
import ArrowsIcon from "@/../public/img/arrows.svg";
import Image from "next/image";
import { http } from "@/environment/environment";
import { parseCookies } from 'nookies';
import { IDelivery } from '@/interface/Deliveries.interface';

export default function TableUsers() {
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error("TableUsers must be used within a GlobalStateProvider");
    }

    const { delivery, setDelivery, allDeliveries, setAllDeliveries, setIdSelected, setActiveModalDeliveries, activeModalDeliveries, idSelected, companyId, setCompanyId } = context;
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const tableHeader = [
        { title: "", width: "5%", border: true },
        { title: "Nome", width: "20%", border: true },
        { title: "Remetente", width: "15%", border: true },
        { title: "Envio - Previsto", width: "20%", border: true },
        { title: "Status", width: "10%", border: true },
        { title: "Status Tranca", width: "10%", border: true },
        { title: "Valor Transportado", width: "15%", border: true },
        { title: "", width: "5%", border: false },
    ];

    async function getDeliveries() {
        if (companyId) {
            await http.get(`v1/delivery`).then((res) => {
                setAllDeliveries(res.data);
                setDelivery(res.data);
            })
        }
    }

    useEffect(() => {
        const { user_information } = parseCookies();

        if (!user_information) {
            console.log('user_information cookie not found');
            return;
        }

        try {
            const userInfo = JSON.parse(user_information);

            if (userInfo && userInfo.id) {
                console.log('User Info:', userInfo);
                setCompanyId(userInfo.id);
            } else {
                console.error('ID not found in user information');
            }
        } catch (error) {
            console.error('Error parsing user_information:', error);
        }
    }, []);

    useEffect(() => {
        getDeliveries();
    }, [companyId, idSelected, activeModalDeliveries]);

    useEffect(() => {
        setCurrentPage(1);
    }, [delivery]);

    const totalPages = Math.ceil(delivery.length / pageSize);

    const paginatedDeliveries = Array.isArray(delivery) ? delivery.slice((currentPage - 1) * pageSize, currentPage * pageSize) : [];

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    return (
        <div className={styles.container}>
            <HeaderTable header={tableHeader} />
            <div className={styles.container__table}>
                {
                    Array.isArray(paginatedDeliveries) && paginatedDeliveries.length > 0 ? (
                        paginatedDeliveries.map((element: IDelivery) => (
                            <div className={styles.container__table_line} key={element.id}>
                                <div className={styles.container__table_line_id}>
                                    <span>{element.id}</span>
                                </div>
                                <div className={styles.container__table_line_name}>
                                    <span>{element.name}</span>
                                </div>
                                <div className={styles.container__table_line_sender}>
                                    <span>{element.sender}</span>
                                </div>
                                <div className={styles.container__table_line_date}>
                                    <span>{element.send_date + element.expected_date}</span>
                                </div>
                                <div className={styles.container__table_line_status}>
                                    <span>{element.status_id}</span>
                                </div>
                                <div className={styles.container__table_line_status}>
                                    <span>{element.lock_status}</span>
                                </div>
                                <div className={styles.container__table_line_products}>
                                    <span>{element.products}</span>
                                </div>
                                <div className={styles.container__table_line_view} onClick={() => {
                                    setIdSelected(parseInt(element.id))
                                    setActiveModalDeliveries(true)
                                }}>
                                    <div className={styles.container__table_line_view_button}>
                                        <Image
                                            src={ArrowsIcon}
                                            alt='Visualizar Entrega'
                                            width={18}
                                            height={18}
                                            priority={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No Deliveries to display</p>
                    )
                }
            </div>
            <div className={styles.container__pagination}>
                <div className={styles.container__pagination_divisor}>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            className={styles.container__pagination_divisor_page}
                            onClick={() => setCurrentPage(index + 1)}
                            style={index + 1 === currentPage ? { backgroundColor: "#032637", color: "#FFF" } : {}}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <div className={styles.container__pagination_buttons}>
                    <button
                        className={styles.container__pagination_buttons_return}
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>
                    <button
                        className={styles.container__pagination_buttons_pass}
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
}
