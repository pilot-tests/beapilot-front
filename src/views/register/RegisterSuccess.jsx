import VisitorWrapper from '../../layouts/VisitorWrapper';
import LoginForm from '../../components/LoginForm';


function RegisterSuccess() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <VisitorWrapper>
      <div className="block-medium">
        <div className="alert alert--success">
          <h6>Registrado!</h6>
          <p>Haz login para acceder</p>
        </div>


        <LoginForm />
      </div>
    </VisitorWrapper>
   );
}

export default RegisterSuccess;