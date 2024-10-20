import styles from './SelectOption.module.sass';
import { IOption, ISelectOption } from "@/interface/SelectOption.interface";

export default function SelectOption(props: ISelectOption) {
    return (
        <div className={styles.container} onClick={() => props.setActive(!props.active)} style={{width: props.width, backgroundColor: props.backgroundBlue ? '#F1F5F9' : ''}}>
            <span>{!props.value ? props.placeholder : props.value}</span>
            <span className={`${styles.arrow} ${props.active ? styles.active : ''}`}></span>
            {props.active && (
                <div
                    style={{backgroundColor: props.backgroundBlue ? '#F1F5F9' : ''}}
                    className={styles.container__box}>
                    {props.options.map((option: IOption) => (
                        option.name !== props.value && (
                            <div onClick={() => props.setValue(option.value === '' ? option.value : option.name)}
                                 className={styles.container__box_option}
                                 key={option.name}>
                                <span>{option.name}</span>
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
}
