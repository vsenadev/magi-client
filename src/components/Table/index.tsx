import styles from '@/components/Table/Table.module.sass'
import {IHeader, ITable} from "@/interface/Table.interface";

export default function HeaderTable(props: ITable){
    return(
        <div className={styles.container}>
            <div className={styles.container__header}>
                {
                    props.header?.map((element: IHeader, index: number) =>
                        (
                            <div className={styles.container__header_div} style={{width: element.width, borderRight: element.border ? 'solid 1px rgba(0, 0, 0, 0.14)' : ''}} key={element.title + index}>
                                <span>{element.title}</span>
                            </div>
                        )
                    )
                }
            </div>
        </div>
    )
}