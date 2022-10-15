import styles from "../styles/chat.module.css";

export default function Chat({ children, id, name, created }) {
    created = created.toString();
    created = created.replace("T", "").replace("Z", "");

    return (
        <>
            <div className={styles.chatBack}>
                {id}
                <span className={styles.name}>
                    {" "}
                    {name} {created}
                </span>
                <span className={styles.date}></span>
                <p className={styles.chat}>{children}</p>
            </div>
        </>
    );
}
