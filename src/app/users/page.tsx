import styles from '@/styles/Companies.module.sass';
import TableUsers from "@/app/users/Table";
import TabUsers from '@/app/users/Tab';

export default function Users(){
    return(
        <section className={styles.container}>
            <section className={styles.container__content}>
                <div className={styles.container__content_title}>
                    <h1>Funcionários</h1>
                </div>
                <div className={styles.container__content_tab}>
                    <TabUsers/>
                </div>
                <div className={styles.container__content_table}>
                    <TableUsers/>
                </div>
            </section>
        </section>
    )
}