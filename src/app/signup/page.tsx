"use client";

import styles from "./SignupPage.module.css";
import sendRequest from "../../components/other/sendRequest";
import Popup from "../../components/popup/popup";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
// import { isValidEmail, isValidPassword, isValidPhoneNumber } from "../../components/other/formChecker";
import { domain, serverDomain } from "../../components/other/variables";
import { formValidation } from "../../components/other/usefulFunctions";
import LazyMedia from "../../components/lazyMedia/LazyMedia";

function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [content, setContent] = useState({ title: "", content: "" });

  // Form validity state to track if the button should be enabled
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [visibility, setVisibility] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleConfirm = () => {
    // Handle confirmation action
    console.log('Confirmed!');
    if (content.title === 'Success') {
      setTimeout(() => {
        window.location.href = `${domain}/login`;
      }, 1000);
    }
  };

  const isInputValid = useCallback(() => {
    // isValidEmail(email);
    // isValidPassword(password);
    // isValidPhoneNumber(phoneNumber);
    setIsFormValid(Boolean(fullName && email && password && termsAccepted && phoneNumber))
  }, [fullName, email, password, phoneNumber, termsAccepted]);

  // Check form validity on state change
  useEffect(() => {
    isInputValid();
  }, [fullName, email, password, termsAccepted, phoneNumber, isInputValid]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = formValidation({ email, password, phoneNumber })

    if (!result.success) {
      setContent({ title: "Error", content: String(result.errors) });
      setIsPopupOpen(true);
      return;
    }

    try {
      // Sending the request to the backend
      const response = await sendRequest(
        `/api/signup`,  // Replace with your server domain
        "POST",
        { fullName, email, phoneNumber, password, termsAccepted }
      );

      console.log(response);

      // if (response.token) {
      //   // Store JWT token in localStorage for future authenticated requests
      //   localStorage.setItem('token', response.token);
      //   localStorage.setItem('userRole', response.role);  // Store user role, if necessary
      // }

      // Display success message and open the popup
      setContent({ title: "Success", content: "Account created successfully!" });
      openPopup();

      // Reset form fields
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setTermsAccepted(false);

    } catch (error) {
      console.error("Signup failed:", error);
      setContent({ title: "Error", content: "Failed to create account." });
      openPopup();
    }
  };


  return (
    <div className={styles["container"]}>
      <div className={styles["registration-container"]}>
        <h1 className={styles["title"]}>Créer un compte</h1>
        <p className={styles["subtitle"]}>
          Veuillez vous inscrire ci-dessous pour créer un compte
        </p>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label>
                Nom complet <span>*</span>
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                placeholder="Prenom Nom"
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <label>
                E-Mail <span>*</span>
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email@example.xyz"
                required
              />
            </div>
          </div>

          {content && <Popup
            isOpen={isPopupOpen}
            onClose={closePopup}
            onConfirm={handleConfirm}
            title={content.title}
            content={content.content}
          />}

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label>Téléphone mobile <span>*</span></label>
              <div className={styles["mobile-input"]}>
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  type="tel"
                  placeholder="+212 6XX XX XX XX"
                  style={{ flex: 1 }}
                  required
                />
              </div>
            </div>
            <div className={styles["form-group"]}>
              <label>Mot de passe <span>*</span></label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={visibility ? "text" : "password"}
                placeholder="Mot de passe"
                required
              />
              {visibility ? (
                <LazyMedia type={'image'} src={'/images/icons/visibilityOff.svg'} onClick={() => setVisibility(!visibility)} className={styles["show-password"]} alt="hide password" width={24} height={24} unoptimized={true} />
              ) : (
                <LazyMedia type={'image'} src={'/images/icons/visibility.svg'} onClick={() => setVisibility(!visibility)} className={styles["show-password"]} alt="show password" width={24} height={24} unoptimized={true} />
              )}
            </div>
          </div>

          <div className={styles["terms"]}>
            <div className={styles["terms-checkbox"]}>
              <input
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                type="checkbox"
                id="terms"
                required
              />
            </div>
            <label htmlFor="terms">
              En créant un compte, vous acceptez les Conditions Générales & la
              Politique de Confidentialité.
            </label>
          </div>

          <button
            type="submit"
            className={styles["create-button"]}
          >
            Créer un compte
          </button>

          <p className={styles["login-link"]}>
            Vous avez déjà un compte? <Link href="/login">Connectez-vous</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
