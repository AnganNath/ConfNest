import { Link } from 'react-router-dom';

export default function Nav(){
  return (
    <nav style={{display:'flex', gap:12, padding:8, borderBottom:'1px solid #ddd'}}>
      <Link to="/">ConfNest</Link>
      <Link to="/login">Login</Link>
      <Link to="/submit">Submit</Link>
      <Link to="/create-conference">Create Conference</Link>

    </nav>
  );
}
