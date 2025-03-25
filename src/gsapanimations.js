

export const animateNavbar = () => {
  gsap.to('#vidit', {
    y: -100,        // Start the element off-screen
    opacity: 0,     // Fade the element in
    duration: 1,    // Animation duration (1 second)
    ease: 'power2.out',  // Smooth easing function
  });
};
animateNavbar()