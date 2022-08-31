import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAuth } from "./Context";

const MySwal = withReactContent(Swal);

function SignUp() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  let password = watch('password');

  const onSubmit = (data) => {
    delete data.confirmPassword;
    console.log(data)
    const api = 'https://todoo.5xcamp.us/users';
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch(api, {
      method: 'POST',
      headers,
      body: JSON.stringify({user: data})
    })
      .then(response => {
        setToken(response.headers.get('authorization'));
        return response.json();
      })
      .then(response => {
        if(response.error) {
          return MySwal.fire({title: `${response.message}: ${response.error.join(', ')}`})
        }
        navigate('/login');
      })
      .catch(error => {
        return MySwal.fire({title: error.message});
      })
  }

  return (
    <main>
      <div id="signUpPage" className="bg-yellow">
        <div className="conatiner signUpPage vhContainer">
          <div className="side">
            <a href="#"><img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" /></a>
            <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />
          </div>
          <div>
            <form className="formControls" onSubmit={handleSubmit(onSubmit)}>
              <h2 className="formControls_txt">註冊帳號</h2>

              <label className="formControls_label" htmlFor="email">Email</label>
              <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" {
                ...register('email', { required: {value: true, message: '必填'}, pattern: {value: /^\S+@\S+$/i, message: 'email格式有誤'}})
              } />
              <span>{errors.email?.message}</span>

              <label className="formControls_label" htmlFor="name">您的暱稱</label>
              <input className="formControls_input" type="text" name="name" id="name" placeholder="請輸入您的暱稱" {
                ...register('nickname', {})
              }/>

              <label className="formControls_label" htmlFor="pwd">密碼</label>
              <input className="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" {
                ...register('password', { required: {value: true, message: '必填'}, minLength: {value: 8, message: '長度至少8碼'}})
              } />
              <span>{errors.password?.message}</span>

              <label className="formControls_label" htmlFor="pwd">再次輸入密碼</label>
              <input className="formControls_input" type="password" name="pwdConfirm" id="pwdConfirm" placeholder="請再次輸入密碼" {
                ...register('confirmPassword', {required: {value: true, message: '必填'}, validate: (value) => value === password || '密碼不一致'})
              } />
              <span>{errors.confirmPassword?.message}</span>

              <input className="formControls_btnSubmit" type="submit" value="註冊帳號" />

              <Link to='/login' className="formControls_btnLink">登入</Link>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SignUp;