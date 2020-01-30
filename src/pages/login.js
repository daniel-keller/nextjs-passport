import Container from "react-bootstrap/Container";

export default function Login() {

  return (
    <Container>
      <form action="/login" method="post">
        <div>
        <label>Username:</label>
        <input type="text" name="username"/><br/>
        </div>
        <div>
        <label>Password:</label>
        <input type="password" name="password"/>
        </div>
        <div>
        <input type="submit" value="Submit"/>
        </div>
      </form>
    </Container>
  );
}
