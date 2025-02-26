import LoginForm from "./login-form";
import LoginIntroduction from "./login-introduction";

export default function LoginModule() {
  return (
    <div className="w-full h-screen flex items-center">
      <LoginIntroduction />
      <LoginForm />
    </div>
  );
}
