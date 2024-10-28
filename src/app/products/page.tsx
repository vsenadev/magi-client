import styles from '@/styles/Companies.module.sass';
import TabProducts from "@/app/products/Tab";
import TableProducts from "@/app/products/Table";

export default function Products(){
    return(
        <section className={styles.container}>
            <section className={styles.container__content}>
                <div className={styles.container__content_title}>
                    <h1>Produtos</h1>
                </div>
                <div className={styles.container__content_tab}>
                    <TabProducts/>
                </div>
                <div className={styles.container__content_table}>
                    <TableProducts/>
                </div>
            </section>
        </section>
    )
}