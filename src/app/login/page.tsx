"use client";

import styles from "./LoginPage.module.css";
import { useState } from 'react';
import Link from "next/link";
import sendRequest from "../../components/other/sendRequest";
import { serverDomain } from "../../components/other/variables";
import Popup from "../../components/popup/popup";


function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [content, setContent] = useState({ title: "", content: "" });
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [visibility, setVisibility] = useState(false);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = { email, password }
        const response = await sendRequest(`/api/login`, "POST", data);
        console.log(response);
        if (!response.error) {
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));
            window.location.href = "/profile";
        } else {
            setContent({
                title: "Vous ne pouvez pas connecter",
                content: response.error
            });
            openPopup();
        }
    }


    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const handleConfirm = () => {
        // Handle confirmation action

    };
    return (
        <div className={styles["container"]}>
            {content && <Popup
                isOpen={isPopupOpen}
                onClose={closePopup}
                onConfirm={handleConfirm}
                title={content.title}
                content={content.content}
            />}
            <form onSubmit={handleSubmit}>
                <div className={styles["pseudo-body"]}>
                    <div className={styles["form-container"]}>
                        <h1>Connexion avec E-mail</h1>
                        <p>Vous n'avez pas encore de compte ? <Link href={'/signup'} className={styles["create-account"]}>Créer un compte</Link></p>
                        <hr></hr>

                        <div className={styles["input-container"]}>
                            <div className={styles.inputContainer}>
                                <label>E-Mail <span>*</span></label>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email@example.xyz" required />
                            </div>
                            <div className={styles.inputContainer}>
                                <label>Mot de passe <span>*</span></label>
                                <input value={password} onChange={(e) => setPassword(e.target.value)} type={visibility ? "text" : "password"} placeholder="Mot de passe" required />
                                {visibility ? (
                                    <img src="/images/icons/visibilityOff.svg" alt="hide password" onClick={() => setVisibility(!visibility)} className={styles["show-password"]} />
                                ) : (
                                    <img src="/images/icons/visibility.svg" alt="show password" onClick={() => setVisibility(!visibility)} className={styles["show-password"]} />
                                )}
                            </div>
                        </div>

                        <button type="submit" className={styles["login-btn"]}>CONNEXION</button>

                        <div className={styles["forgot-password-div"]}>Mot de passe oublié ? <Link href={"/resetpass"} className={styles["reset"]}>Réinitialiser le mot de passe</Link></div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;