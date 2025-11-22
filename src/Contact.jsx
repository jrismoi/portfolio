import "./Contact.css";


function Contact({ id }) {
  return (
    <section className="contact" id={id}>
      <h2>Contact</h2>
      <p>
        Email:{" "}
        <a href="mailto:morellana@uchicago.edu">morellana@uchicago.edu</a>
      </p>
      <p>Phone number: 678-735-0725</p>
    </section>
  );
}

export default Contact;
