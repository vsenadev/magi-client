'use client';

import styles from '@/components/ModalCompanies/Modal.module.sass';
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
import { ICompanies } from "@/interface/Companies.interface";
import Image from "next/image";
import InputText from "@/components/InputText";
import SelectOption from "@/components/SelectOption";
import { IOption } from "@/interface/SelectOption.interface";
import axios from "axios";
import { Alert, AlertTitle } from "@mui/material";
import { IEmployees } from '@/interface/Employees.interface';

export default function Modal(props: IModal) {
    const { idSelected, setIdSelected, setActiveModalEmployees } = useGlobalState();
    const [activeType, setActiveType] = useState<boolean>(false);
    const [typeOptions, setTypeOptions] = useState<IOption[]>([]);
    const [modalError, setModalError] = useState<boolean>(false);
    const [modalSuccess, setModalSuccess] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [data, setData] = useState<IEmployees>({
        cpf: "",
        employee_name: "",
        email: "",
        id: "",
        password: "",
        phoneNumber: "",
        company_name: "",
        picture: "",
        status_account: 0,
        type_account: ""
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function cleanValues() {
        setData({
            cpf: "",
            employee_name: "",
            email: "",
            password: "",
            id: "",
            phoneNumber: "",
            company_name: "",
            picture: "",
            status_account: 0,
            type_account: ""
        });
    }

    const handleClose = async () => {
        setIdSelected(null);
        cleanValues();
        setActiveModalEmployees(false);
    };

    async function getWithId() {
        if (idSelected !== null) {
            await http.get(`v1/company/${idSelected}`).then((res) => {
                setData(res.data);
            });
        }
    }

    async function getAllTypeAccount() {
        const res = await http.get('v1/typeaccount');
        setTypeOptions(res.data);
    }

    useEffect(() => {
        getWithId();
        getAllTypeAccount();
    }, []);

    const handleInputChange = (field: keyof IEmployees, value: string | any) => {
        setData((prevData) => ({
            ...prevData,
            [field]: value
        }));
    };


    useEffect(() => {
        
    }, );

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                setPreviewImage(reader.result as string);
            };

            reader.readAsDataURL(file);

            await uploadImageToImgbb(file);
        }
    };

    async function uploadImageToImgbb(file: File) {
        try {
            const formData = new FormData();

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                const base64String = reader.result?.toString().split(',')[1];

                formData.append('key', process.env.NEXT_PUBLIC_IMAGE_BB_KEY as string);
                formData.append('image', base64String || '');

                const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const imageUrl = response.data.data.image.url;
                handleInputChange('picture', imageUrl);
            };
        } catch (error) {
            console.error('Erro ao enviar a imagem para o imgbb:', error);
        }
    }

    async function sendRequest() {
        try {
            if (idSelected) {
                const res: any = await http.put(`v1/company/${idSelected}`, data);

                if (res?.status === 200) {
                    setModalSuccess(true);
                    setModalMessage(res?.data.message);
                    setTimeout(() => {
                        setIdSelected(null)
                        setActiveModalEmployees(false);
                    }, 1000);
                }
            }else{
                const res: any = await http.post('v1/company', data);
                setModalSuccess(true);
                setModalMessage(res?.data.message);
                setTimeout(() => {
                        cleanValues()
                        setActiveModalEmployees(false);
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
                <div className={styles.container__boxleft_image}>
                    {
                        previewImage || data.picture ? (
                            <>
                                <img
                                    src={previewImage || data.picture}
                                    alt="foto da conta"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '100%',
                                    }}
                                    className={styles.container__boxleft_image_img}
                                />
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                            </>
                        ) : (
                            <div className={styles.uploadContainer}>
                                <label htmlFor="file-upload" className={styles.fileUploadLabel}>
                                    <Image
                                        src={CamIcon}
                                        alt='ícone camera'
                                        width={32}
                                        height={32}
                                        priority={true}
                                    />
                                    <input
                                        id="file-upload"
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className={styles.fileInput}
                                    />
                                </label>
                            </div>
                        )
                    }
                </div>
                <div className={styles.container__boxleft_input}>
                    <InputText
                        placeholder='Nome'
                        value={data.employee_name}
                        state={(value) => handleInputChange('employee_name', value)}
                        icon={LetterIcon.src}
                        type="text"
                        white={false}
                        width="100%"
                    />
                    <InputText
                        placeholder='Email'
                        value={data.email}
                        state={(value) => handleInputChange('email', value)}
                        icon={MailIcon.src}
                        type="email"
                        white={false}
                        width="100%"
                    />
                    <InputText
                        placeholder='CPF'
                        value={data.cpf}
                        state={(value) => handleInputChange('cpf', value)}
                        icon={CnpjIcon.src}
                        type="text"
                        white={false}
                        width="100%"
                        mask='99.999.999/9999-99'
                    />
                    <InputText
                        placeholder='Número de telefone'
                        value={data.phoneNumber}
                        state={(value) => handleInputChange('phoneNumber', value)}
                        icon={CnpjIcon.src}
                        type="text"
                        white={false}
                        width="100%"
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
                <InputText
                    placeholder='Nome da Empresa'
                    value={data.company_name}
                    state={(value) => handleInputChange('company_name', value)}
                    icon={AddressIcon.src}
                    type="text"
                    white={false}
                    width="100%"
                    mask='99999-999'
                />
                <InputText
                    placeholder='Tipo da Conta'
                    value={data.type_account}
                    state={(value) => handleInputChange('type_account', value)}
                    icon={AddressIcon.src}
                    type="text"
                    white={false}
                    width="100%"
                    disabled={true} // Usar readOnly ao invés de disabled
                />
                
                <InputText
                    placeholder='Senha'
                    value={data.password}
                    state={(value) => handleInputChange('password', value)}
                    icon={AddressIcon.src}
                    type="text"
                    white={false}
                    width="100%"
                    disabled={true} // Usar readOnly ao invés de disabled
                />
                <div className={styles.container__boxright_buttons}>
                    <button onClick={() => handleClose()} className={styles.container__boxright_buttons_close}>FECHAR</button>
                    <button onClick={() => sendRequest()} className={styles.container__boxright_buttons_add}>SALVAR</button>
                </div>
            </div>
        </div>
    );
}
