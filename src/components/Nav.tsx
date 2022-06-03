import React from "react"
import useMetaMask from "../hooks/useMetamask"

const Nav = (_props: any) => {
  const { connect, disconnect, isActive, account } = useMetaMask()

  function handleClick () {
    isActive ? disconnect() : connect()
  }

  const shortenedAddress = account && account.substring(0, 4) + "..." + account.substring(account.length - 4)

  return (
    <div
      style={{
        width: "100%",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        paddingTop: 16,
        top: 0,
      }}
    >
      <a
        href='/'
        className='horiz'
        style={{
          textDecoration: "none",
          color: "#F5F7Ff",
          marginRight: "auto",
        }}
      >
        <img src='/favicon.ico' width={32} height={32} style={{ marginRight: 8 }}></img>
        <h4
          style={{
            fontFamily: "'Dela Gothic One', Roboto, Helvetica, sans-serif",
          }}
        >
          PWN
        </h4>
      </a>

      <button
        className='action-button squircle smaller'
        style={{
          height: 38,
          marginLeft: "auto",
          ...(isActive
            ? {
                background: "transparent",
                color: "#0089FF",
                fontWeight: 500,
              }
            : {}),
        }}
        onClick={handleClick}
      >
        {isActive ? shortenedAddress : "Connect Wallet"}
      </button>
    </div>
  )
}

export default Nav
