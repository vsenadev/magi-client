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
import DownloadIcon from "@/../public/img/download-icon.svg";

export default function TableUsers() {
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error("TableUsers must be used within a GlobalStateProvider");
    }

    const { delivery, setDelivery, allDeliveries, setAllDeliveries, setIdSelected, setActiveModalDelivery, activeModalDelivery, idSelected, companyId, setCompanyId, setShowMap } = context;
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const tableHeader = [
        { title: "Nome", width: "15%", border: true },
        { title: "Remetente", width: "15%", border: true },
        { title: "Envio - Previsto", width: "25%", border: true },
        { title: "Status", width: "10%", border: true },
        { title: "Valor Transportado", width: "15%", border: true },
        { title: "Distância", width: "10%", border: true },
        { title: "PDF", width: "5%", border: true },
        { title: "", width: "5%", border: false },
    ];

    async function getDeliveries() {
        if (companyId) {
            console.log(companyId)
            await http.get(`v1/delivery/company/${companyId}`).then((res) => {
                console.log(res.data)
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
    }, [companyId, idSelected, activeModalDelivery]);

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

    const downloadPdf = async (id : string) => {
        try {
            const base64 : string = await http.get(`v1/delivery/pdf/${id}`)
                .then((res) => res.data?.pdf); // Supondo que o base64 está em `res.data`
            
            // Converter a string base64 para Blob
            const pdfBlob = base64ToBlob(base64, 'application/pdf');
            
            // Criar uma URL temporária para o Blob
            const pdfUrl = URL.createObjectURL(pdfBlob);
            
            // Criar um link para download
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'document.pdf'; // Nome do arquivo ao baixar
            
            // Adicionar o link ao DOM, clicar nele e removê-lo
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Liberar a URL
            URL.revokeObjectURL(pdfUrl);
        } catch (error) {
            console.error("Erro ao baixar o PDF:", error);
        }
    }

    const base64ToBlob = (base64 : string, contentType : string) => {
        const byteCharacters = atob(base64);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = Array.from(slice).map((char) => char.charCodeAt(0));
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, { type: contentType });
    };

    return (
        <div className={styles.container}>
            <HeaderTable header={tableHeader} />
            <div className={styles.container__table}>
                {
                    Array.isArray(paginatedDeliveries) && paginatedDeliveries.length > 0 ? (
                        paginatedDeliveries.map((element: IDelivery) => (
                            <div className={styles.container__table_line} key={element.id}>
                                <div className={styles.container__table_line_name}>
                                    <span>{element.name}</span>
                                </div>
                                <div className={styles.container__table_line_name}>
                                    <span>{element.sender}</span>
                                </div>
                                <div className={styles.container__table_line_sendDate}>
                                    <span>
                                      {new Date(element.send_date).toLocaleDateString('pt-BR') +
                                        ' até ' +
                                        (element.expected_date ? new Date(element.expected_date).toLocaleDateString('pt-BR') : '')}
                                    </span>
                                </div>
                                <div className={styles.container__table_line_distance}>
                                    <span>{element.status}</span>
                                </div>
                                <div className={styles.container__table_line_name}>
                                    <span>{'R$ ' + element.total}</span>
                                </div>
                                <div className={styles.container__table_line_distance}>
                                    <span>{element.distance + ' Km'}</span>
                                </div>
                                <div className={styles.container__table_line_view} onClick={async () => {
                                    await downloadPdf(element.route_id)
                                }}>
                                    <div className={styles.container__table_line_view_button}>
                                        <Image
                                            src={DownloadIcon}
                                            alt='baixar pdf entrega'
                                            width={18}
                                            height={18}
                                            priority={true}
                                        />
                                    </div>
                                </div>
                                <div className={styles.container__table_line_view} onClick={() => {
                                    setIdSelected(parseInt(element.id))
                                    setShowMap(true)
                                    setActiveModalDelivery(true)
                                }}>
                                    <div className={styles.container__table_line_view_button}>
                                        <Image
                                            src={ArrowsIcon}
                                            alt='visualizar entrega'
                                            width={18}
                                            height={18}
                                            priority={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No deliveries to display</p>
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
