import { Form } from "../components/form";

export default function Page() {
  return (
    <div className="container relative h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <Form action="signup" />
    </div>
  );
}
