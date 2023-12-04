export default function logout() {
  document.getElementById('logout').addEventListener('click', function() {
    window.location.href = '/logout';
  });
}
