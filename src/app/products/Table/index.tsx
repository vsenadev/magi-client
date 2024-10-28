'use client';

import styles from '@/app/products/Table/Table.module.sass';
import { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "@/context/globalState";
import HeaderTable from "@/components/Table";
import ArrowsIcon from "@/../public/img/arrows.svg";
import Image from "next/image";
import { http } from "@/environment/environment";
import { parseCookies } from 'nookies';
import { IProduct } from '@/interface/Products.interface';

export default function TableUsers() {
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error("TableUsers must be used within a GlobalStateProvider");
    }

    const { product = [], setProduct, allProducts, setAllProducts, setIdSelected, setActiveModalProducts, activeModalProducts, idSelected, companyId, setCompanyId } = context;
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const tableHeader = [
        { title: "", width: "5%", border: true },
        { title: "Nome", width: "20%", border: true },
        { title: "Tipo", width: "20%", border: true },
        { title: "Comprimento", width: "20%", border: true },
        { title: "Altura", width: "20%", border: true },
        { title: "Largura", width: "10%", border: true },
        { title: "", width: "5%", border: false },
    ];

    async function getProducts() {
        if (companyId) {
            await http.get(`v1/product`).then((res) => {
                setAllProducts(res.data);
                setProduct(res.data);
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
        getProducts();
    }, [companyId, idSelected, activeModalProducts]);

    useEffect(() => {
        setCurrentPage(1);
    }, [product]);

    const totalPages = Math.ceil(product.length / pageSize);

    const paginatedProducts = Array.isArray(product) ? product.slice((currentPage - 1) * pageSize, currentPage * pageSize) : [];

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
                    Array.isArray(paginatedProducts) && paginatedProducts.length > 0 ? (
                        paginatedProducts.map((element: IProduct) => (
                            <div className={styles.container__table_line} key={element.id}>
                                <div className={styles.container__table_line_view}>
                                    <span>{element.id}</span>
                                </div>
                                <div className={styles.container__table_line_name}>
                                    <span>{element.name}</span>
                                </div>
                                <div className={styles.container__table_line_type}>
                                    <span>{element.type}</span>
                                </div>
                                <div className={styles.container__table_line_lenght}>
                                    <span>{element.lenght}</span>
                                </div>
                                <div className={styles.container__table_line_type}>
                                    <span>{element.height}</span>
                                </div>
                                <div className={styles.container__table_line_width}>
                                    <span>{element.width}</span>
                                </div>
                                <div className={styles.container__table_line_view} onClick={() => {
                                    setIdSelected(parseInt(element.id))
                                    setActiveModalProducts(true)
                                }}>
                                    <div className={styles.container__table_line_view_button}>
                                        <Image
                                            src={ArrowsIcon}
                                            alt='visualizar produto'
                                            width={18}
                                            height={18}
                                            priority={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No products to display</p>
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
