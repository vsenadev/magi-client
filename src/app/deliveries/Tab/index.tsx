'use client'

import styles from './Tab.module.sass';
import Tab from "@/components/Tab";
import { useEffect, useState } from "react";
import SearchIcon from '@/../public/img/search-icon.svg';
import { IOption } from "@/interface/SelectOption.interface";
import { http } from "@/environment/environment";
import { useGlobalState } from "@/context/globalState";
import Modal from "../../../components/ModalDeliveries";

export default function TabUsers() {
    const { setDelivery, allDeliveries, activeModalDeliveries, setActiveModalDeliveries } = useGlobalState();
    const [search, setSearch] = useState<string>('');
    const [activeType, setActiveType] = useState<boolean>(false);
    const [activeStatus, setActiveStatus] = useState<boolean>(false);
    const [typeOptions, setTypeOptions] = useState<IOption[]>([]);
    const [statusOptions, setStatusOptions] = useState<IOption[]>([]);
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    useEffect(() => {
        filterDeliveries();
    }, [search, selectedType, selectedStatus]);

    function filterDeliveries() {
        if (!search && !selectedType && !selectedStatus) {
            setDelivery(allDeliveries);
            return;
        }

        const filteredDeliveries = allDeliveries.filter(delivery => {
            const matchesSearch =
            delivery.name.toLowerCase().includes(search.toLowerCase());
            return matchesSearch;
        });

        setDelivery(filteredDeliveries);
    }

    return (
        <div className={styles.container}>
            <Tab
                searchPlaceholder="Pesquise pelo nome da entrega"
                searchValue={search}
                searchState={setSearch}
                searchIcon={SearchIcon.src}
                searchType='text'
                searchWidth="35%"
                firstSelectOptionPlaceholder="Tipo de entrega"
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
                buttonText='ADICIONAR ENTREGA'
                buttonAction={setActiveModalDeliveries}
                showFirstSelect={false}
                showSecondSelect={false}
            />
            {
                activeModalDeliveries && (
                    <section className={styles.container__modal}>
                        <Modal
                            title='Entrega'
                        />
                    </section>
                )
            }
        </div>
    )
}
