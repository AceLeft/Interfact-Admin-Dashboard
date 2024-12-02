'use client';
import { useRouter  } from "next/navigation";
import React, { useState } from "react"

export default function Home() {
  const router = useRouter();
  const [passkey, setPasskey] = useState("");

  const enterPasskey = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passkey === "interfact") {
      router.push("/cities"); 
    } else {
      console.log("Invalid passkey");
    }
  }

  return (
    <div>
      <div className="home-container">
        <div className="home-left shadow">
          <div className="logo-2 shadow">
              <img src="https://interfact.net/images/logo.png" alt="" />
              <div className="logo-words-2">
                <span className="logo2-2">INTERFACT</span>
                <span className="logo3-2">ADMIN DASHBOARD</span>
              </div>
            </div>

            <img className="home-train-image" src="home-train5.webp" alt="" />
        </div>
          
        <div className="home-right shadow">
          <div className="home-form">
            <h1 className="passkey">Passkey</h1>
            <form action="" onSubmit={enterPasskey}>
              <input type="text" value={passkey} onChange={(e) => setPasskey(e.target.value)}/>
              <button className="enter-button">ENTER</button>
            </form>
          </div>
        </div>
      </div>
    </div>
 
  );
}
