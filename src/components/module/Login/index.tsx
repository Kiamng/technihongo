import LoginForm from "./login-form";
import LoginIntroduction from "./login-introduction";

export default function LoginModule() {
  return (
    <div className="w-full h-screen p-8 bg-[#56D071] flex items-center">
      <div className="flex justify-between mx-40 items-center ">
        <LoginIntroduction />
        <LoginForm />
      </div>
    </div>
  );
}
