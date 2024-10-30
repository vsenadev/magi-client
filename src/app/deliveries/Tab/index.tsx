'use client'

import styles from './Tab.module.sass';
import Tab from "@/components/Tab";
import { useEffect, useState } from "react";
import SearchIcon from '@/../public/img/search-icon.svg';
import { IOption } from "@/interface/SelectOption.interface";
import { http } from "@/environment/environment";
import { useGlobalState } from "@/context/globalState";
import Modal from "../../../components/ModalProducts";

export default function TabUsers() {
    const { setProduct, allProducts, activeModalProducts, setActiveModalProducts } = useGlobalState();
    const [search, setSearch] = useState<string>('');
    const [activeType, setActiveType] = useState<boolean>(false);
    const [activeStatus, setActiveStatus] = useState<boolean>(false);
    const [typeOptions, setTypeOptions] = useState<IOption[]>([]);
    const [statusOptions, setStatusOptions] = useState<IOption[]>([]);
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    useEffect(() => {
        filterProducts();
    }, [search, selectedType, selectedStatus]);

    function filterProducts() {
        if (!search && !selectedType && !selectedStatus) {
            setProduct(allProducts);
            return;
        }

        const filteredProducts = allProducts.filter(product => {
            const matchesSearch =
            product.name.toLowerCase().includes(search.toLowerCase());
            return matchesSearch;
        });

        setProduct(filteredProducts);
    }

    return (
        <div className={styles.container}>
            <Tab
                searchPlaceholder="Pesquise pelo nome do produto"
                searchValue={search}
                searchState={setSearch}
                searchIcon={SearchIcon.src}
                searchType='text'
                searchWidth="35%"
                firstSelectOptionPlaceholder="Tipo de produto"
                firstSelectOptionActive={activeType}
                firstSelectOptionOptions={typeOptions}
                firstSelectOptionSetActive={setActiveType}
                firstSelectOptionValue={selectedType}
                firstSelectOptionSetValue={setSelectedType}
                secondSelectOptionPlaceholder="Status"
                secondSelectOptionActive={activeStatus}
                secondSelectOptionOptions={statusOptions}
                secondSelectOptionSetActive={setActiveStatus}
                secondSelectOptionValue={selectedStatus}
                secondSelectOptionSetValue={setSelectedStatus}
                buttonText='ADICIONAR PRODUTO'
                buttonAction={setActiveModalProducts}
                showFirstSelect={false}
                showSecondSelect={false}
            />
            {
                activeModalProducts && (
                    <section className={styles.container__modal}>
                        <Modal
                            title='Produto'
                        />
                    </section>
                )
            }
        </div>
    )
}
