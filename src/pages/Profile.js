import fetch from "isomorphic-fetch";

function Profile(props) {
  return (
    <div>
      <p>This is what we know about you:</p>
      <ul>
        {JSON.stringify(props.thoughts)}
      </ul>
    </div>
  );
}

Profile.getInitialProps = async ({ req }) => {
  const baseURL = req ? `${req.protocol}://${req.get("Host")}` : "";
  const res = await fetch(`${baseURL}/api/protected/thoughts`);

  return {
    thoughts: await res.json()
  };
};

export default Profile;
