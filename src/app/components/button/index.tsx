import styles from './Button.module.sass';
import {IButton} from "@/app/interface/Button.interface";

export default function Button(props: IButton){
    return(
        <button
            className={styles.button}
            disabled={props.disabled}
            onClick={async () => await props.function()}>
            {props.content}
        </button>
    )
}