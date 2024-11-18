'use client';

import styles from '@/components/ModalDeliveries/Modal.module.sass';
import { useGlobalState } from "@/context/globalState";
import { IModal } from "@/interface/Modal.interface";
import { http } from "@/environment/environment";
import { useEffect, useState } from "react";
import CloseIcon from "@/../public/img/close-icon.svg";
import LetterIcon from "@/../public/img/letter-icon.svg";
import MailIcon from "@/../public/img/mail-icon.svg";
import CnpjIcon from "@/../public/img/cnpj-icon.svg";
import CompanyIcon from "@/../public/img/companies-icon.svg";
import AddressIcon from "@/../public/img/address-icon.svg";
import NumberIcon from "@/../public/img/number-icon.svg";
import {IDelivery, IOneDelivery} from "@/interface/Deliveries.interface";
import Image from "next/image";
import InputText from "@/components/InputText";
import SelectOption from "@/components/SelectOption";
import { IOption } from "@/interface/SelectOption.interface";
import axios from "axios";
import { Alert, AlertTitle, Input } from "@mui/material";
import { IProduct } from '@/interface/Products.interface';
import CartIcon from "@/../public/img/cart-icon.svg";
import ClearIcon from '@/../public/img/clear-icon.svg';
import {MapContainer, TileLayer, Polyline, useMap} from 'react-leaflet';

export default function Modal(props: IModal) {
    const { idSelected, setIdSelected, setActiveModalDelivery, companyId, showMap, setShowMap } = useGlobalState();
    const [activeType, setActiveType] = useState<boolean>(false);
    const [typeOptions, setTypeOptions] = useState<IOption[]>([]);
    const [modalError, setModalError] = useState<boolean>(false);
    const [modalSuccess, setModalSuccess] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [oneDelivery, setOneDelivery] = useState<IOneDelivery>({
      starting_street: "",
      starting_number: 0,
      starting_city: "",
      starting_state: "",
      destination_street: "",
      destination_number: 0,
      destination_city: "",
      destination_state: "",
      status: "",
      lock_status: "",
      expected_route: [],
      traced_route: [],
    });

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
        setShowMap(false);
        setIdSelected(null);
        cleanValues();
        setActiveModalDelivery(false);
    };


    async function getWithId() {
        if (idSelected !== null) {
            await http.get(`v1/delivery/${idSelected}`).then((res) => {
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
        getWithId()
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

    function CenterMap({ position }: { position: [number, number] }) {
        const map = useMap();

        useEffect(() => {
            if (position) {
                map.setView(position, 15); // Centraliza o mapa na posição inicial com o zoom 15
            }
        }, [position, map]);

        return null;
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

            {showMap ? (
              //div com duas divs dentro uma encima da outra
              <div style={{display: "flex", flexDirection: "column", gap: "16px", width: "100%", padding: "1rem"}}>
                  {/*div com divs dentro uma em sequência da outra*/}
                  <div style={{display: "flex", gap: "8px"}}>
                      {/*divs azul bem claro com informações lado a lado usando a font montseraat*/}
                      <div style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          backgroundColor: "#e0f7fa",
                          padding: "8px",
                          borderRadius: "4px",
                          fontFamily: "'Montserrat', sans-serif"
                      }}>
                          <span>Remetente</span>
                          <span>{oneDelivery.starting_street}, {oneDelivery.starting_number} - {oneDelivery.starting_city}, {oneDelivery.starting_state}</span>
                      </div>
                      <div style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          backgroundColor: "#e0f7fa",
                          padding: "8px",
                          borderRadius: "4px",
                          fontFamily: "'Montserrat', sans-serif"
                      }}>
                          <span>Destino</span>
                          <span>{oneDelivery.destination_street}, {oneDelivery.destination_number} - {oneDelivery.destination_city}, {oneDelivery.destination_state}</span>
                      </div>
                      <div style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          backgroundColor: "#e0f7fa",
                          padding: "8px",
                          borderRadius: "4px",
                          fontFamily: "'Montserrat', sans-serif"
                      }}>
                          <span>Status da rota</span>
                          <span>{oneDelivery.status}</span>
                      </div>
                      <div style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          backgroundColor: "#e0f7fa",
                          padding: "8px",
                          borderRadius: "4px",
                          fontFamily: "'Montserrat', sans-serif"
                      }}>
                          <span>Status da tranca</span>
                          <span>{oneDelivery.lock_status}</span>
                      </div>
                      <div className={styles.container__boxright_close} style={{width:'20px'}}>
                          <div
                            className={styles.container__boxright_close_content}
                            onClick={handleClose}
                          >
                              <Image src={CloseIcon} alt="Fechar" width={12} height={12}/>
                          </div>
                      </div>
                  </div>
                  {/*div maior que ocupa por volta de 80% do modal*/}
                  <div style={{flex: 1, height: "80%", border: "1px solid #ccc", borderRadius: "8px", padding: "16px"}}>
                      <MapContainer
                        style={{height: '100%', width: '100%'}}
                        center={
                            oneDelivery.expected_route?.[0]
                              ? [oneDelivery.expected_route[0].latitude, oneDelivery.expected_route[0].longitude]
                              : [0, 0]
                        }
                        zoom={15}
                        scrollWheelZoom={false}
                      >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                          />
                          {oneDelivery.expected_route && Array.isArray(oneDelivery.expected_route) && (
                            <Polyline
                              positions={oneDelivery.expected_route.map((point: any) => [point.latitude, point.longitude])}
                              pathOptions={{color: 'blue', weight: 4, dashArray: '10, 10'}}
                            />
                          )}
                          {oneDelivery.traced_route && Array.isArray(oneDelivery.traced_route) && (
                            <Polyline
                              positions={oneDelivery.traced_route.map((point: any) => [point.latitude, point.longitude])}
                              pathOptions={{color: 'green', weight: 4}}
                            />
                          )}
                          {oneDelivery.expected_route?.[0] && (
                            <CenterMap
                              position={[oneDelivery.expected_route[0].latitude, oneDelivery.expected_route[0].longitude]}/>
                          )}
                      </MapContainer>
                  </div>
              </div>
            ) : (
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
                                <div style={{display: 'flex', width: '100%', gap: '10px', marginBottom: '10px'}}
                                     key={product.id}>
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
