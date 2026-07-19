import { useState } from "react";

function Contact() {

  const [message, setMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="container">

      <section>

        <h2>Contact Me</h2>

        <input
          type="text"
          placeholder="Enter your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <p><strong>You Typed:</strong> {message}</p>

        <p>Character Count: {message.length}</p>

        <button onClick={() => setShowHelp(!showHelp)}>
          Toggle Help
        </button>

        {showHelp && (
          <p>Please enter your message above.</p>
        )}

      </section>

    </div>
  );
}

export default Contact;