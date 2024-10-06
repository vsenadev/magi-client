'use client'

import {IInputText} from "@/interface/InputText.interface";
import styles from './InputText.module.sass';

export default function InputText(props: IInputText) {
    return(
        <input
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e) => props.state(e.target.value)}
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
        />
    )
}