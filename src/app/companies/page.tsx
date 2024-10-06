import styles from '@/styles/Companies.module.sass';
import TabCompanies from "@/app/companies/Tab";

export default function Companies(){
    return(
        <section className={styles.container}>
            <section className={styles.container__content}>
                <div className={styles.container__content_title}>
                    <h1>Empresas</h1>
                </div>
                <div>
                    <TabCompanies/>
                </div>
            </section>
        </section>
    )
}