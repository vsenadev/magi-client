import styles from '@/styles/Companies.module.sass';
import TabCompanies from "@/app/companies/Tab";
import TableCompanies from "@/app/companies/Table";

export default function Companies(){
    return(
        <section className={styles.container}>
            <section className={styles.container__content}>
                <div className={styles.container__content_title}>
                    <h1>Empresas</h1>
                </div>
                <div className={styles.container__content_tab}>
                    <TabCompanies/>
                </div>
                <div className={styles.container__content_table}>
                    <TableCompanies/>
                </div>
            </section>
        </section>
    )
}