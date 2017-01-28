module.exports = function Hello() {
  this.greet = function() {
    return 'ETI rocks';
  };

  return this;
};

// document.addEventListener('turbolinks:click', (event) => {
//   if (event.target.getAttribute('href').charAt(0) === '#') {
//     return event.preventDefault()
//   }
// });
