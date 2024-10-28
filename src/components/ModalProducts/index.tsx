'use client';

import styles from '@/components/ModalEmployees/Modal.module.sass';
import { useGlobalState } from "@/context/globalState";
import { IModal } from "@/interface/Modal.interface";
import { http } from "@/environment/environment";
import { useEffect, useRef, useState } from "react";
import CamIcon from "@/../public/img/cam-icon.svg";
import CloseIcon from "@/../public/img/close-icon.svg";
import PhoneIcon from "@/../public/img/phone-icon.svg"
import LetterIcon from "@/../public/img/letter-icon.svg";
import MailIcon from "@/../public/img/mail-icon.svg";
import ValueProduct from "@/../public/img/cash-value-product.svg";
import SizeProduct from "@/../public/img/size-product.svg";
import WidthProduct from "@/../public/img/width-product.svg";
import HeightProduct from "@/../public/img/height-product.svg";
import TypeProduct from "@/../public/img/type-product.svg";
import CnpjIcon from "@/../public/img/cnpj-icon.svg";
import AddressIcon from "@/../public/img/address-icon.svg";
import NumberIcon from "@/../public/img/number-icon.svg";
import { ICompanies } from "@/interface/Companies.interface";
import Image from "next/image";
import InputText from "@/components/InputText";
import SelectOption from "@/components/SelectOption";
import { IOption } from "@/interface/SelectOption.interface";
import axios from "axios";
import { Alert, AlertTitle } from "@mui/material";
import { IProduct } from '@/interface/Products.interface';
import { parseCookies } from 'nookies';


export default function Modal(props: IModal) {
    const { idSelected, setIdSelected, activeModalProducts, setActiveModalProducts, companyId } = useGlobalState();
    const [activeType, setActiveType] = useState<boolean>(false);
    const [activeAccountStatus, setActiveAccountStatus] = useState<boolean>(false);
    const [typeOptions, setTypeOptions] = useState<IOption[]>([]);
    const [statusOptions, setStatusOptions] = useState<IOption[]>([]);
    const [modalError, setModalError] = useState<boolean>(false);
    const [modalSuccess, setModalSuccess] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [data, setData] = useState<IProduct>({
        name: "",
        type: "",
        id: "",
        value: null,
        length: null,
        width: null,
        height: null,
        company_id: companyId || 0,
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function cleanValues() {
        setData({
            name: "",
            type: "",
            id: "",
            value: null,
            length: null,
            width: null,
            height: null,
            company_id: companyId || 0,
        });
    }

    const handleClose = async () => {
        setIdSelected(null);
        cleanValues();
        setActiveModalProducts(false);
    };

    async function getWithId() {
        if (idSelected !== null) {
            await http.get(`v1/product/${idSelected}`).then((res) => {
                setData(res.data);
            });
        }
    }

    async function getAllTypeAccount() {
        const res = await http.get('v1/typeaccount');
        setTypeOptions(res.data);
    }

    async function getAllStatusAccount() {
        const res = await http.get('v1/statusaccount');
        setStatusOptions(res.data);
    }

    useEffect(() => {
        getWithId();
        getAllTypeAccount();
        getAllStatusAccount();
    }, []);

    const handleInputChange = (field: keyof IProduct, value: string | any) => {
        setData((prevData) => ({
            ...prevData,
            [field]: value
        }));
    };

    async function sendRequest() {
        data.value = Number(data.value)
        data.length = Number(data.length)
        data.height = Number(data.height)
        data.width = Number(data.width)
        console.log(data)
        try {
            if (idSelected) {
                const res: any = await http.put(`v1/product/${idSelected}`, data);

                if (res?.status === 200) {
                    setModalSuccess(true);
                    setModalMessage(res?.data.message);
                    setTimeout(() => {
                        setIdSelected(null)
                        setActiveModalProducts(false);
                    }, 1000);
                }
            } else {
                const res: any = await http.post('v1/product', data);
                setModalSuccess(true);
                setModalMessage(res?.data.message);
                setTimeout(() => {
                    setIdSelected(null)
                    cleanValues()
                    setActiveModalProducts(false);
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
                <div className={styles.container__boxleft_header}>
                    <h1 className={styles.container__boxleft_header_title}>{idSelected !== null ? 'Visualizar' : 'Adicionar'} {props.title}</h1>
                    <div className={styles.container__boxleft_header_close}>
                        <div className={styles.container__boxleft_header_close_content} onClick={() => handleClose()}>
                            <Image
                                src={CloseIcon}
                                alt='Fechar'
                                width={12}
                                height={12}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.container__boxleft_input}>
                    <InputText
                        placeholder='Nome do produto'
                        value={data.name}
                        state={(value) => handleInputChange('name', value)}
                        icon={LetterIcon.src}
                        type="text"
                        white={false}
                        width="100%"
                    />
                    <InputText
                        placeholder='Tipo do produto'
                        value={data.type}
                        state={(value) => handleInputChange('type', value)}
                        icon={TypeProduct.src}
                        type="text"
                        white={false}
                        width="100%"
                    />
                    <InputText
                        placeholder='Valor do produto (R$)'
                        value={data.value}
                        state={(value) => handleInputChange('value', value)}
                        icon={ValueProduct.src}
                        type="number"
                        white={false}
                        width="100%"
                        mask='99999.99'
                    />
                    <InputText
                        placeholder='Tamanho do produto'
                        value={data.length}
                        state={(value) => handleInputChange('length', value)}
                        icon={HeightProduct.src}
                        type="number"
                        white={false}
                        width="100%"
                        mask='99999'
                    />
                    <InputText
                        placeholder='Largura do Produto (Cm)'
                        value={data.width}
                        state={(value) => handleInputChange('width', value)}
                        icon={SizeProduct.src}
                        type="number"
                        white={false}
                        width="100%"
                        mask='99999.9'
                    />
                    <InputText
                        placeholder='Altura do Produto (Cm)'
                        value={data.height}
                        state={(value) => handleInputChange('height', value)}
                        icon={WidthProduct.src}
                        type="number"
                        white={false}
                        width="100%"
                        mask='99999.9'
                    />
                    <div className={styles.container__boxright_buttons}>
                        <button onClick={() => handleClose()} className={styles.container__boxright_buttons_close}>FECHAR</button>
                        <button onClick={() => sendRequest()} className={styles.container__boxright_buttons_add}>SALVAR</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
