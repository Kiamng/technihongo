import RegisterForm from "./register-form";
import RegisterIntroduction from "./register-introduction";

export default function SignInModule() {
  return (
    <div className="w-full h-screen flex items-center">
      <RegisterIntroduction />
      <RegisterForm />
    </div>
  );
}
