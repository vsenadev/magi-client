'use client'

import styles from '@/app/companies/Table/Table.module.sass';
import { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "@/context/globalState";
import HeaderTable from "@/components/Table";
import ArrowsIcon from "@/../public/img/arrows.svg";
import { ICompanies } from "@/interface/Companies.interface";
import Image from "next/image";
import { http } from "@/environment/environment";

export default function TableEmployees() {
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error("TableEmployees must be used within a GlobalStateProvider");
    }
    const { companies, setCompanies, allCompanies, setAllCompanies, setIdSelected, setActiveModalCompany, activeModalCompany } = context;
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const tableHeader = [
        { title: "", width: "5%", border: false },
        { title: "Nome", width: "20%", border: true },
        { title: "CPF", width: "20%", border: true },
        { title: "Empresa", width: "30%", border: true },
        { title: "Tipo", width: "10%", border: true },
        { title: "E-mail", width: "10%", border: true },
        { title: "Status", width: "10%", border: true },
        { title: "", width: "10%", border: false },
    ];

    async function getCompanies() {
        await http.get('v1/company').then((res) => {
            setAllCompanies(res.data);
            setCompanies(res.data);
        })
    }

    const totalPages = Math.ceil(companies.length / pageSize);
    
    const paginatedCompanies = companies.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    useEffect(() => {
        getCompanies();
    }, []);

    useEffect(() => {
        getCompanies()
    }, [activeModalCompany]);

    useEffect(() => {
        setCurrentPage(1);
    }, [companies]);

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
                    paginatedCompanies.map((element: ICompanies) => (
                        <div className={styles.container__table_line} key={element.id}>
                            <div className={styles.container__table_line_picture}>
                                <Image
                                    src={element.picture}
                                    alt='logo da empresa'
                                    width={42}
                                    height={42}
                                    priority={true}
                                />
                            </div>
                            <div className={styles.container__table_line_name}>
                                <span>{element.name}</span>
                            </div>
                            <div className={styles.container__table_line_cnpj}>
                                <span>{element.cnpj}</span>
                            </div>
                            <div className={styles.container__table_line_address}>
                                <span>{element.street}, {element.number} - {element.city}, {element.state}</span>
                            </div>
                            <div className={styles.container__table_line_type}>
                                <span>{element.type_account}</span>
                            </div>
                            <div className={styles.container__table_line_status}>
                                <span>{element.status_account}</span>
                            </div>
                            <div className={styles.container__table_line_view} onClick={() => {
                                setIdSelected(parseInt(element.id))
                                setActiveModalCompany(true)
                            }}>
                                <div className={styles.container__table_line_view_button}>
                                    <Image
                                        src={ArrowsIcon}
                                        alt='visualizar empresa'
                                        width={18}
                                        height={18}
                                        priority={true}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
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
    )
}
