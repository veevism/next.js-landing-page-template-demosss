import React from "react"
import Header from "./Header"
import Footer from "./Footer"
import footerLinks from "../assets/footer.json"

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <div>{children}</div>
      <Footer links={footerLinks} />
    </div>
  )
}
