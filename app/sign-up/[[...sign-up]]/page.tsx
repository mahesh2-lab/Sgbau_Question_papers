import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-black/40 backdrop-blur-md p-6 shadow-2xl">
        <SignUp
          appearance={{
            layout: {
              socialButtonsVariant: "iconButton",
            },
            variables: {
              colorPrimary: "#7c3aed",
              colorText: "#e2e8f0",
              colorBackground: "rgba(0,0,0,0)",
              colorInputBackground: "rgba(30,41,59,0.6)",
              colorInputText: "#f1f5f9",
              colorDanger: "#ef4444",
            },
            elements: {
              card: "bg-transparent shadow-none",
              headerTitle: "text-2xl font-bold tracking-tight",
              headerSubtitle: "text-sm text-slate-400",
              socialButtons: "gap-2",
              formButtonPrimary:
                "bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-colors",
              footerActionLink:
                "text-violet-400 hover:text-violet-300 font-medium transition-colors",
              dividerLine: "bg-slate-700",
              dividerText: "text-slate-400",
            },
          }}
          routing="path"
          path="/sign-up"
        />
      </div>
    </div>
  );
}
