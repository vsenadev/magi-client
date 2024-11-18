'use client'

import { IInputText } from "@/interface/InputText.interface";
import styles from './InputText.module.sass';

// Função utilitária para aplicar a máscara
const applyMask = (value: string, mask: string): string => {
    let maskedValue = '';
    let valueIndex = 0;
    let maskIndex = 0;

    while (valueIndex < value.length && maskIndex < mask.length) {
        if (mask[maskIndex] === '9') {
            if (/\d/.test(value[valueIndex])) {
                maskedValue += value[valueIndex];
                valueIndex++;
            }
            maskIndex++;
        } else {
            maskedValue += mask[maskIndex];
            if (value[valueIndex] === mask[maskIndex]) {
                valueIndex++;
            }
            maskIndex++;
        }
    }

    return maskedValue;
}

export default function InputText(props: IInputText) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Se houver uma máscara, aplicá-la
        if (props.mask) {
            value = applyMask(value, props.mask);
        }

        // Atualiza o valor no componente pai
        props.state(value);
    }

    return (
        <input
            placeholder={props.placeholder}
            value={props.value}
            onChange={handleChange}
            style={{
                background: `url(${props.icon})`,
                backgroundColor: props.white ? '#FFFF' : '#F1F5F9',
                backgroundPosition: '10px center',
                backgroundSize: '24px',
                backgroundRepeat: 'no-repeat',
                width: props.width
            }}
            type={props.type}
            className={styles.input}
            readOnly={props.disabled}
            min={0}
        />
    )
}
