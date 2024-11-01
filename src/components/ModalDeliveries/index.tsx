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
        cepStarting: "",
        cepDestination: "",
        route_id: "",
        name: "",
        sender: "",
        recipient: "",
        send_date: "",
        expected_date: "",
        status: "",
        lock_status: "",
        sender_company: "",
        recipient_company: "",
        total: null,
        distance: null
    });

    function cleanValues() {
        setData({
            id: "",
            cepStarting: "",
            cepDestination: "",
            route_id: "",
            name: "",
            sender: "",
            recipient: "",
            send_date: "",
            expected_date: "",
            status: "",
            lock_status: "",
            sender_company: "",
            recipient_company: "",
            total: null,
            distance: null
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
        if (data.cepStarting.length === 9) {
            try {
                const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${data.cepStarting}`);
                setData({
                    ...data,
                    startingState: response?.data?.state || '',
                    startingCity: response?.data?.city || '',
                    startingStreet: response?.data?.street || ''
                });
            } catch (error) {
                console.error("Erro ao buscar informações do CEP:", error);
            }
        }
    }

    async function getCepInformationDestination() {
        if (data.cepDestination.length === 9) {
            try {
                const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${data.cepDestination}`);
                setData({
                    ...data,
                    destinationState: response?.data?.state || '',
                    destinationCity: response?.data?.city || '',
                    destinationStreet: response?.data?.street || ''
                });
            } catch (error) {
                console.error("Erro ao buscar informações do CEP:", error);
            }
        }
    }

    useEffect(() => {
        getCepInformationStarting();
    }, [data.cepStarting]);

    useEffect(() => {
        getCepInformationDestination();
    }, [data.cepDestination]);

    async function sendRequest() {
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
                        placeholder='Remetente'
                        value={data.sender}
                        state={(value) => handleInputChange('sender', value)}
                        icon={MailIcon.src}
                        type="text"
                        white={false}
                        width="100%"
                    />
                    <InputText
                        placeholder='Destinatário'
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
                        type="text"
                        white={false}
                        width="100%"
                        mask='9999/99/99'
                    />
                    <InputText
                        placeholder='Data de recebimento'
                        value={data.expected_date}
                        state={(value) => handleInputChange('expected_date', value)}
                        icon={CompanyIcon.src}
                        type="text"
                        white={false}
                        width="100%"
                        mask='9999/99/99'
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
                    value={data.cepStarting}
                    state={(value) => handleInputChange('cepStarting', value)}
                    icon={AddressIcon.src}
                    type="text"
                    white={false}
                    width="100%"
                    mask='99999-999'
                />
                <InputText
                    placeholder='Rua'
                    value={data.startingStreet}
                    state={(value) => handleInputChange('startingStreet', value)}
                    icon={AddressIcon.src}
                    type="text"
                    white={false}
                    width="100%"
                    disabled={true} 
                />
                <InputText
                    placeholder='Cidade'
                    value={data.startingCity}
                    state={(value) => handleInputChange('startingCity', value)}
                    icon={AddressIcon.src}
                    type="text"
                    white={false}
                    width="100%"
                    disabled={true} 
                />
                <InputText
                    placeholder='Estado'
                    value={data.startingState}
                    state={(value) => handleInputChange('startingState', value)}
                    icon={AddressIcon.src}
                    type="text"
                    white={false}
                    width="100%"
                    disabled={true} 
                />
                <InputText
                    placeholder='Número'
                    value={data.startingNumber}
                    state={(value) => handleInputChange('startingNumber', value)}
                    icon={NumberIcon.src}
                    type="number"
                    white={false}
                    width="50%"
                />
                <h1>Endereço de chegada</h1>
                <InputText
                    placeholder='CEP'
                    value={data.cepDestination}
                    state={(value) => handleInputChange('cepDestination', value)}
                    icon={AddressIcon.src}
                    type="text"
                    white={false}
                    width="100%"
                    mask='99999-999'
                />
                <InputText
                    placeholder='Rua'
                    value={data.destinationStreet}
                    state={(value) => handleInputChange('startingStreet', value)}
                    icon={AddressIcon.src}
                    type="text"
                    white={false}
                    width="100%"
                    disabled={true} 
                />
                <InputText
                    placeholder='Cidade'
                    value={data.destinationCity}
                    state={(value) => handleInputChange('startingCity', value)}
                    icon={AddressIcon.src}
                    type="text"
                    white={false}
                    width="100%"
                    disabled={true} 
                />
                <InputText
                    placeholder='Estado'
                    value={data.destinationState}
                    state={(value) => handleInputChange('startingState', value)}
                    icon={AddressIcon.src}
                    type="text"
                    white={false}
                    width="100%"
                    disabled={true} 
                />
                <InputText
                    placeholder='Número'
                    value={data.destinationNumber}
                    state={(value) => handleInputChange('destinationNumber', value)}
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
