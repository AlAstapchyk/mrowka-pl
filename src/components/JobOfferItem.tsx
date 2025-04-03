import React from "react";

const JobOfferItem = () => {
  return (
    <div className="flex flex-col rounded-xl border-[1px] border-gray-700 p-4">
      <span className="font-semibold">C# Senior Developer</span>
      <span className="text-sm">12000 zl / month</span>
      <div className="flex gap-2 pt-2">
        <svg className="h-12 w-12 bg-green-500" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Microsoft inc.</span>
          <span className="text-sm">Warsaw, Wola</span>
        </div>
      </div>
    </div>
  );
};

export default JobOfferItem;
