import styles from './SelectOption.module.sass';
import { IOption, ISelectOption } from "@/interface/SelectOption.interface";

export default function SelectOption(props: ISelectOption) {
    return (
        <div className={styles.container} onClick={() => props.setActive(!props.active)} style={{width: props.width}}>
            <span>{!props.value ? props.placeholder : props.value}</span>
            <span className={`${styles.arrow} ${props.active ? styles.active : ''}`}></span>
            {props.active && (
                <div className={styles.container__box}>
                    {props.options.map((option: IOption) => (
                        <div onClick={() => props.setValue(option.name)} className={styles.container__box_option}
                             key={option.name}>
                            <span>{option.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
