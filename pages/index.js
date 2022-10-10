import styles from "../styles/main.module.css";
import Chat from "../components/message";
import Router from "next/router";

export default function Home() {
    async function onSubmit() {
        const postItem = {
            id: 3,
            name: "",
            content: "",
            created: Date.now(),
        };
        const res = await fetch("/api/post", {
            method: "POST",
            body: JSON.stringify(postItem),
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(res.json);
    }
    async function onFind() {
        const res = await fetch("/api/get", {
            method: "GET",
        });
        console.log(res.json);
    }

    return (
        <div>
            <h1 className={styles.titlePos}>
                <span className={styles.title}>Main Title</span>
            </h1>
            <Chat id="1" name="名無し">
                これは糸電話です
            </Chat>
            <h2 className={styles.form}>入力フォーム</h2>
            <div className={styles.inputForm}>
                <button className={styles.sendChat} onClick={onSubmit}>
                    投稿
                </button>
                <button className={styles.sendChat} onClick={onFind}>
                    test
                </button>
                <input
                    className={styles.inputName}
                    placeholder="名前を入力"
                ></input>
                <textarea
                    className={styles.inputContent}
                    placeholder="テキストを入力"
                    maxLength="1000"
                ></textarea>
            </div>
        </div>
    );
}
