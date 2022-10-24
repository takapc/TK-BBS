import styles from "../styles/main.module.css";
import { toast, Toaster } from "react-hot-toast";
import Chat from "../components/message.js";
import Router from "next/router";
import { useState } from "react";
import { animateScroll as scroll, Element as ScrollElement, scroller } from "react-scroll";

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
    const [isSubmitting, setSubmitting] = useState(false);
    const [name, setName] = useState("");
    const [text, setText] = useState("");

    const nameChange = (e) => {
        setName(() => e.target.value);
    };

    const textChange = (e) => {
        setText(() => e.target.value);
    };

    const updateResponseAnchor = (id) => {
        const regex = />>\d*([\s\S]*)/gm;
        const responseAnchor = ">>" + id;
        let body = "";

        if (text.match(regex)) {
            body = text.replace(regex, "$1").trim();
        } else if (text.startsWith(">>")) {
            body = text.replace(/>>*([\s\S]*)/gm, "$1").trim();
        } else {
            body = text;
        }
        setText(responseAnchor + " " + body);

        toast(id + 'に返信中',
            {
                icon: '↩️',
                duration: 1000,
                style: {
                    borderRadius: '40px',
                    background: '#333',
                    color: '#fff',
                },
                position: "bottom-center"
            }
        );
    }

    async function onSubmit() {
        if (text == "") {
            toast.error("本文が空です");
            return;
        }

        const toastId = toast.loading("投稿中...");
        setSubmitting(true);

        const chat = await fetch("https://tk-api.onrender.com/get")
            .catch((e) => {
                setSubmitting(false);
                toast.error("投稿に失敗しました", { id: toastId })
                throw Error(e);
            });

        const data = await chat.json();

        let ids = [0];
        data.docs.map((value) => {
            ids.push(value.id);
        });
        ids.sort((a, b) => a - b).reverse();

        const postItem = {
            id: ids[0] + 1,
            name: `${name ? name : "名無し"}`,
            content: text,
            created: Date.now(),
        };

        const res = await fetch("https://tk-api.onrender.com/post", {
            method: "POST",
            body: JSON.stringify(postItem),
            headers: {
                "Content-Type": "application/json",
            },
        }).catch((e) => {
            toast.error("投稿に失敗しました", { id: toastId })
            setSubmitting(false);
            throw Error(e);
        });

        if (res.ok) {
            toast.success("投稿しました", { id: toastId });
            setText("")
            Router.push("/", undefined, { scroll: false });
            scroll.scrollToBottom();
        } else {
            toast.error("投稿に失敗しました", { id: toastId });
        }

        setSubmitting(false);
    }

    async function onReload() {
        Router.push("/", undefined, { scroll: false });
        toast.success("更新しました");
        scroll.scrollToBottom({
            duration: 500,
            smooth: 'easeOutExpo'
        });
    }

    const scrollToPost = (id) => {
        window.location.hash = ""
        window.location.hash = id
        window.scrollBy({ top: -420 })
        console.log(id);
    }

    return (
        <div>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className={styles.fixedComponentsContainer}>
                <h1 className={styles.titlePos}>
                    <span className={styles.title}>TK 匿名掲示板</span>
                </h1>

                <h2 className={styles.formTitle}>新規投稿</h2>
                <div className={styles.inputForm}>
                    <input
                        className={styles.inputName}
                        value={name}
                        placeholder="名前"
                        onChange={nameChange}
                    ></input>
                    <textarea
                        className={styles.inputContent}
                        value={text}
                        placeholder="本文"
                        maxLength="1000"
                        onChange={textChange}
                    ></textarea>
                    <button className={styles.sendChat} onClick={onSubmit} disabled={isSubmitting}>
                        投稿
                    </button>
                    <button className={styles.sendChat} onClick={onReload}>
                        更新
                    </button>
                </div>
            </div>
            <div className={styles.messagesContainer}>
                {messages.map((value) => {
                    const regex = />>(\d*)([\s\S]*)/gm;
                    let messageId;
                    let messageBody;
                    let Content;

                    if (value.content.match(regex)) {
                        messageId = value.content.replace(regex, "$1");
                        messageBody = value.content.replace(regex, "$2");
                        Content = (
                            <p><span onClick={() => scrollToPost(messageId)} className={styles.responseAnchor}>
                                {">>" + messageId}
                            </span>{messageBody}</p>
                        )
                        console.debug(value.id, value.content, messageId, messageBody);
                        console.debug(Content)
                    } else {
                        Content = (
                            <p>{value.content}</p>
                        );
                    }


                    return (
                        <div id={value.id} key={value._id}>
                            <ScrollElement name={value.id.stringify}>
                                <Chat
                                    id={value.id}
                                    name={value.name}
                                    created={value.created}
                                    onClick={updateResponseAnchor}
                                >
                                    {Content}
                                </Chat>
                            </ScrollElement>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
