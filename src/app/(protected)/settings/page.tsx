import ChangePasswordButton from "@/components/Settings/ChangePasswordButton";
import DeleteAccountButton from "@/components/Settings/DeleteAccountButton";
import React from "react";

const page = () => {
  return (
    <div className="container mb-8 flex grow flex-col p-6">
      <h1 className="mb-6 text-2xl font-semibold">Settings</h1>
      <div className="m-auto flex grow flex-col items-center justify-center gap-6">
        <ChangePasswordButton />
        <DeleteAccountButton />
        <span className="flex flex-col items-center gap-1">
          In case of any problems or you want to write feedback, write to
          e-mail:{" "}
          <a href="mailto:alastapchyk@gmail.com" className="underline">
            alastapchyk@gmail.com
          </a>
        </span>
      </div>
    </div>
  );
};

export default page;
