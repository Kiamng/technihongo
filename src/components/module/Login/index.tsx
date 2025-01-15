import LoginForm from "./login-form";
import LoginIntroduction from "./login-introduction";

export default function LoginModule() {
  return (
    <div className="w-full h-full p-8 ">
      <div className="flex justify-between mx-52 items-center">
        <LoginIntroduction />
        <LoginForm />
      </div>
    </div>
  );
}
