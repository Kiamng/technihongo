import RegisterForm from "./register-form";
import RegisterIntroduction from "./register-introduction";

export default function SignInModule() {
  return (
    <div className="w-full h-full p-8 ">
      <div className="flex justify-between mx-52 items-center">
        <RegisterIntroduction />
        <RegisterForm />
      </div>
    </div>
  );
}
