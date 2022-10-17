import styles from "../styles/main.module.css";
import Chat from "../components/message.js";
import Router from "next/router";
import { useState } from "react";

export async function getServerSideProps() {
    const chat = await fetch("https://tk-api.onrender.com/get");
    const data = await chat.json();
    let ids = [0];
    data.docs.map((value) => {
        ids.push(value.id);
    });
    ids.sort().reverse();
    return {
        props: {
            messages: data.docs,
            id: ids,
        },
    };
}

export default function Home({ messages }) {
    const [name, setName] = useState("名無し");
    const [text, setText] = useState("");

    const nameChange = (e) => {
        setName(() => e.target.value);
    };
    const textChange = (e) => {
        setText(() => e.target.value);
    };
    async function onSubmit() {
        if (text == "") return;
        const chat = await fetch("https://tk-api.onrender.com/get");
        const data = await chat.json();
        let ids = [0];
        data.docs.map((value) => {
            ids.push(value.id);
        });
        ids.sort((a, b) => a - b).reverse();
        const postItem = {
            id: ids[0] + 1,
            name: `${name}`,
            content: text,
            created: Date.now().setHours(Date.now().getHours() + 9),
        };
        const res = await fetch("https://tk-api.onrender.com/post", {
            method: "POST",
            body: JSON.stringify(postItem),
            headers: {
                "Content-Type": "application/json",
            },
        });
        Router.push("/", undefined, { scroll: false });
    }

    async function onReload() {
        Router.push("/", undefined, { scroll: false });
    }
    return (
        <div>
            <h1 className={styles.titlePos}>
                <span className={styles.title}>TK 匿名掲示板</span>
            </h1>
            {messages.map((value) => {
                return (
                    <div key={value._id}>
                        <Chat
                            id={value.id}
                            name={value.name}
                            created={value.created}
                        >
                            {value.content}
                        </Chat>
                    </div>
                );
            })}
            <h2 className={styles.form}>入力フォーム</h2>
            <div className={styles.inputForm}>
                <button className={styles.sendChat} onClick={onSubmit}>
                    投稿
                </button>
                <button className={styles.sendChat} onClick={onReload}>
                    更新
                </button>
                <input
                    className={styles.inputName}
                    placeholder="名前を入力"
                    onChange={nameChange}
                ></input>
                <textarea
                    className={styles.inputContent}
                    placeholder="テキストを入力"
                    maxLength="1000"
                    onChange={textChange}
                ></textarea>
            </div>
        </div>
    );
}
