export default async function getHeaders() {
  const dataUser = localStorage.getItem('custom-auth-token');
  let token = '', email = '';
  if (dataUser !== null) {
    token = JSON.parse(dataUser).password;
    email = JSON.parse(dataUser).email;
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    email: email
  };
}
