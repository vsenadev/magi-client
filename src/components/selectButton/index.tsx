'use client';

import {ISelectButtonInterface} from "@/interface/SelectButton.interface";
import styles from './SelectButton.module.sass';

export default function SelectButton(props: ISelectButtonInterface){

    return(
        <div className={styles.container}>
            <div className={`${styles.container__option} ${props.type ? styles.container__option_selected : ''}`} onClick={() => props.state(true)}>
                <span>{props.firstOption}</span>
            </div>
            <div className={`${styles.container__option} ${!props.type ? styles.container__option_selected : ''}`} onClick={() => props.state(false)}>
                <span>{props.lastOption}</span>
            </div>
        </div>
    )
}