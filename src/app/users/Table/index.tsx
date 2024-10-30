'use client';

import styles from '@/app/users/Table/Table.module.sass';
import { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "@/context/globalState";
import HeaderTable from "@/components/Table";
import ArrowsIcon from "@/../public/img/arrows.svg";
import { IEmployees } from "@/interface/Employees.interface";
import Image from "next/image";
import { http } from "@/environment/environment";
import { parseCookies } from 'nookies';

export default function TableUsers() {
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error("TableUsers must be used within a GlobalStateProvider");
    }

    const { user, setUser, allUsers, setAllUsers, setIdSelected, setActiveModalEmployees, activeModalEmployees, idSelected, companyId, setCompanyId } = context;
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const tableHeader = [
        { title: "", width: "5%", border: true },
        { title: "Nome", width: "25%", border: true },
        { title: "CPF", width: "15%", border: true },
        { title: "Empresa", width: "20%", border: true },
        { title: "E-mail", width: "20%", border: true },
        { title: "Tipo", width: "5%", border: true },
        { title: "Status", width: "5%", border: true },
        { title: "", width: "5%", border: false },
    ];

    async function getEmployees() {
        if (companyId) {
            await http.get(`v1/employee/company/${companyId}`).then((res) => {
                setAllUsers(res.data);
                setUser(res.data);
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
        getEmployees();
    }, [companyId, idSelected, activeModalEmployees]);

    useEffect(() => {
        setCurrentPage(1);
    }, [user]);

    const totalPages = Math.ceil(user.length / pageSize);
    const paginatedEmployees = user.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
                    Array.isArray(paginatedEmployees) && paginatedEmployees.length > 0 ? (
                        paginatedEmployees.map((element: IEmployees) => (
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
                                <div className={styles.container__table_line_cpf}>
                                    <span>{element.cpf}</span>
                                </div>
                                <div className={styles.container__table_line_company}>
                                    <span>{element.company_name}</span>
                                </div>
                                <div className={styles.container__table_line_email}>
                                    <span>{element.email}</span>
                                </div>
                                <div className={styles.container__table_line_type}>
                                    <span>{element.type_account}</span>
                                </div>
                                <div className={styles.container__table_line_status}>
                                    <span>{element.status_account}</span>
                                </div>
                                <div className={styles.container__table_line_view} onClick={() => {
                                    setIdSelected(parseInt(element.id))
                                    setActiveModalEmployees(true)
                                }}>
                                    <div className={styles.container__table_line_view_button}>
                                        <Image
                                            src={ArrowsIcon}
                                            alt='visualizar funcionário'
                                            width={18}
                                            height={18}
                                            priority={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No employees to display</p>
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
