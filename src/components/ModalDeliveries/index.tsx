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
import { Alert, AlertTitle, Input } from "@mui/material";
import { IProduct } from '@/interface/Products.interface';
import CartIcon from "@/../public/img/cart-icon.svg";
import openrouteservice from 'openrouteservice';
import L from 'leaflet';
import ClearIcon from '@/../public/img/clear-icon.svg';


export default function Modal(props: IModal) {
    const { idSelected, setIdSelected, setActiveModalDelivery, companyId, showMap, setShowMap } = useGlobalState();
    const [activeType, setActiveType] = useState<boolean>(false);
    const [typeOptions, setTypeOptions] = useState<IOption[]>([]);
    const [modalError, setModalError] = useState<boolean>(false);
    const [modalSuccess, setModalSuccess] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [oneDelivery, setOneDelivery] = useState<Object>({});
    const [products, setProducts] = useState<IProduct[]>([{
        name: '',
        quantity: 0,
        value: 0,
        lenght: 0,
        width: 0,
        height: 0
    }]);
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
        distance: 1,
    });

    const axios = require('axios');

    const API_KEY = '5b3ce3597851110001cf62489d34d8fa2afa4adb8b36855f82fd819a';
    const endpoint = 'https://api.openrouteservice.org/v2/directions/driving-car';

    const origin = 'Rua das Flores, 100, São Paulo, Brasil';
    const destination = 'Av. Paulista, 1578, São Paulo, Brasil';

    const geocode = async (address: any) => {
        const geocodeUrl = `https://api.openrouteservice.org/geocode/search?text=${encodeURIComponent(address)}`;
        const response = await axios.get(geocodeUrl, {
            headers: {
                'Authorization': API_KEY,
            },
        });
        return response.data.features[0].geometry.coordinates;
    };

    // Função para calcular a rota entre os dois endereços
    const getRoute = async (origin: any, destination: any) => {
        try {
            const originCoords = await geocode(origin);
            const destinationCoords = await geocode(destination);

            const routeUrl = `${endpoint}?start=${originCoords.join(',')}&end=${destinationCoords.join(',')}`;
            const response = await axios.get(routeUrl, {
                headers: {
                    'Authorization': API_KEY,
                },
            });

            console.log('Rota:', response.data);
        } catch (error) {
            console.error('Erro ao calcular rota:', error);
        }
    };

    // Chama a função com os endereços
    getRoute(origin, destination);


    const apiKey = '5b3ce3597851110001cf62489d34d8fa2afa4adb8b36855f82fd819a';

    const MapWithRoute = () => {
        const mapRef = useRef<HTMLElement | null>(null);
        const [routeData, setRouteData] = useState<any>(null);

        useEffect(() => {
            // Verifica se mapRef.current não é null antes de inicializar o mapa
            if (mapRef.current) {
                const map = L.map(mapRef.current).setView([51.505, -0.09], 13); // Posição inicial do mapa

                // Adiciona o tile layer (camada do mapa)
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

                // Usando o cliente da API do OpenRouteService para obter rotas
                const client = new openrouteservice('5b3ce3597851110001cf62489d34d8fa2afa4adb8b36855f82fd819a');

                // Exemplo de coordenadas de dois pontos (origem e destino)
                const origin = [-0.1276, 51.5074]; // Londres (exemplo)
                const destination = [2.3522, 48.8566]; // Paris (exemplo)

                // Solicita a rota do OpenRouteService entre os dois pontos
                client.getDirections(
                    'driving-car', // Perfil: carro
                    'geojson',     // Formato da resposta: geojson
                    {
                        coordinates: [origin, destination]
                    }
                )
                    .then((response: any) => {
                        // Recebe os dados da rota
                        setRouteData(response.features[0].geometry.coordinates);

                        // Desenha a linha da rota no mapa
                        const routeLine = L.polyline(response.features[0].geometry.coordinates.map((coord: any) => [coord[1], coord[0]]), {
                            color: 'blue',
                            weight: 5,
                            opacity: 0.7
                        }).addTo(map);

                        // Ajusta o mapa para mostrar a rota
                        map.fitBounds(routeLine.getBounds());
                    })
                    .catch((error) => {
                        console.error('Erro ao obter a rota: ', error);
                    });
            }
        }, []);

        return (
            <div>
                <h2>Rota entre dois lugares</h2>
                <div
                    ref={mapRef}
                    style={{ width: '100%', height: '500px' }}
                ></div>
            </div>
        );
    };
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
            distance: 1,
            products: []
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
                setOneDelivery(res.data);
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

    const handleProductChange = (field: keyof IProduct, value: string | number, index: number) => {
        if (field == 'name') {
            typeOptions.forEach((element: any) => {
                if (element.name == value) {
                    setProducts(prevProducts => {
                        const updatedProducts = [...prevProducts];
                        updatedProducts[index] = {
                            ...updatedProducts[index],
                            'value': Math.max(0, parseFloat(element.value)),
                            'width': Math.max(0, parseFloat(element.width)),
                            'height': Math.max(0, parseFloat(element.height)),
                            'lenght': Math.max(0, parseFloat(element.lenght))
                        };
                        return updatedProducts;
                    });
                }
            });
        }

        if (typeof value === 'number' && value >= 0) {
            setProducts(prevProducts => {
                const updatedProducts = [...prevProducts];
                updatedProducts[index] = { ...updatedProducts[index], [field]: value };
                return updatedProducts;
            });
        } else if (typeof value === 'string' && !isNaN(parseFloat(value)) && parseFloat(value) >= 0) {
            setProducts(prevProducts => {
                const updatedProducts = [...prevProducts];
                updatedProducts[index] = { ...updatedProducts[index], [field]: parseFloat(value) };
                return updatedProducts;
            });
        }

        setProducts(prevProducts => {
            const updatedProducts = [...prevProducts];
            updatedProducts[index] = { ...updatedProducts[index], [field]: value };
            return updatedProducts;
        });
    }

    const handleRemoveProduct = (index: number) => {
        setProducts(prevProducts => {
            const updatedProducts = [...prevProducts];
            updatedProducts.splice(index, 1); // Remove o produto no índice especificado
            return updatedProducts;
        });
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
            {/* Mensagem de erro */}
            {modalError && (
                <div className={styles.container__modal}>
                    <Alert severity="error">
                        <AlertTitle>ERRO</AlertTitle>
                        {modalMessage}
                    </Alert>
                </div>
            )}

            {/* Mensagem de sucesso */}
            {modalSuccess && (
                <div className={styles.container__modal}>
                    <Alert severity="success">
                        <AlertTitle>AVISO</AlertTitle>
                        {modalMessage}
                    </Alert>
                </div>
            )}

            {/* Condicional para exibir mapa ou formulário */}
            {showMap ? (<div><h1>Teste</h1></div>) : (
                <>
                    {/* Box esquerdo */}
                    <div className={styles.container__boxleft}>
                        <h1 className={styles.container__boxleft_title}>
                            {idSelected !== null ? 'Visualizar' : 'Adicionar'} {props.title}
                        </h1>

                        <div className={styles.container__boxleft_input}>
                            {/* Campos de entrada */}
                            <InputText
                                placeholder="Nome"
                                value={data.name}
                                state={(value) => handleInputChange('name', value)}
                                icon={LetterIcon.src}
                                type="text"
                                white={false}
                                width="100%"
                            />
                            <InputText
                                placeholder="Remetente (email)"
                                value={data.sender}
                                state={(value) => handleInputChange('sender', value)}
                                icon={MailIcon.src}
                                type="text"
                                white={false}
                                width="100%"
                            />
                            <InputText
                                placeholder="Destinatário (email)"
                                value={data.recipient}
                                state={(value) => handleInputChange('recipient', value)}
                                icon={CnpjIcon.src}
                                type="text"
                                white={false}
                                width="100%"
                            />
                            <InputText
                                placeholder="Data de envio"
                                value={data.send_date}
                                state={(value) => handleInputChange('send_date', value)}
                                icon={CompanyIcon.src}
                                type="date"
                                white={false}
                                width="100%"
                            />

                            {/* Produtos */}
                            <div style={{minHeight: '140px', maxHeight: '200px', overflowY: 'auto'}}>
                                {products.map((product: IProduct, index: number) => (
                                    <div style={{ display: 'flex', width: '100%', gap: '10px', marginBottom: '10px' }} key={product.id}>
                                        <SelectOption
                                            placeholder="Produtos"
                                            active={activeType}
                                            options={typeOptions}
                                            setActive={setActiveType}
                                            width="80%"
                                            value={product.name}
                                            setValue={(value) => handleProductChange('name', value, index)}
                                            backgroundBlue
                                        />
                                        <InputText
                                            placeholder="Quantidade"
                                            value={(products[index].quantity)}
                                            state={(value) => handleProductChange('quantity', parseInt(value), index)}
                                            icon={CartIcon.src}
                                            type="number"
                                            white={false}
                                            width="20%"
                                            min={0}
                                        />
                                        <button
                                            onClick={() => handleRemoveProduct(index)}
                                            style={{ 
                                                marginLeft: '10px', 
                                                cursor: 'pointer', 
                                                background: 'transparent',
                                                border: 'none'
                                            }}
                                        >
                                            <Image src={ClearIcon} alt='Remover' />
                                        </button>
                                    </div>

                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
                                <button
                                    className='container__boxleft_input_add_button'
                                    style={{width: '40%', backgroundColor: '#f1f5f9', borderRadius: '10px', border: 'none', height: '40%', padding: '15px', cursor: 'pointer'}}
                                    onClick={() =>
                                        setProducts((prevProducts) => [
                                            ...prevProducts,
                                            { name: '', quantity: 0, value: 0, lenght: 0, width: 0, height: 0 },
                                        ])
                                    }
                                >
                                    <span style={{fontWeight: '600'}}>Adicionar Outro Produto</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Box direito */}
                    <div className={styles.container__boxright}>
                        {/* Botão de fechar */}
                        <div className={styles.container__boxright_close}>
                            <div
                                className={styles.container__boxright_close_content}
                                onClick={handleClose}
                            >
                                <Image src={CloseIcon} alt="Fechar" width={12} height={12} />
                            </div>
                        </div>

                        {/* Endereço de saída */}
                        <h1>Endereço de saída</h1>
                        <InputText
                            placeholder="CEP"
                            value={data.starting_cep}
                            state={(value) => handleInputChange('starting_cep', value)}
                            icon={AddressIcon.src}
                            type="text"
                            white={false}
                            width="100%"
                            mask="99999-999"
                        />
                        <InputText
                            placeholder="Rua"
                            value={data.starting_street}
                            state={(value) => handleInputChange('starting_street', value)}
                            icon={AddressIcon.src}
                            type="text"
                            white={false}
                            width="100%"
                            disabled
                        />
                        <InputText
                            placeholder="Cidade"
                            value={data.starting_city}
                            state={(value) => handleInputChange('starting_city', value)}
                            icon={AddressIcon.src}
                            type="text"
                            white={false}
                            width="100%"
                            disabled
                        />
                        <InputText
                            placeholder="Estado"
                            value={data.starting_state}
                            state={(value) => handleInputChange('starting_state', value)}
                            icon={AddressIcon.src}
                            type="text"
                            white={false}
                            width="100%"
                            disabled
                        />
                        <InputText
                            placeholder="Número"
                            value={data.starting_number}
                            state={(value) => handleInputChange('starting_number', value)}
                            icon={NumberIcon.src}
                            type="number"
                            white={false}
                            width="50%"
                        />

                        {/* Endereço de chegada */}
                        <h1>Endereço de chegada</h1>
                        <InputText
                            placeholder="CEP"
                            value={data.destination_cep}
                            state={(value) => handleInputChange('destination_cep', value)}
                            icon={AddressIcon.src}
                            type="text"
                            white={false}
                            width="100%"
                            mask="99999-999"
                        />
                        <InputText
                            placeholder="Rua"
                            value={data.destination_street}
                            state={(value) => handleInputChange('destination_street', value)}
                            icon={AddressIcon.src}
                            type="text"
                            white={false}
                            width="100%"
                            disabled
                        />
                        <InputText
                            placeholder="Cidade"
                            value={data.destination_city}
                            state={(value) => handleInputChange('destination_city', value)}
                            icon={AddressIcon.src}
                            type="text"
                            white={false}
                            width="100%"
                            disabled
                        />
                        <InputText
                            placeholder="Estado"
                            value={data.destination_state}
                            state={(value) => handleInputChange('destination_state', value)}
                            icon={AddressIcon.src}
                            type="text"
                            white={false}
                            width="100%"
                            disabled
                        />
                        <InputText
                            placeholder="Número"
                            value={data.destination_number}
                            state={(value) => handleInputChange('destination_number', value)}
                            icon={NumberIcon.src}
                            type="number"
                            white={false}
                            width="50%"
                        />

                        {/* Botões */}
                        <div className={styles.container__boxright_buttons}>
                            <button
                                onClick={handleClose}
                                className={styles.container__boxright_buttons_close}
                            >
                                FECHAR
                            </button>
                            <button
                                onClick={() => {
                                    data.products = products;
                                    sendRequest();
                                }}
                                className={styles.container__boxright_buttons_add}
                            >
                                SALVAR
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
