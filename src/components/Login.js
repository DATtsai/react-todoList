import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAuth, useUser } from "./Context";

const MySwal = withReactContent(Swal);

function Login() {
  const { setToken } = useAuth();
  const { setUser } = useUser();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    const api = 'https://todoo.5xcamp.us/users/sign_in';
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch(api, {
      method: 'POST',
      headers,
      body: JSON.stringify({user: data})
    })
      .then(response => {
        if(response.status === 401) {
          throw new Error('登入失敗，帳號或密碼有誤')
        }
        setToken(response.headers.get('authorization'));
        return response.json();
      })
      .then(response => {
        const { email, nickname } = response;
        setUser(nickname);
        navigate('/');
      })
      .catch(error => {
        return MySwal.fire({title: error.message});
      })
  }

  return (
    <main>
      <div id="loginPage" className="bg-yellow">
        <div className="conatiner loginPage vhContainer ">
          <div className="side">
            <a href="#"><img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" /></a>
            <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />
          </div>
          <div>
            <form className="formControls" onSubmit={handleSubmit(onSubmit)}>
              <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
              
              <label className="formControls_label" htmlFor="email">Email</label>
              <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" {
                ...register('email', { required: {value: true, message: '此欄位不可留空'}, pattern: {value: /^\S+@\S+$/i, message: 'email格式有誤'}})
              } />
              <span>{errors.email?.message}</span>
              
              <label className="formControls_label" htmlFor="pwd">密碼</label>
              <input className="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" {
                ...register('password', { required: {value: true, message: '此欄位不可留空'}, minLength: {value: 6, message: '長度至少6碼'}})
              } />
              <span>{errors.password?.message}</span>

              <input className="formControls_btnSubmit" type="submit" value="登入" />

              <Link to='/signup' className="formControls_btnLink">註冊帳號</Link>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;