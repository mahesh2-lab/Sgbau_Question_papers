import { SignIn } from "@clerk/nextjs";

export default function SignInOrUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center  ">
      <div className="">
        <SignIn routing="path" path="/sign-in" />
      </div>
    </div>
  );
}
