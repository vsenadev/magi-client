'use client';

import styles from '@/components/ModalDeliveries/Modal.module.sass';
import { useGlobalState } from "@/context/globalState";
import { IModal } from "@/interface/Modal.interface";
import { http } from "@/environment/environment";
import { useEffect, useRef, useState } from "react";
import CamIcon from "@/../public/img/cam-icon.svg";
import CloseIcon from "@/../public/img/close-icon.svg";
import LetterIcon from "@/../public/img/letter-icon.svg";
import MailIcon from "@/../public/img/mail-icon.svg";
import CnpjIcon from "@/../public/img/cnpj-icon.svg";
import CompanyIcon from "@/../public/img/companies-icon.svg";
import AddressIcon from "@/../public/img/address-icon.svg";
import NumberIcon from "@/../public/img/number-icon.svg";
import { IDelivery } from "@/interface/Deliveries.interface";
import Image from "next/image";
import InputText from "@/components/InputText";
import SelectOption from "@/components/SelectOption";
import { IOption } from "@/interface/SelectOption.interface";
import axios from "axios";
import { Alert, AlertTitle } from "@mui/material";

export default function Modal(props: IModal) {
    const { idSelected, setIdSelected, setActiveModalDelivery, companyId } = useGlobalState();
    const [activeType, setActiveType] = useState<boolean>(false);
    const [typeOptions, setTypeOptions] = useState<IOption[]>([]);
    const [modalError, setModalError] = useState<boolean>(false);
    const [modalSuccess, setModalSuccess] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [data, setData] = useState<IDelivery>({
        id: "",
        starting_cep: "",
        destination_cep: "",
        route_id: "",
        name: "",
        send_date: new Date(),
        sender: "",
        recipient: "",
        status: "",
        lock_status: "",
        sender_company: "",
        recipient_company: "",
        total: null,
        distance: 1
    });

    function cleanValues() {
        setData({
            id: "",
            starting_cep: "",
            destination_cep: "",
            route_id: "",
            name: "",
            send_date: new Date(),
            sender: "",
            recipient: "",
            status: "",
            lock_status: "",
            sender_company: "",
            recipient_company: "",
            total: null,
            distance: 1
        });
    }

    const handleClose = async () => {
        setIdSelected(null);
        cleanValues();
        setActiveModalDelivery(false);
    };

    async function getWithId() {
        if (idSelected !== null) {
            await http.get(`v1/delivery/${idSelected}`).then((res) => {
                console.log(res.data)
                res.data.send_date = res.data.send_date.substring(0, 10)
                res.data.expected_date = res.data.expected_date.substring(0, 10)
                setData(res.data);
            });
        }
    }

    async function getAllTypeAccount() {
        if (companyId !== null) {
            await http.get(`v1/product/company/${companyId}`).then((res) => {
                setTypeOptions(res.data);
            });
        }
    }

    useEffect(() => {
        getWithId();
        getAllTypeAccount();
    }, []);

    const handleInputChange = (field: keyof IDelivery, value: string | any) => {
        setData((prevData) => ({
            ...prevData,
            [field]: value
        }));
    };

    async function getCepInformationStarting() {
        if (data.starting_cep.length === 9) {
            try {
                const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${data.starting_cep}`);
                setData({
                    ...data,
                    starting_state: response?.data?.state || '',
                    starting_neighborhood: response?.data?.neighborhood || '',
                    starting_city: response?.data?.city || '',
                    starting_street: response?.data?.street || ''
                });
            } catch (error) {
                console.error("Erro ao buscar informações do CEP:", error);
            }
        }
    }

    async function getCepInformationDestination() {
        if (data.destination_cep.length === 9) {
            try {
                const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${data.destination_cep}`);
                setData({
                    ...data,
                    destination_state: response?.data?.state || '',
                    destination_neighborhood: response?.data?.neighborhood || '',
                    destination_city: response?.data?.city || '',
                    destination_street: response?.data?.street || ''
                });
            } catch (error) {
                console.error("Erro ao buscar informações do CEP:", error);
            }
        }
    }

    useEffect(() => {
        getCepInformationStarting();
    }, [data.starting_cep]);

    useEffect(() => {
        getCepInformationDestination();
    }, [data.destination_cep]);

    async function sendRequest() {
        console.log(data)
        data.starting_number = Number(data.starting_number)
        data.destination_number = Number(data.destination_number)
        try {
            if (idSelected) {
                const res: any = await http.put(`v1/delivery/${idSelected}`, data);

                if (res?.status === 200) {
                    setModalSuccess(true);
                    setModalMessage(res?.data.message);
                    setTimeout(() => {
                        setIdSelected(null)
                        setActiveModalDelivery(false);
                    }, 1000);
                }
            } else {
                const res: any = await http.post('v1/delivery', data);
                setModalSuccess(true);
                setModalMessage(res?.data.message);
                setTimeout(() => {
                    cleanValues()
                    setActiveModalDelivery(false);
                }, 1000);
            }
        } catch (res: any) {
            setModalError(true);
            setModalMessage(res?.response?.data?.message || 'Erro ao salvar os dados');
        }
    }

    return (
        <div className={styles.container}>
            {modalError && (
                <div className={styles.container__modal}>
                    <Alert severity="error">
                        <AlertTitle>ERRO</AlertTitle>
                        {modalMessage}
                    </Alert>
                </div>
            )}
            {modalSuccess && (
                <div className={styles.container__modal}>
                    <Alert severity="success">
                        <AlertTitle>AVISO</AlertTitle>
                        {modalMessage}
                    </Alert>
                </div>
            )}
            <div className={styles.container__boxleft}>
                <h1 className={styles.container__boxleft_title}>{idSelected !== null ? 'Visualizar' : 'Adicionar'} {props.title}</h1>
                <div className={styles.container__boxleft_input}>
                    <InputText
                        placeholder='Nome'
                        value={data.name}
                        state={(value) => handleInputChange('name', value)}
                        icon={LetterIcon.src}
                        type="text"
                        white={false}
                        width="100%"
                    />
                    <InputText
                        placeholder='Remetente (email)'
                        value={data.sender}
                        state={(value) => handleInputChange('sender', value)}
                        icon={MailIcon.src}
                        type="text"
                        white={false}
                        width="100%"
                    />
                    <InputText
                        placeholder='Destinatário (email)'
                        value={data.recipient}
                        state={(value) => handleInputChange('recipient', value)}
                        icon={CnpjIcon.src}
                        type="text"
                        white={false}
                        width="100%"
                    />
                    <InputText
                        placeholder='Data de envio'
                        value={data.send_date}
                        state={(value) => handleInputChange('send_date', value)}
                        icon={CompanyIcon.src}
                        type="date"
                        white={false}
                        width="100%"
                    />
                    <SelectOption
                        placeholder='Produtos'
                        active={activeType}
                        options={typeOptions}
                        setActive={setActiveType}
                        width="98.5%"
                        value={data.products}
                        setValue={(value) => handleInputChange('products', value)}
                        backgroundBlue={true}
                    />
                </div>
            </div>
            <div className={styles.container__boxright}>
                <div className={styles.container__boxright_close}>
                    <div className={styles.container__boxright_close_content} onClick={() => handleClose()}>
                        <Image
                            src={CloseIcon}
                            alt='Fechar'
                            width={12}
                            height={12}
                        />
                    </div>
                </div>
                <h1>Endereço de saída</h1>
                <InputText
                    placeholder='CEP'
                    value={data.starting_cep}
                    state={(value) => handleInputChange('starting_cep', value)}
                    icon={AddressIcon.src}
                    type="text"
                    white={false}
                    width="100%"
                    mask='99999-999'
                />
                <InputText
                    placeholder='Rua'
                    value={data.starting_street}
                    state={(value) => handleInputChange('starting_street', value)}
                    icon={AddressIcon.src}
                    type="text"
                    white={false}
                    width="100%"
                    disabled={true}
                />
                <InputText
                    placeholder='Cidade'
                    value={data.starting_city}
                    state={(value) => handleInputChange('starting_city', value)}
                    icon={AddressIcon.src}
                    type="text"
                    white={false}
                    width="100%"
                    disabled={true}
                />
                <InputText
                    placeholder='Estado'
                    value={data.starting_state}
                    state={(value) => handleInputChange('starting_state', value)}
                    icon={AddressIcon.src}
                    type="text"
                    white={false}
                    width="100%"
                    disabled={true}
                />
                <InputText
                    placeholder='Número'
                    value={data.starting_number}
                    state={(value) => handleInputChange('starting_number', value)}
                    icon={NumberIcon.src}
                    type="number"
                    white={false}
                    width="50%"
                />
                <h1>Endereço de chegada</h1>
                <InputText
                    placeholder='CEP'
                    value={data.destination_cep}
                    state={(value) => handleInputChange('destination_cep', value)}
                    icon={AddressIcon.src}
                    type="text"
                    white={false}
                    width="100%"
                    mask='99999-999'
                />
                <InputText
                    placeholder='Rua'
                    value={data.destination_street}
                    state={(value) => handleInputChange('destination_street', value)}
                    icon={AddressIcon.src}
                    type="text"
                    white={false}
                    width="100%"
                    disabled={true}
                />
                <InputText
                    placeholder='Cidade'
                    value={data.destination_city}
                    state={(value) => handleInputChange('destination_city', value)}
                    icon={AddressIcon.src}
                    type="text"
                    white={false}
                    width="100%"
                    disabled={true}
                />
                <InputText
                    placeholder='Estado'
                    value={data.destination_state}
                    state={(value) => handleInputChange('destination_state', value)}
                    icon={AddressIcon.src}
                    type="text"
                    white={false}
                    width="100%"
                    disabled={true}
                />
                <InputText
                    placeholder='Número'
                    value={data.destination_number}
                    state={(value) => handleInputChange('destination_number', value)}
                    icon={NumberIcon.src}
                    type="number"
                    white={false}
                    width="50%"
                />
                <div className={styles.container__boxright_buttons}>
                    <button onClick={() => handleClose()} className={styles.container__boxright_buttons_close}>FECHAR</button>
                    <button onClick={() => sendRequest()} className={styles.container__boxright_buttons_add}>SALVAR</button>
                </div>
            </div>
        </div>
    );
}
