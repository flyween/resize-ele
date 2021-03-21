const isMbDevice = () => {
  return (
    // in app
    !window.navigator ||
    // in browser
    /Mobile|Android|webOS|iPhone|iPad|Phone/i.test(navigator.userAgent)
  )
}

export { isMbDevice }
