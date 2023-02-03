import Image from "next/image";
import React, { useEffect, useState } from "react";

function ContactItem() {
  const [showDot, setShowDot] = useState(false);

  function handleClick() {
    setShowDot(false);
  }

  return (
    <div
      className={`flex flex-row items-center space-x-3 py-2 px-1 rounded-[15px] cursor-pointer w-full overflow-hidden ${
        1=== 1 && "bg-[#F0F0F0]"
      }`}
      onClick={() => handleClick()}
    >
      <div className="relative overflow-hidden w-9 h-9 rounded-full bg-te-gray">
        <Image
          objectFit="cover"
          layout="fill"
          alt="profile-img"
          loader={({ src }) => src}
          src={"/images/avatar.svg"}
        />
      </div>
      <div className="text-ellipsis text-[#303030] font-semibold w-3/5">
        Niranjan S.
      </div>
      {showDot && <div className="w-5 h-5 bg-te-blue rounded-full"></div>}
    </div>
  );
}

export default React.memo(ContactItem);