'use client'

import { CurrencyInput } from 'react-currency-mask';
import styles from './InputText.module.sass';
import { ICurrencyInputText } from '@/interface/CurrencyInput.interface';

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

const removeMask = (value: string): number => {
    const cleanedValue = value.replace(/[^\d]+/g, '');
    return parseFloat(cleanedValue) / 100;
}

export default function CurrencyInputText(props: ICurrencyInputText) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Se houver uma máscara, aplicá-la
        if (props.mask) {
            value = applyMask(value, props.mask);
        }

        const numericValue = removeMask(value);

        // Atualiza o valor no componente pai
        props.state(numericValue);
    }

    return (

        <CurrencyInput
            // @ts-ignore
            placeholder={props.placeholder}
            value={props.value}
            onChangeValue={handleChange}
            prefix="R$ "
            decimalseparator=","
            groupseparator="."
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
        />
    )
}
