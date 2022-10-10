import styles from "../styles/chat.module.css";

export default function Chat({ children, id, name }) {
    let date = new Date();
    date = date.toLocaleString();

    return (
        <>
            <div className={styles.chatBack}>
                {id}
                <span className={styles.name}> {name}</span>
                <span className={styles.date}></span>
                <p className={styles.chat}>{children}</p>
            </div>
        </>
    );
}
