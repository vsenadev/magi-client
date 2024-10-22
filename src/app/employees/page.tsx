import styles from '@/styles/Companies.module.sass';
import TableEmployees from "@/app/employees/Table";
import TabEmployees from '@/app/employees/Tab';

export default function Companies(){
    return(
        <section className={styles.container}>
            <section className={styles.container__content}>
                <div className={styles.container__content_title}>
                    <h1>Funcionários</h1>
                </div>
                <div className={styles.container__content_tab}>
                    <TabEmployees/>
                </div>
                <div className={styles.container__content_table}>
                    <TableEmployees/>
                </div>
            </section>
        </section>
    )
}