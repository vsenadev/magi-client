import { ITitle } from "@/interface/Title.interface";
import styles from './Title.module.sass';

export default function Title(props: ITitle) {
    return (
        <h1 className={styles.title}>{props.content}</h1>
    );
}
