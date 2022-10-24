import styles from "../styles/chat.module.css";

export default function Chat({ children, id, name, created, onClick }) {
    created = created.toString();
    created = created.replace("T", " ").replace("Z", " ");

    return (
        <>
            <div className={styles.chatBack}>
                {id}
                <span className={styles.name}onClick={() => onClick(id)}>
                    {" "}
                    {name} {created}
                </span>
                <span className={styles.date}></span>
                <div className={styles.chat}>{children}</div>
            </div>
        </>
    );
}
