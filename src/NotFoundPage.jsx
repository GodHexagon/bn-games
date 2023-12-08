function NotFoundPage() {
  console.error("The requested URL was not found on this server.")
  return(
    <>
      <h1>BN Games</h1>
      <h2>404 Page Not Found</h2>
      <p>You can go to <a href="/janken-s">Janken S</a> Game page.</p>
    </>
  )
}
export default NotFoundPage